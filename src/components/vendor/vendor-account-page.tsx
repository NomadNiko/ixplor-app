import { useTranslation } from "@/services/i18n/client";
import useAuth from "@/services/auth/use-auth";
import { useVendorStatus } from '@/hooks/use-vendor-status';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import VendorAccountBalances from "./account/VendorAccountBalances";
import VendorTransactionList from "./account/VendorTransactionList";
import VendorTicketList from "./account/VendorTicketList";

export default function VendorAccountPage() {
  const { t } = useTranslation("vendor-account");
  const { user } = useAuth();
  const { vendor, loading, error } = useVendorStatus(user?.id?.toString() || '');

  if (loading) {
    return (
      <Container sx={{ 
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <AlertTitle>{t('errors.title')}</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!vendor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          <AlertTitle>{t('noVendor.title')}</AlertTitle>
          {t('noVendor.message')}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <VendorAccountBalances vendor={vendor} />
        <VendorTransactionList vendorId={vendor._id} />
        <VendorTicketList vendorId={vendor._id} />
      </Box>
    </Container>
  );
}