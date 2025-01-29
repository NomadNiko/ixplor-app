import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useCartQuery } from '@/hooks/use-cart-query';
import useAuth from '@/services/auth/use-auth';
import { API_URL } from '@/services/api/config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import { useSnackbar } from '@/hooks/use-snackbar';

// Initialize Stripe outside component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPageContent() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const { data: cartData, isLoading: isCartLoading } = useCartQuery();
  const { enqueueSnackbar } = useSnackbar();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/sign-in');
      return;
    }

    if (!isCartLoading && (!cartData || cartData.items.length === 0)) {
      router.replace('/cart');
      return;
    }

    const createCheckoutSession = async () => {
      if (!cartData?.items.length) return;

      setIsLoadingPayment(true);
      setError(null);

      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          throw new Error('No auth token available');
        }

        const response = await fetch(`${API_URL}/stripe/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: cartData.items,
            currency: 'usd',
            returnUrl: `${window.location.origin}/checkout/return`
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create checkout session');
        }

        const { clientSecret } = await response.json();
        if (!clientSecret) {
          throw new Error('No client secret received');
        }

        console.log('Received client secret:', clientSecret); // Debug log
        setClientSecret(clientSecret);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize checkout';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        setIsLoadingPayment(false);
      }
    };

    createCheckoutSession();
  }, [isLoaded, user, router, cartData, isCartLoading, enqueueSnackbar]);

  if (isCartLoading || isLoadingPayment) {
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

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <div id="checkout" style={{
      width: '100%',
      minHeight: '600px',
      position: 'relative'
    }}>
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}