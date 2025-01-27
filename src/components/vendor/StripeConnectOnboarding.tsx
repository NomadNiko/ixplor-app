import { useState } from 'react';
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
import { StepChange } from "@stripe/connect-js";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import { useStripeConnect } from '@/hooks/use-stripe-connect';

interface StripeConnectOnboardingProps {
  vendorId: string;
}

export const StripeConnectOnboarding: React.FC<StripeConnectOnboardingProps> = ({ 
  vendorId
}) => {
  const { t } = useTranslation("vendor-status");
  const [onboardingExited, setOnboardingExited] = useState(false);
  const { stripeConnectInstance, isLoading, error } = useStripeConnect(vendorId);

  const handleStepChange = (change: StepChange) => {
    // Log step changes for analytics
    console.log('Current step:', change.step);
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
                onExit={() => setOnboardingExited(true)}
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