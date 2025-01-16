"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";
import ProductCreationForm from "@/components/product/product-create-form";

export default function ProductCreationPageContent() {
  const { t } = useTranslation("products");

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("productCreation")}
      </Typography>
      
      <Typography color="text.secondary" paragraph>
        {t("subtitle")}
      </Typography>
      
      <ProductCreationForm />
    </Container>
  );
}