import { useState } from 'react';
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
import { StepChange } from "@stripe/connect-js";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import { useStripeConnect } from '@/hooks/use-stripe-connect';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { useSnackbar } from "@/hooks/use-snackbar";

// Define interfaces for type safety
interface StripeAccountDetails {
  id: string;
  [key: string]: unknown;
}

interface StripeAccountResponse {
  account: StripeAccountDetails;
}

interface StripeConnectOnboardingProps {
  vendorId: string;
}

export const StripeConnectOnboarding: React.FC<StripeConnectOnboardingProps> = ({ 
  vendorId
}) => {
  const { t } = useTranslation("vendor-status");
  const { enqueueSnackbar } = useSnackbar();
  const [onboardingExited, setOnboardingExited] = useState(false);
  const { stripeConnectInstance, isLoading, error } = useStripeConnect(vendorId);

  const updateVendorStripeAccount = async (stripeAccount: StripeAccountDetails) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_URL}/stripe-connect/update-vendor/${vendorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify(stripeAccount)
      });

      if (!response.ok) {
        throw new Error('Failed to update vendor Stripe account');
      }

      await response.json(); // Consume the response to avoid linting errors
      enqueueSnackbar(t('stripe.success'), { variant: 'success' });
      
      // Optional: Trigger a page refresh or update to show next steps
      window.location.reload();
    } catch (error) {
      console.error('Error updating Stripe account:', error);
      enqueueSnackbar(t('stripe.updateFailed'), { variant: 'error' });
    }
  };

  const handleStepChange = (change: StepChange) => {
    console.log('Current Stripe onboarding step:', change.step);
    
    // You might want to track specific steps or milestones here
    if (change.step === 'summary') {
      // This could be a good place to do additional checks
    }
  };

  const handleExit = async () => {
    setOnboardingExited(true);
    
    // Try to get the Stripe account details after exit
    try {
      // Fetch the Stripe account details 
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_URL}/stripe-connect/account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Stripe account details');
      }

      const accountData: StripeAccountResponse = await response.json();
      
      // Update vendor with Stripe account details
      await updateVendorStripeAccount(accountData.account);
    } catch (error) {
      console.error('Error on Stripe onboarding exit:', error);
      enqueueSnackbar(t('stripe.exitError'), { variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained"
            onClick={() => window.location.reload()}
            fullWidth
            sx={{
              background: theme => theme.palette.customGradients.buttonMain,
              '&:hover': {
                background: theme => theme.palette.customGradients.buttonMain,
                filter: 'brightness(0.9)',
              }
            }}
          >
            {t('stripe.retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (onboardingExited) {
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t('stripe.exitedMessage')}
          </Alert>
          <Button 
            variant="contained"
            onClick={() => setOnboardingExited(false)}
            fullWidth
            sx={{
              background: theme => theme.palette.customGradients.buttonMain,
              '&:hover': {
                background: theme => theme.palette.customGradients.buttonMain,
                filter: 'brightness(0.9)',
              }
            }}
          >
            {t('stripe.resumeOnboarding')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h6">
            {t('stripe.title')}
          </Typography>
        }
      />
      <CardContent>
        {stripeConnectInstance && (
          <Box sx={{ 
            '.connect-onboarding': {
              width: '100%',
              minHeight: '500px',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }
          }}>
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectAccountOnboarding
                onExit={handleExit}
                onStepChange={handleStepChange}
              />
            </ConnectComponentsProvider>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeConnectOnboarding;