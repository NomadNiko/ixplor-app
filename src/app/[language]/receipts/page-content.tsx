import { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Receipt } from 'lucide-react';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from "@/services/auth/use-auth";
import { InvoiceResponseDto } from '@/types/invoice';
import { useSnackbar } from "@/hooks/use-snackbar";
import InvoiceDetailModal from '@/components/receipts/InvoiceDetailModal';

export default function ReceiptsPage() {
  const { t } = useTranslation("receipts");
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponseDto | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
          return;
        }

        const response = await fetch(`${API_URL}/invoices/user/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch invoices');
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        enqueueSnackbar(t('errors.fetchFailed'), { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchInvoices();
    }
  }, [user?.id, enqueueSnackbar, t]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)' 
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>
      
      {invoices.length === 0 ? (
        <Typography color="text.secondary">
          {t('noInvoices')}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {invoices.map((invoice) => (
            <Grid item xs={12} sm={6} md={4} key={invoice._id}>
              <Card 
                onClick={() => setSelectedInvoice(invoice)}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Receipt size={20} />
                    <Typography variant="h6">
                      ${invoice.amount.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" gutterBottom>
                    {invoice.vendorName}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={invoice.status}
                      size="small"
                      color={getStatusColor(invoice.status)}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {invoice.items?.length || 0} {t('itemsCount')}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t('invoice')} #{invoice._id.slice(-8)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <InvoiceDetailModal
        invoice={selectedInvoice}
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </Container>
  );
}