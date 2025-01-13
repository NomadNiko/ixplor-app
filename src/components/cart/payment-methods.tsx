import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslation } from "@/services/i18n/client";

export default function PaymentMethods() {
  const { t } = useTranslation("cart");

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("paymentMethods")}
        </Typography>
        
        <Stack spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={
              <img
                src="/stripe-logo.svg"
                alt="Stripe"
                style={{ height: 24 }}
              />
            }
          >
            {t("payWithStripe")}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            startIcon={
              <img
                src="/cashapp-logo.svg"
                alt="Cash App"
                style={{ height: 24 }}
              />
            }
          >
            {t("payWithCashApp")}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            startIcon={
              <img
                src="/venmo-logo.svg"
                alt="Venmo"
                style={{ height: 24 }}
              />
            }
          >
            {t("payWithVenmo")}
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            startIcon={
              <img
                src="/square-logo.svg"
                alt="Square"
                style={{ height: 24 }}
              />
            }
          >
            {t("payWithSquare")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}