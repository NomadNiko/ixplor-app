import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus } from 'lucide-react';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from '@/services/auth/use-auth';
import { BookingItem, BookingItemStatusEnum } from '@/components/booking-item/types/booking-item';
import { useSnackbar } from '@/hooks/use-snackbar';
import { CollapsibleSection } from '@/components/booking-item/CollapsibleSection';

export default function BookingItemsContent() {
  const { user } = useAuth();
  const { t } = useTranslation("booking-items");
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  
  const [items, setItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const vendorResponse = await fetch(`${API_URL}/v1/vendors/user/${user?.id}/owned`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (!vendorResponse.ok) {
        throw new Error('Failed to fetch vendor information');
      }

      const vendorData = await vendorResponse.json();
      if (!vendorData.data.length) {
        setItems([]);
        return;
      }

      const response = await fetch(`${API_URL}/booking-items/by-vendor/${vendorData.data[0]._id}`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load items');
      }

      const data = await response.json();
      setItems(data.data);
    } catch (error) {
      console.error('Error loading items:', error);
      enqueueSnackbar(t('errors.loadFailed'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user?.id, t, enqueueSnackbar]);

  const handleItemClick = (itemId: string) => {
    router.push(`/booking-items/${itemId}/edit`);
  };

  const handleStatusChange = async (itemId: string, newStatus: BookingItemStatusEnum) => {
    try {
      setUpdatingItemId(itemId);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const response = await fetch(`${API_URL}/booking-items/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedItem = await response.json();
      
      // Update the items list with the new status
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? updatedItem.data : item
        )
      );

      enqueueSnackbar(t('success.statusUpdated'), { variant: 'success' });
    } catch (error) {
      console.error('Error updating status:', error);
      enqueueSnackbar(t('errors.statusUpdateFailed'), { variant: 'error' });
    } finally {
      setUpdatingItemId(null);
    }
  };

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Filter and group items by status
  const filteredItems = useMemo(() => {
    const filtered = items.filter(item =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      published: filtered.filter(item => item.status === BookingItemStatusEnum.PUBLISHED),
      draft: filtered.filter(item => item.status === BookingItemStatusEnum.DRAFT),
      archived: filtered.filter(item => item.status === BookingItemStatusEnum.ARCHIVED)
    };
  }, [items, searchTerm]);

  if (loading) {
    return (
      <Container sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)',
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <div>
          <Typography variant="h4" gutterBottom>
            {t('title')}
          </Typography>
          <Typography color="text.secondary">
            {t('subtitle')}
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={() => router.push('/booking-items/create')}
        >
          {t('createBookingItem')}
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      <CollapsibleSection
        title={t('sections.published')}
        items={filteredItems.published}
        defaultOpen={true}
        badgeColor="success"
        onItemClick={handleItemClick}
        onStatusChange={handleStatusChange}
        updatingItemId={updatingItemId}
      />

      <CollapsibleSection
        title={t('sections.draft')}
        items={filteredItems.draft}
        defaultOpen={true}
        badgeColor="warning"
        onItemClick={handleItemClick}
        onStatusChange={handleStatusChange}
        updatingItemId={updatingItemId}
      />

      <CollapsibleSection
        title={t('sections.archived')}
        items={filteredItems.archived}
        defaultOpen={false}
        badgeColor="error"
        onItemClick={handleItemClick}
        onStatusChange={handleStatusChange}
        updatingItemId={updatingItemId}
      />
    </Container>
  );
}