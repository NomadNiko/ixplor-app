import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTranslation } from "@/services/i18n/client";

type CartSummaryProps = {
  subtotal: number;
  tax: number;
  total: number;
};

export default function CartSummary({ subtotal, tax, total }: CartSummaryProps) {
  const { t } = useTranslation("cart");

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("orderSummary")}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>{t("subtotal")}</Typography>
          <Typography>${subtotal.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography>{t("tax")}</Typography>
          <Typography>${tax.toFixed(2)}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6">{t("total")}</Typography>
          <Typography variant="h6">${total.toFixed(2)}</Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          {t("checkout")}
        </Button>
      </CardContent>
    </Card>
  );
}