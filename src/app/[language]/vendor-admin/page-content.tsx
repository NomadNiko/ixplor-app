import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { useTranslation } from "@/services/i18n/client";
import { useGetAllVendorsService } from "@/services/api/services/vendors";
import { useEffect, useState } from 'react';
import { Vendor, VendorStatusEnum } from "@/app/[language]/types/vendor";
import { useSnackbar } from "@/hooks/use-snackbar";
import { VendorManagementCard } from "@/components/vendor/vendor-management-card";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";

export default function VendorAdminPage() {
  const { t } = useTranslation("vendor-admin");
  const { enqueueSnackbar } = useSnackbar();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const getAllVendors = useGetAllVendorsService();

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await getAllVendors();
      if (response.status === HTTP_CODES_ENUM.OK && response.data) {
        const allVendors = response.data.data;
        setVendors(allVendors);
      } else {
        enqueueSnackbar(t('errors.failedToLoadVendors'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      enqueueSnackbar(t('errors.failedToLoadVendors'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVendorAction = async (id: string, action: VendorStatusEnum, notes: string) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
      return;
    }
    try {
      const updateData = {
        vendorStatus: action,
        ...(action === VendorStatusEnum.ACTION_NEEDED ? { actionNeeded: notes } : {}),
        ...(notes ? { adminNotes: notes } : {})
      };
      const response = await fetch(`${API_URL}/vendors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify(updateData)
      });
      if (!response.ok) {
        throw new Error('Failed to update vendor');
      }
      const result = await response.json();
      
      if (result.data) {
        enqueueSnackbar(t(`success.${action.toLowerCase()}`), { variant: 'success' });
        await loadVendors(); // Reload the vendors list
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      enqueueSnackbar(t('errors.updateFailed'), { variant: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
      return;
    }
    try {
      const response = await fetch(`${API_URL}/vendors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });
      if (response.ok) {
        enqueueSnackbar(t('success.deleted'), { variant: 'success' });
        await loadVendors();
      } else {
        throw new Error('Failed to delete vendor');
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      enqueueSnackbar(t('errors.deleteFailed'), { variant: 'error' });
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>
      
      <Typography color="text.secondary" paragraph>
        {t("subtitle")}
      </Typography>
      <Grid container spacing={3}>
        {vendors.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
              {t("noVendors")}
            </Typography>
          </Grid>
        ) : (
          vendors.map((vendor) => (
            <Grid item xs={12} key={vendor._id}>
              <VendorManagementCard
                vendor={vendor}
                onAction={handleVendorAction}
                onDelete={handleDelete}
                onUpdate={loadVendors}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}