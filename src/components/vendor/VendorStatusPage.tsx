import React from 'react';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { CheckCircle2, Circle, CircleDashed } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import useAuth from "@/services/auth/use-auth";
import { useVendorStatus } from '@/hooks/use-vendor-status';
import { styled } from '@mui/material/styles';
import StripeConnectOnboarding from '@/components/vendor/StripeConnectOnboarding';
import { RoleEnum } from '@/services/api/types/role';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.glass,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

interface StatusStepProps {
  status: 'complete' | 'in-progress' | 'pending';
  title: string;
  description: string;
}

const StatusStep: React.FC<StatusStepProps> = ({ status, title, description }) => {
  const getIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="text-green-500" />;
      case 'in-progress':
        return <CircleDashed className="text-blue-500 animate-spin" />;
      default:
        return <Circle className="text-gray-300" />;
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 2,
      p: 2,
      bgcolor: 'background.glass',
      backdropFilter: 'blur(10px)',
      borderRadius: 1,
      mb: 2
    }}>
      {getIcon()}
      <Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

const VendorStatusPage: React.FC = () => {
  const { t } = useTranslation("vendor-status");
  const { user } = useAuth();
  const { vendor, loading, error } = useVendorStatus(user?.id?.toString() || '');
  const isStripeComplete = vendor?.stripeAccountStatus?.detailsSubmitted === true;

  const getStepStatus = (step: string): 'complete' | 'in-progress' | 'pending' => {
    if (!vendor) return 'pending';
    
    // Special handling for PreVendor role
    const isPreVendor = user?.role?.id === RoleEnum.PREVENDOR;
    const isVendorRole = user?.role?.id === RoleEnum.VENDOR;
    const canProceed = isPreVendor || isVendorRole;

    switch (step) {
      case 'onboard':
        return 'complete';
      
      case 'templates':
        // PreVendor can proceed through templates step
        return vendor.hasTemplates ? 'complete' : 
               canProceed ? 'in-progress' : 'pending';
      
      case 'products':
        // PreVendor can proceed through products step
        return vendor.hasProducts ? 'complete' : 
               canProceed && vendor.hasTemplates ? 'in-progress' : 'pending';
      
      case 'stripe':
        // PreVendor can proceed through Stripe step
        return isStripeComplete ? 'complete' : 
               canProceed && vendor.hasProducts ? 'in-progress' : 'pending';
      
      case 'complete':
        // Final step requires Vendor role and full completion
        return isVendorRole && 
               vendor.hasProducts && 
               isStripeComplete ? 'complete' : 'pending';
      
      default:
        return 'pending';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ 
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
        <Alert severity="error" variant="filled">
          <AlertTitle>{t('errors.title')}</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>
      
      <StyledCard sx={{ mb: 4 }}>
        <CardHeader title={t("status.title")} />
        <CardContent>
          <StatusStep 
            status={getStepStatus('onboard')}
            title={t("status.steps.onboard")}
            description={t("status.steps.onboardDesc")}
          />
          <StatusStep 
            status={getStepStatus('templates')}
            title={t("status.steps.templates")}
            description={t("status.steps.templatesDesc")}
          />
          <StatusStep 
            status={getStepStatus('products')}
            title={t("status.steps.products")}
            description={t("status.steps.productsDesc")}
          />
          <StatusStep 
            status={getStepStatus('stripe')}
            title={t("status.steps.stripe")}
            description={t("status.steps.stripeDesc")}
          />
          <StatusStep 
            status={getStepStatus('complete')}
            title={t("status.steps.complete")}
            description={t("status.steps.completeDesc")}
          />
        </CardContent>
      </StyledCard>

      {/* Template Creation Card */}
      {vendor && !vendor.hasTemplates && (
        <StyledCard sx={{ mb: 4 }}>
          <CardHeader title={t("templates.title")} />
          <CardContent>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {t("templates.description")}
            </Typography>
            <Button
              variant="contained"
              href="/templates/add"
              sx={{
                background: theme => theme.palette.customGradients.buttonMain,
                '&:hover': {
                  background: theme => theme.palette.customGradients.buttonMain,
                  filter: 'brightness(0.9)',
                }
              }}
            >
              {t("templates.add")}
            </Button>
          </CardContent>
        </StyledCard>
      )}
      
      {/* Product Generation Card */}
      {vendor && vendor.hasTemplates && !vendor.hasProducts && (
        <StyledCard sx={{ mb: 4 }}>
          <CardHeader title={t("products.title")} />
          <CardContent>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {t("products.description")}
            </Typography>
            <Button
              variant="contained"
              href="/templates"
              sx={{
                background: theme => theme.palette.customGradients.buttonMain,
                '&:hover': {
                  background: theme => theme.palette.customGradients.buttonMain,
                  filter: 'brightness(0.9)',
                }
              }}
            >
              {t("products.generate")}
            </Button>
          </CardContent>
        </StyledCard>
      )}

      {/* Stripe Connect Onboarding Card */}
      {vendor && vendor.hasProducts && !isStripeComplete && (
        <StyledCard sx={{ mb: 4 }}>
          <CardHeader title={t("stripe.title")} />
          <CardContent>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {t("stripe.description")}
            </Typography>
            <StripeConnectOnboarding vendorId={vendor._id} />
          </CardContent>
        </StyledCard>
      )}

      {/* Status Messages */}
      {vendor && vendor.vendorStatus === 'SUBMITTED' && (
        <Alert severity="info" variant="filled" sx={{ mb: 2 }}>
          <AlertTitle>{t("messages.submitted")}</AlertTitle>
          {t("messages.submittedDesc")}
        </Alert>
      )}
      
      {vendor && vendor.vendorStatus === 'ACTION_NEEDED' && (
        <Alert severity="warning" variant="filled">
          <AlertTitle>{t("messages.actionNeeded")}</AlertTitle>
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
            {vendor.actionNeeded}
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default VendorStatusPage;