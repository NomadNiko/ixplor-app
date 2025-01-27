import { useState, useEffect } from 'react';
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

export const useStripeConnect = (vendorId: string | undefined) => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<ReturnType<typeof loadConnectAndInitialize> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!vendorId) return;

    const initializeStripeConnect = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          throw new Error('No auth token available');
        }

        const accountResponse = await fetch(`${API_URL}/stripe-connect/account`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`,
          }
        });

        if (!accountResponse.ok) {
          throw new Error('Failed to create Stripe account');
        }

        const { account: stripeAccountId } = await accountResponse.json();

        const fetchClientSecret = async () => {
          const sessionResponse = await fetch(`${API_URL}/stripe-connect/account-session`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokensInfo.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              account: stripeAccountId
            })
          });

          if (!sessionResponse.ok) {
            throw new Error('Failed to create account session');
          }

          const { client_secret: clientSecret } = await sessionResponse.json();
          return clientSecret;
        };

        const stripeConnect = await loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
                colorPrimary: "#FFFFFF",
                colorBackground: "#1C283A",
                colorText: "#FFFFFF", 
            },
          },
        });

        setStripeConnectInstance(stripeConnect);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Stripe Connect';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    initializeStripeConnect();
  }, [vendorId, enqueueSnackbar]);

  return {
    stripeConnectInstance,
    isLoading,
    error
  };
};

export default useStripeConnect;