"use client";
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
import StaffShiftGeneratorCard from '@/components/staff-shifts/generator/StaffShiftGeneratorCard';

interface ShiftGeneratorPageContentProps {
  staffId: string;
}

interface StaffUser {
  _id: string;
  name: string;
}

export default function ShiftGeneratorPageContent({ staffId }: ShiftGeneratorPageContentProps) {
  const { t } = useTranslation("staff-shifts");
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

        const response = await fetch(`${API_URL}/staff-users/${staffId}`, {
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
  }, [staffId, router]);

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
        {t("generateShifts")}
      </Typography>
      <Typography color="text.secondary" paragraph>
        {t("generateSubtitle")}
      </Typography>

      <StaffShiftGeneratorCard
        staffId={staffUser._id}
        staffName={staffUser.name}
        onSuccess={() => router.push('/staff-users')}
        onCancel={() => router.push('/staff-users')}
      />
    </Container>
  );
}