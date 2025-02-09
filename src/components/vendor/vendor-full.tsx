import { useState, useEffect, useCallback, JSX } from 'react';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { Phone, Mail, X, Globe } from "lucide-react";
import { Image } from "@nextui-org/react";
import { useTranslation } from "@/services/i18n/client";
import PublicWeeklyCalendar from '../calendar/PublicWeeklyCalendar';
import PublicItemDetailModal from '../calendar/PublicItemDetailModal';
import { Vendor } from "@/app/[language]/types/vendor";
import { ProductItem, ProductItemStatus } from '@/app/[language]/types/product-item';
import { API_URL } from "@/services/api/config";
import { useCartQuery } from '@/hooks/use-cart-query';
import useGuestCart from '@/hooks/use-guest-cart';
import useAuth from '@/services/auth/use-auth';
import { useSnackbar } from "@/hooks/use-snackbar";
import { useAddToCartService } from '@/services/api/services/cart';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface VendorFullViewProps {
  vendor: Vendor;
  onClose: () => void;
}

interface PublicProductItemsResponse {
  data: ProductItem[];
  message?: string;
}

export const VendorFullView = ({ vendor, onClose }: VendorFullViewProps): JSX.Element => {
  const addToCart = useAddToCartService();
  const { t } = useTranslation("vendor");
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const { refreshCart } = useCartQuery();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { addToGuestCart } = useGuestCart();

  const fetchItems = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/product-items/by-vendor/${vendor._id}/public`);
      if (!response.ok) throw new Error('Failed to fetch items');
      
      const data: PublicProductItemsResponse = await response.json();
      const activeItems = data.data.filter((item: ProductItem) => 
        item.itemStatus === ProductItemStatus.PUBLISHED
      );
      setItems(activeItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      enqueueSnackbar(t('errors.loadFailed'), { variant: 'error' });
    }
  }, [vendor._id, enqueueSnackbar, t]);

  const refreshItems = useCallback(async (): Promise<void> => {
    await fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    const loadInitialItems = async (): Promise<void> => {
      setLoading(true);
      await fetchItems();
      setLoading(false);
    };

    loadInitialItems();
  }, [fetchItems]);

  const handleAddToCart = async (item: ProductItem): Promise<void> => {
    try {
      setAddingToCart(item._id);
      
      if (user) {
        await addToCart({ 
          productItemId: item._id,
          productDate: new Date(item.productDate),
          quantity: 1,
          vendorId: vendor._id,
          templateId: item.templateId
        });
        await refreshCart();
      } else {
        addToGuestCart({
          productItemId: item._id,
          templateId: item.templateId,
          templateName: item.templateName,
          productName: item.templateName,
          quantity: 1,
          price: item.price,
          vendorId: vendor._id,
          productType: item.productType,
          productDate: item.productDate,
          productStartTime: item.startTime,
          productDuration: item.duration
        });
      }
      
      enqueueSnackbar(t('success.addedToCart'), { variant: 'success' });
      setSelectedItem(null);
      
      // Refresh items to update quantities
      await refreshItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
      enqueueSnackbar(t('errors.addToCartFailed'), { variant: 'error' });
    } finally {
      setAddingToCart(null);
    }
  };

  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+ff0000(${
    vendor.location.coordinates[0]
  },${
    vendor.location.coordinates[1]
  })/${
    vendor.location.coordinates[0]
  },${
    vendor.location.coordinates[1]
  },14,0/400x200@2x?access_token=${MAPBOX_TOKEN}`;

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 200,
      padding: { xs: 1, sm: 2 },
      overflow: 'auto'
    }}>
      <Card sx={{
        maxWidth: 'md',
        margin: '0 auto',
        minHeight: '100%'
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 60, height: 60 }}>
                {vendor.logoUrl && (
                  <Image 
                    src={vendor.logoUrl} 
                    alt={vendor.businessName}
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                )}
              </Box>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {vendor.businessName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {vendor.description}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small">
              <X size={16} />
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            {/* Contact Info */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t("contact")}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone size={14} />
                    <Link href={`tel:${vendor.phone}`} color="inherit">{vendor.phone}</Link>
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail size={14} />
                    <Link href={`mailto:${vendor.email}`} color="inherit">{vendor.email}</Link>
                  </Typography>
                  {vendor.website && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Globe size={14} />
                      <Link href={vendor.website} target="_blank" rel="noopener noreferrer" color="inherit">
                        {t("visitWebsite")}
                      </Link>
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Location Info */}
              <Typography variant="subtitle1" gutterBottom>
                {t("location")}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {vendor.address}<br />
                {vendor.city}, {vendor.state} {vendor.postalCode}
              </Typography>
              <Box sx={{ height: 200, mb: 2, borderRadius: 1, overflow: 'hidden' }}>
                <img
                  src={staticMapUrl}
                  alt="Location map"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </Grid>

            {/* Calendar/Products View */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t("availableProducts")}
                </Typography>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : items.length > 0 ? (
                  <PublicWeeklyCalendar
                    items={items}
                    onItemClick={setSelectedItem}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center">
                    {t("noProducts")}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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

export default VendorFullView;