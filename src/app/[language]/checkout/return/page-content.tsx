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

interface PurchasedTicket {
  _id: string;
  productName: string;
  productDescription: string;
  productDate?: string;
  productStartTime?: string;
  productImageURL?: string;
  quantity: number;
  price: number;
  transactionId: string;
}

interface Transaction {
  _id: string;
  stripeCheckoutSessionId: string;
  amount: number;
  currency: string;
  vendorId: string;
  customerId: string;
  productItemId: string;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function CheckoutReturnPage() {
  const { t } = useTranslation('checkout');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshCart } = useCartQuery();
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = useState<'complete' | 'open' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      if (hasChecked) return;

      try {
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          console.log('No session ID found, redirecting to cart');
          router.push('/cart');
          return;
        }

        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          throw new Error('No auth token available');
        }

        // First check the session status
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
          // Get transaction details
          const transactionResponse = await fetch(`${API_URL}/transactions/checkout/${sessionId}`, {
            headers: {
              'Authorization': `Bearer ${tokensInfo.token}`
            }
          });

          if (!transactionResponse.ok) {
            throw new Error('Failed to fetch transaction details');
          }

          const transaction: Transaction = await transactionResponse.json();

          // Get tickets for the current user
          const ticketsResponse = await fetch(`${API_URL}/tickets/user/${user?.id}`, {
            headers: {
              'Authorization': `Bearer ${tokensInfo.token}`
            }
          });

          if (ticketsResponse.ok) {
            const ticketsData = await ticketsResponse.json();
            // Filter tickets created around the same time as the transaction
            const transactionTime = new Date(transaction.createdAt).getTime();
            const relevantTickets = ticketsData.data.filter((ticket: PurchasedTicket) => {
              const ticketTime = new Date(ticket.transactionId).getTime();
              // Consider tickets created within 5 minutes of the transaction
              return Math.abs(ticketTime - transactionTime) < 5 * 60 * 1000;
            });
            setPurchasedTickets(relevantTickets);
          }

          await refreshCart();
          enqueueSnackbar(t('success.paymentComplete'), { variant: 'success' });
        }

        setHasChecked(true);
      } catch (error) {
        console.error('Error checking session status:', error);
        enqueueSnackbar(t('errors.statusCheckFailed'), { variant: 'error' });
        router.push('/cart');
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [searchParams, hasChecked]);

  if (status === 'open') {
    router.push('/checkout');
    return null;
  }

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
              {t('success.title')}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {t('success.message')}
            </Typography>
            {purchasedTickets.length > 0 && (
              <PurchasedTickets tickets={purchasedTickets} />
            )}
          </>
        ) : (
          <>
            <XCircle size={64} color="error" />
            <Typography variant="h4" gutterBottom>
              {t('failure.title')}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {t('failure.message')}
            </Typography>
          </>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
          >
            {t('actions.backToHome')}
          </Button>
          {status !== 'complete' && (
            <Button
              variant="outlined"
              onClick={() => router.push('/cart')}
            >
              {t('actions.tryAgain')}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}