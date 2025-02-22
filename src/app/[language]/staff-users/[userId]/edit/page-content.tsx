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
import StaffUserEditCard from '@/components/cards/edit-cards/StaffUserEditCard';
import { StaffUser, StaffUserStatusEnum } from '@/components/staff-user/types/staff-user';

interface StaffUserEditPageContentProps {
  userId: string;
}

export default function StaffUserEditPageContent({ userId }: StaffUserEditPageContentProps) {
  const { t } = useTranslation("staff-users");
  const router = useRouter();
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaffUser = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          router.push('/sign-in');
          return;
        }
        
        const response = await fetch(`${API_URL}/staff-users/${userId}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load staff user');
        }

        const data = await response.json();
        setStaffUser(data.data);
      } catch (error) {
        console.error('Error loading staff user:', error);
        router.push('/staff-users');
      } finally {
        setLoading(false);
      }
    };

    loadStaffUser();
  }, [userId, router, t]);

  const handleDelete = async (userId: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const response = await fetch(`${API_URL}/staff-users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff user');
      }

      router.push('/staff-users');
    } catch (error) {
      console.error('Error deleting staff user:', error);
    }
  };

  const handleStatusChange = async (userId: string, status: StaffUserStatusEnum) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const response = await fetch(`${API_URL}/staff-users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update staff user status');
      }

      const data = await response.json();
      setStaffUser(data.data);
    } catch (error) {
      console.error('Error updating staff user status:', error);
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

  if (!staffUser) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="error">
            {t('staffUserNotFound')}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("editStaffUser")}
      </Typography>
      <Typography color="text.secondary" paragraph>
        {t("editSubtitle")}
      </Typography>
      
      <StaffUserEditCard 
        staffUser={staffUser}
        onSave={() => router.push('/staff-users')}
        onCancel={() => router.push('/staff-users')}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </Container>
  );
}