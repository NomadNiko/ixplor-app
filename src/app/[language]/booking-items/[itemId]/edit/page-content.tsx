'use client';

import { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import BookingItemEditCard from '@/components/cards/edit-cards/BookingItemEditCard';
import { BookingItem, BookingItemStatusEnum } from '@/components/booking-item/types/booking-item';

interface BookingItemEditContentProps {
  itemId: string;
}

export default function BookingItemEditContent({ itemId }: BookingItemEditContentProps) {
  const { t } = useTranslation("booking-items");
  const router = useRouter();
  const [item, setItem] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          router.push('/sign-in');
          return;
        }

        const response = await fetch(`${API_URL}/booking-items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load booking item');
        }

        const data = await response.json();
        setItem(data.data);
      } catch (error) {
        console.error('Error loading booking item:', error);
        router.push('/booking-items');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [itemId, router, t]);

  const handleDelete = async (itemId: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const response = await fetch(`${API_URL}/booking-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking item');
      }

      router.push('/booking-items');
    } catch (error) {
      console.error('Error deleting booking item:', error);
    }
  };

  const handleStatusChange = async (itemId: string, status: BookingItemStatusEnum) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const response = await fetch(`${API_URL}/booking-items/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update booking item status');
      }

      const data = await response.json();
      setItem(data.data);
    } catch (error) {
      console.error('Error updating booking item status:', error);
    }
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 64px)'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="error">
            {t('itemNotFound')}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("editItem")}
      </Typography>
      <Typography color="text.secondary" paragraph>
        {t("editSubtitle")}
      </Typography>
      
      <BookingItemEditCard 
        item={item}
        onSave={() => router.push('/booking-items')}
        onCancel={() => router.push('/booking-items')}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </Container>
  );
}