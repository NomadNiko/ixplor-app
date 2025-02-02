import { useState } from 'react';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from '@mui/material/styles';
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { BanknoteIcon, PiggyBank, CreditCardIcon } from 'lucide-react';

interface VendorAccountBalancesProps {
  vendor: {
    _id: string;
    businessName: string;
    accountBalance?: number;
    internalAccountBalance?: number;
  };
}

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.glass,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

const BalanceBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.glassHover,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2)
}));

export default function VendorAccountBalances({ vendor }: VendorAccountBalancesProps) {
  const { t } = useTranslation("vendor-account");
  const { enqueueSnackbar } = useSnackbar();
  const [processingPayout, setProcessingPayout] = useState(false);

  const handleTriggerPayout = async () => {
    try {
      setProcessingPayout(true);
      const tokensInfo = getTokensInfo();
      
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        return;
      }

      const response = await fetch(`${API_URL}/vendors/payout/${vendor._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to trigger payout');
      }

      await response.json(); // We still parse the response but don't store it
      enqueueSnackbar(t('success.payoutScheduled'), { variant: 'success' });
    } catch (error) {
      console.error('Error triggering payout:', error);
      enqueueSnackbar(t('errors.payoutFailed'), { variant: 'error' });
    } finally {
      setProcessingPayout(false);
    }
  };

  // Convert pennies to dollars for display
  const formatBalance = (pennies?: number) => {
    if (pennies === null || pennies === undefined) return '0.00';
    return (pennies / 100).toFixed(2);
  };

  return (
    <StyledCard>
      <CardHeader 
        title={vendor.businessName}
        subheader={t('balances.title')}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <BalanceBox>
              <CreditCardIcon size={24} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('balances.stripe')}
                </Typography>
                <Typography variant="h6">
                  ${formatBalance(vendor.accountBalance)}
                </Typography>
              </Box>
            </BalanceBox>
          </Grid>
          <Grid item xs={12} md={6}>
            <BalanceBox>
              <BanknoteIcon size={24} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('balances.internal')}
                </Typography>
                <Typography variant="h6">
                  ${formatBalance(vendor.internalAccountBalance)}
                </Typography>
              </Box>
            </BalanceBox>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          startIcon={processingPayout ? <CircularProgress size={20} /> : <PiggyBank size={20} />}
          onClick={handleTriggerPayout}
          disabled={processingPayout || (vendor.internalAccountBalance || 0) <= 0}
          sx={{
            mt: 2,
            background: theme => theme.palette.customGradients.buttonMain,
            '&:hover': {
              background: theme => theme.palette.customGradients.buttonMain,
              filter: 'brightness(0.9)',
            }
          }}
        >
          {t('actions.triggerPayout')}
        </Button>
      </CardContent>
    </StyledCard>
  );
}