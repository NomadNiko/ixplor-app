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
import { StaffUser, FilterOptions } from '@/components/staff-user/types/staff-user';
import { StaffUserFilters } from '@/components/staff-user/StaffUserFilters';
import { StaffUserCard } from '@/components/staff-user/StaffUserCard';

export default function StaffUsersContent() {
  const { user } = useAuth();
  const { t } = useTranslation("staff-users");
  const router = useRouter();
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    filterStatus: '',
    sortOrder: 'desc'
  });

  const loadStaffUsers = useCallback(async () => {
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
        setStaffUsers([]);
        return;
      }

      const vendorId = vendorData.data[0]._id;
      const response = await fetch(`${API_URL}/staff-users/vendor/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load staff users');
      }

      const data = await response.json();
      setStaffUsers(data.data);
    } catch (error) {
      console.error('Error loading staff users:', error);
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

  useEffect(() => {
    loadStaffUsers();
  }, [loadStaffUsers]);

  const filteredAndSortedStaffUsers = staffUsers
    .filter(staffUser => {
      const searchFields = [
        staffUser.name || '',
        staffUser.email || '',
        staffUser.phone || '',
        staffUser.notes || ''
      ].map(field => field.toLowerCase());
      
      const matchesSearch = filters.searchTerm === '' || 
        searchFields.some(field => field.includes(filters.searchTerm.toLowerCase()));
      const matchesStatus = !filters.filterStatus || staffUser.status === filters.filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          onClick={() => router.push('/staff-users/create')}
        >
          {t('createStaffUser')}
        </Button>
      </Box>

      <StaffUserFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Grid container spacing={3}>
        {filteredAndSortedStaffUsers.map((staffUser) => (
          <Grid item xs={12} sm={6} md={4} key={staffUser._id}>
            <StaffUserCard
              staffUser={staffUser}
              onClick={() => router.push(`/staff-users/${staffUser._id}/edit`)}
            />
          </Grid>
        ))}
        {filteredAndSortedStaffUsers.length === 0 && (
          <Grid item xs={12}>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center"
              sx={{ py: 8 }}
            >
              {t('noStaffUsers')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}