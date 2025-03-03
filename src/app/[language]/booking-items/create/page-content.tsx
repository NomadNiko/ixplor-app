"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";
import BookingItemCreateCard from "@/components/cards/create-cards/BookingItemCreateCard";

export default function BookingItemCreateContent() {
  const { t } = useTranslation("booking-items");

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("createBookingItem")}
      </Typography>
      <Typography color="text.secondary" paragraph>
        {t("createSubtitle")}
      </Typography>

      <BookingItemCreateCard />
    </Container>
  );
}