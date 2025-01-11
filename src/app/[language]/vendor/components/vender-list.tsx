"use client";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { mockVendorDetails } from "../../../../mock-data/mock-data";
import { VendorStatus } from "@/types/vendor-types";
import FooterLink from "@/components/footer-link";

interface VendorListProps {
  onVendorSelect: (vendorId: string) => void;
}

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: VendorStatus }>(({ theme, status }) => ({
  fontWeight: 500,
  backgroundColor:
    status === "published"
      ? theme.palette.success.main
      : status === "pending"
      ? theme.palette.warning.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
}));

const VendorCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

export default function VendorList({ onVendorSelect }: VendorListProps) {
  const { t } = useTranslation("vendor");

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid size={{ xs: 12 }} mb={4}>
          <Typography variant="h3" gutterBottom>
            {t("vendorList.title")}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t("vendorList.description")}
          </Typography>
        </Grid>

        {mockVendorDetails.map((profile) => (
          <Grid key={profile.id} size={{ xs: 12 }}>
            <VendorCard onClick={() => onVendorSelect(profile.id)}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="space-between"
                >
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="h5" component="h2">
                        {profile.name}
                      </Typography>
                      <Box ml={2}>
                        <StatusChip
                          label={
                            profile.status.charAt(0).toUpperCase() +
                            profile.status.slice(1)
                          }
                          status={profile.status}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      gutterBottom
                    >
                      {profile.description}
                    </Typography>
                    {profile.actionRequired && (
                      <Typography color="error" variant="body2">
                        {profile.actionRequired}
                      </Typography>
                    )}
                    <Typography variant="caption" color="textSecondary">
                      {t("vendorList.labels.lastUpdated")}:{" "}
                      {profile.lastUpdated}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </VendorCard>
          </Grid>
        ))}
      </Grid>
      <FooterLink />
    </Container>
  );
}
