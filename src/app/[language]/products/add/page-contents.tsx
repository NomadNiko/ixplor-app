'use client';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";
import ProductCreateCard from '@/components/cards/create-cards/ProductCreateCard';

export default function ProductCreationPage() {
  const { t } = useTranslation("products");

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("productCreation")} 
      </Typography>

      <Typography color="text.secondary" paragraph>
        {t("subtitle")}  
      </Typography>

      <ProductCreateCard />
    </Container>
  );
}