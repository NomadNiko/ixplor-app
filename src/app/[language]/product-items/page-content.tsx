import { useState, useEffect, useCallback } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from '@/services/auth/use-auth';
import { ProductItem, ProductItemStatus, FilterOptions } from '@/components/product-item/types/product-item.types';
import { ProductItemCard } from '@/components/product-item/product-item-card';
import { ProductItemFilters } from '@/components/product-item/product-item-filters';

const ITEMS_PER_PAGE = 12;

export default function ProductItemsContent() {
  const { user } = useAuth();
  const { t } = useTranslation("product-items");
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    filterType: '',
    filterStatus: '',
    sortOrder: 'desc'
  });

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        return;
      }

      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const vendorResponse = await fetch(`${API_URL}/v1/vendors/user/${user.id}/owned`, {
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

      const vendorId = vendorData.data[0]._id;
      const response = await fetch(`${API_URL}/product-items/by-vendor/${vendorId}`, {
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
  }, [user?.id, enqueueSnackbar, t]);

  const handleUpdateStatus = async (itemId: string, newStatus: ProductItemStatus) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        return;
      }

      const response = await fetch(`${API_URL}/product-items/${itemId}/status`, {
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

      enqueueSnackbar(t('success.statusUpdated'), { variant: 'success' });
      loadItems();
    } catch (error) {
      console.error('Error updating status:', error);
      enqueueSnackbar(t('errors.updateFailed'), { variant: 'error' });
    }
  };

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const filteredAndSortedItems = items
    .filter(item => {
      const searchFields = [
        item.templateName || '',
        item.description || '',
        item.notes || ''
      ].map(field => field.toLowerCase());
      
      const matchesSearch = filters.searchTerm === '' || 
        searchFields.some(field => field.includes(filters.searchTerm.toLowerCase()));
      const matchesType = !filters.filterType || item.productType === filters.filterType;
      const matchesStatus = !filters.filterStatus || item.itemStatus === filters.filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      // Convert date and time strings to ISO format for proper comparison
      const dateTimeA = new Date(`${a.productDate}T${a.startTime}:00`);
      const dateTimeB = new Date(`${b.productDate}T${b.startTime}:00`);
      
      // Ensure both dates are valid before comparison
      if (isNaN(dateTimeA.getTime()) || isNaN(dateTimeB.getTime())) {
        return 0; // Return 0 if either date is invalid
      }
      
      // Compare timestamps
      const comparison = dateTimeA.getTime() - dateTimeB.getTime();
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredAndSortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    loadItems();
  }, [loadItems]);

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('title')}
        </Typography>
        <Typography color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Box>

      <ProductItemFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Grid container spacing={3}>
        {paginatedItems.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item._id}>
            <ProductItemCard
              item={item}
              onUpdateStatus={handleUpdateStatus}
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

      {filteredAndSortedItems.length > 0 && (
        <Box sx={{ 
          mt: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <Select
              value={ITEMS_PER_PAGE}
              disabled
            >
              <MenuItem value={ITEMS_PER_PAGE}>{ITEMS_PER_PAGE}</MenuItem>
            </Select>
            <Typography variant="caption" color="text.secondary">
              {t('common:pagination.rowsPerPage')}
            </Typography>
          </FormControl>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />

          <Typography variant="body2" color="text.secondary">
            {t('common:pagination.showing')} {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredAndSortedItems.length)} {t('common:pagination.of')} {filteredAndSortedItems.length}
          </Typography>
        </Box>
      )}
    </Container>
  );
}