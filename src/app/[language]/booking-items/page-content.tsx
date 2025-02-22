"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus } from 'lucide-react';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from '@/services/auth/use-auth';
import { BookingItem, FilterOptions } from '@/components/booking-item/types/booking-item';
import { BookingItemCard } from '@/components/booking-item/BookingItemCard';
import { BookingItemFilters } from '@/components/booking-item/BookingItemFilters';

export default function BookingItemsContent() {
  const { user } = useAuth();
  const { t } = useTranslation("booking-items");
  const router = useRouter();
  const [items, setItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    filterStatus: '',
    sortOrder: 'desc'
  });

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
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemClick = (itemId: string) => {
    router.push(`/booking-items/${itemId}/edit`);
  };

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filteredAndSortedItems = items
    .filter(item => {
      const searchFields = [
        item.productName || '',
        item.description || ''
      ].map(field => field.toLowerCase());
      
      const matchesSearch = filters.searchTerm === '' || 
        searchFields.some(field => field.includes(filters.searchTerm.toLowerCase()));
      const matchesStatus = !filters.filterStatus || item.status === filters.filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sortOrder === 'asc') {
        return a.price - b.price;
      }
      return b.price - a.price;
    });

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

      <BookingItemFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Grid container spacing={3}>
        {filteredAndSortedItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <BookingItemCard
              item={item}
              onClick={() => handleItemClick(item._id)}
            />
          </Grid>
        ))}
        {filteredAndSortedItems.length === 0 && (
          <Grid item xs={12}>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center"
              sx={{ py: 8 }}
            >
              {t('noItems')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}