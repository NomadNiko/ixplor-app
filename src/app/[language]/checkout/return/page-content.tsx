import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { useSnackbar } from '@/hooks/use-snackbar';
import { useTranslation } from '@/services/i18n/client';
import { useCartQuery } from '@/hooks/use-cart-query';
import { API_URL } from '@/services/api/config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import PurchasedTickets from '@/components/tickets/PurchasedTicketsDisplay';
import useAuth from '@/services/auth/use-auth';

export default function CheckoutReturnPage() {
  const { t } = useTranslation('checkout');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshCart } = useCartQuery();
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = useState<'complete' | 'open' | 'processing' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          console.error('No session ID found');
          setStatus('error');
          setIsLoading(false);
          return;
        }

        setStatus('processing');
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          throw new Error('No auth token available');
        }

        const response = await fetch(`${API_URL}/stripe/session-status?session_id=${sessionId}`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch session status');
        }

        const data = await response.json();
        setStatus(data.status);

        if (data.status === 'complete') {
          // Refresh cart and fetch tickets
          await refreshCart();
          
          if (user?.id) {
            const ticketsResponse = await fetch(`${API_URL}/tickets/user/${user.id}`, {
              headers: {
                'Authorization': `Bearer ${tokensInfo.token}`
              }
            });
            
            if (ticketsResponse.ok) {
              const ticketsData = await ticketsResponse.json();
              setPurchasedTickets(ticketsData.data);
            }
          }
          
          enqueueSnackbar(t('success.paymentComplete'), { variant: 'success' });
        }
      } catch (error) {
        console.error('Error checking session status:', error);
        setStatus('error');
        enqueueSnackbar(t('errors.statusCheckFailed'), { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [searchParams, user?.id, refreshCart, enqueueSnackbar, t]);

  if (isLoading) {
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

  if (status === 'processing') {
    return (
      <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        gap: 3
      }}>
        <CircularProgress />
        <Typography variant="h6">
          {t('returnPage.processing.message')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3
      }}>
        {status === 'complete' ? (
          <>
            <CheckCircle size={64} color="success" />
            <Typography variant="h4" gutterBottom>
              {t('returnPage.success.title')}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {t('returnPage.success.message')}
            </Typography>
            {purchasedTickets.length > 0 && (
              <PurchasedTickets tickets={purchasedTickets} />
            )}
          </>
        ) : (
          <>
            <XCircle size={64} color="error" />
            <Typography variant="h4" gutterBottom>
              {t('returnPage.failure.title')}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {t('returnPage.failure.message')}
            </Typography>
          </>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
          >
            {t('returnPage.actions.backToHome')}
          </Button>
          {status !== 'complete' && (
            <Button
              variant="outlined"
              onClick={() => router.push('/cart')}
            >
              {t('returnPage.actions.tryAgain')}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}