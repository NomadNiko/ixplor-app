
"use client";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";
import StaffUserCreateCard from "@/components/cards/create-cards/StaffUserCreateCard";

export default function StaffUserCreateContent() {
  const { t } = useTranslation("staff-users");

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("createStaffUser")}
      </Typography>
      <Typography color="text.secondary" paragraph>
        {t("createSubtitle")}
      </Typography>
      <StaffUserCreateCard />
    </Container>
  );
}