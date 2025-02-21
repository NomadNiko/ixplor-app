"use client";
import { useState } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus } from 'lucide-react';
import { useTranslation } from "@/services/i18n/client";
import { BookingItem, BookingItemStatusEnum, CreateBookingItemDto, UpdateBookingItemDto } from '@/hooks/booking/types';
import { useBookingItems } from '@/hooks/booking/use-booking-items';
import { BookingItemCard } from '@/components/booking-items/BookingItemCard';
import { BookingItemCreateModal } from '@/components/booking-items/BookingItemCreateModal';
import { BookingItemEditModal } from '@/components/booking-items/BookingItemEditModal';
import { BookingItemFilters, BookingItemFilters as FilterType } from '@/components/booking-items/BookingItemFilters';

export default function BookingItemsContent() {
  const { t } = useTranslation("booking-items");
  const { 
    loading, 
    error,
    getBookingItemsByVendor,
    createBookingItem,
    updateBookingItem, 
  } = useBookingItems();

  const [items, setItems] = useState<BookingItem[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BookingItem | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    status: '',
    sortOrder: 'asc'
  });

  const handleFilterChange = (field: keyof FilterType, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateItem = async (data: CreateBookingItemDto): Promise<void> => {
    try {
      await createBookingItem(data);
      const updatedItems = await getBookingItemsByVendor(data.vendorId);
      setItems(updatedItems);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleUpdateItem = async (data: UpdateBookingItemDto): Promise<void> => {
    if (!editingItem?._id) return;
    
    try {
      await updateBookingItem(editingItem._id, data);
      const updatedItems = await getBookingItemsByVendor(editingItem.vendorId);
      setItems(updatedItems);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleStatusChange = async (item: BookingItem, status: BookingItemStatusEnum): Promise<void> => {
    try {
      await updateBookingItem(item._id, { status });
      const updatedItems = await getBookingItemsByVendor(item.vendorId);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = !filters.search || 
      item.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
      (item.description?.toLowerCase().includes(filters.search.toLowerCase()) ?? false);
    
    const matchesStatus = !filters.status || item.status === filters.status;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (filters.sortOrder === 'asc') {
      return a.price - b.price;
    }
    return b.price - a.price;
  });

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>{t('title')}</Typography>
          <Typography color="text.secondary">{t('subtitle')}</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          {t('createNew')}
        </Button>
      </Box>

      <BookingItemFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <BookingItemCard
              item={item}
              onEdit={() => setEditingItem(item)}
              onStatusChange={async (status) => handleStatusChange(item, status)}
            />
          </Grid>
        ))}
      </Grid>

      <BookingItemCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateItem}
        vendorId=""
      />

      {editingItem && (
        <BookingItemEditModal
          open={true}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdateItem}
          onStatusChange={async (status) => handleStatusChange(editingItem, status)}
          item={editingItem}
        />
      )}
    </Container>
  );
}