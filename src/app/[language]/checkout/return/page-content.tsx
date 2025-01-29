"use client";
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
import { API_URL } from '@/services/api/config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import { useCartQuery } from '@/hooks/use-cart-query';

export default function CheckoutReturnPageContent() {
  const { t } = useTranslation('checkout');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshCart } = useCartQuery();
  const { enqueueSnackbar } = useSnackbar();
  const [status, setStatus] = useState<'success' | 'failure' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          throw new Error('No session ID found');
        }

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
          throw new Error('Failed to verify payment status');
        }

        const { status } = await response.json();
        
        if (status === 'complete') {
          setStatus('success');
          await refreshCart();
          enqueueSnackbar(t('success.paymentComplete'), { variant: 'success' });
        } else {
          setStatus('failure');
          enqueueSnackbar(t('errors.paymentFailed'), { variant: 'error' });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('failure');
        enqueueSnackbar(t('errors.statusCheckFailed'), { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [searchParams, enqueueSnackbar, t, refreshCart]);

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
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3
      }}>
        {status === 'success' ? (
          <>
            <CheckCircle size={64} color="success" />
            <Typography variant="h4" gutterBottom>
              {t('success.title')}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {t('success.message')}
            </Typography>
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
          {status === 'failure' && (
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