import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { X, MapPin, Clock } from 'lucide-react';
import ToggleButton from '@mui/material/ToggleButton';
import { useTranslation } from "@/services/i18n/client";
import { useTheme } from '@mui/material/styles';
import { ProductItem } from '@/app/[language]/types/product-item';
import { StyledToggleButtonGroup } from '@/components/map/styled-components';
import PublicItemDetailModal from '@/components/calendar/PublicItemDetailModal';
import { useCartQuery } from '@/hooks/use-cart-query';
import useGuestCart from '@/hooks/use-guest-cart';
import useAuth from '@/services/auth/use-auth';
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { format } from 'date-fns';

interface NearbyActivitiesProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

// Haversine formula for calculating distance between coordinates
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const NearbyActivities: React.FC<NearbyActivitiesProps> = ({
  isOpen,
  onClose,
  currentLocation
}) => {
  const theme = useTheme();
  const { t } = useTranslation("home");
  const { user } = useAuth();
  const addToCart = useCartQuery();
  const { enqueueSnackbar } = useSnackbar();
  const { addToGuestCart } = useGuestCart();

  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [sortType, setSortType] = useState<'time' | 'distance'>('distance');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleSortChange = (_: React.MouseEvent<HTMLElement>, newValue: 'time' | 'distance' | null) => {
    if (newValue !== null) {
      setSortType(newValue);
    }
  };

  const fetchNearbyItems = async () => {
    try {
      setLoading(true);
      setError(false);
      const tokensInfo = getTokensInfo();
      
      const response = await fetch(
        `${API_URL}/product-items/nearby?lat=${currentLocation.latitude}&lng=${currentLocation.longitude}&radius=10`,
        {
          headers: tokensInfo?.token ? {
            Authorization: `Bearer ${tokensInfo.token}`
          } : {}
        }
      );

      if (!response.ok) throw new Error('Failed to fetch items');
      
      const data = await response.json();
      setItems(data.data);
    } catch (err) {
      console.error('Error fetching nearby items:', err);
      setError(true);
      enqueueSnackbar(t('errors.loadFailed'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item: ProductItem): Promise<void> => {
    try {
      setAddingToCart(item._id);
      
      if (user) {
        await addToCart.addItem({
          productItemId: item._id,
          productDate: new Date(item.productDate),
          quantity: 1,
          vendorId: item.vendorId,
          templateId: item.templateId
        });
        await addToCart.refreshCart();
      } else {
        addToGuestCart({
          productItemId: item._id,
          templateId: item.templateId,
          templateName: item.templateName,
          productName: item.templateName,
          quantity: 1,
          price: item.price,
          vendorId: item.vendorId,
          productType: item.productType,
          productDate: item.productDate,
          productStartTime: item.startTime,
          productDuration: item.duration
        });
      }
      
      enqueueSnackbar(t('success.addedToCart'), { variant: 'success' });
      setSelectedItem(null);
      fetchNearbyItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
      enqueueSnackbar(t('errors.addToCartFailed'), { variant: 'error' });
    } finally {
      setAddingToCart(null);
    }
  };

  const sortedItems = useMemo(() => {
    const itemsToSort = [...items];
    
    return itemsToSort.sort((a, b) => {
      if (sortType === 'time') {
        return new Date(`${a.productDate}T${a.startTime}`).getTime() - 
               new Date(`${b.productDate}T${b.startTime}`).getTime();
      }

      const distanceA = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        a.location.coordinates[1],
        a.location.coordinates[0]
      );

      const distanceB = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        b.location.coordinates[1],
        b.location.coordinates[0]
      );

      return distanceA - distanceB;
    });
  }, [items, sortType, currentLocation]);

  useMemo(() => {
    if (isOpen) {
      fetchNearbyItems();
    }
  }, [isOpen, currentLocation]);

  if (!isOpen) return null;

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      bgcolor: 'background.paper',
      borderTopLeftRadius: theme.spacing(2),
      borderTopRightRadius: theme.spacing(2),
      boxShadow: 3,
      zIndex: 1200,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6">
          {t('nearbyActivities')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <StyledToggleButtonGroup
            size="small"
            value={sortType}
            exclusive
            onChange={handleSortChange}
          >
            <ToggleButton value="distance">
              <MapPin size={16} />
            </ToggleButton>
            <ToggleButton value="time">
              <Clock size={16} />
            </ToggleButton>
          </StyledToggleButtonGroup>
          <IconButton onClick={onClose} size="small">
            <X />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        p: 2
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {t('errors.loadFailed')}
          </Typography>
        ) : sortedItems.length === 0 ? (
          <Typography color="text.secondary" align="center">
            {t('noNearbyActivities')}
          </Typography>
        ) : (
          sortedItems.map((item) => {
            const distance = calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              item.location.coordinates[1],
              item.location.coordinates[0]
            );

            return (
              <Box
                key={item._id}
                onClick={() => setSelectedItem(item)}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: 'background.glass',
                  '&:hover': {
                    bgcolor: 'background.glassHover'
                  }
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  {item.templateName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <Clock size={16} className="mr-1" />
                    {format(new Date(`${item.productDate}T${item.startTime}`), 'PPp')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <MapPin size={16} className="mr-1" />
                    {distance.toFixed(1)} mi
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {selectedItem && (
        <PublicItemDetailModal
          item={selectedItem}
          open={true}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
          isAddingToCart={addingToCart === selectedItem._id}
        />
      )}
    </Box>
  );
};

export default NearbyActivities;