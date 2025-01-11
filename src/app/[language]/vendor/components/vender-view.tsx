"use client";

import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { mockVendorDetails } from "../mock-data";
import FooterLink from "@/components/footer-link";
import ToursView from "./VendorView/ToursView";
import TicketsView from "./VendorView/TicketsView";
import RentalsView from "./VendorView/RentalsView";
import LessonsView from "./VendorView/LessonsView";

interface VendorViewProps {
  vendorId: string;
  onBackClick: () => void;
  onEditClick: () => void;
}

export default function VendorView({
  vendorId,
  onBackClick,
  onEditClick,
}: VendorViewProps) {
  const { t } = useTranslation("vendor");
  const vendor = mockVendorDetails.find((v) => v.id === vendorId);

  if (!vendor) return null;

  const renderContent = () => {
    switch (vendor.type) {
      case "tours":
        return vendor.tours ? <ToursView tours={vendor.tours} /> : null;
        case "tickets":
          return vendor.tickets ? <TicketsView tickets={vendor.tickets} onEditClick={onEditClick} /> : null;
        case "rentals":
          return vendor.rentals ? (
            <RentalsView 
              rentals={vendor.rentals} 
              onEditClick={onEditClick}  // Pass the onEditClick method here
            /> 
          ) : null;
        case "lessons":
        return vendor.lessons ? <LessonsView lessons={vendor.lessons} /> : null;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        {/* Header with navigation */}
        <Grid
          size={{ xs: 12 }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button startIcon={<ArrowBackIcon />} onClick={onBackClick}>
            {t("vendorView.actions.back")}
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={onEditClick}
          >
            {t("vendorView.actions.edit")}
          </Button>
        </Grid>

        {/* Vendor header information */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4" gutterBottom>
            {vendor.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {vendor.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Type-specific content */}
        <Grid size={{ xs: 12 }}>{renderContent()}</Grid>
      </Grid>
      <FooterLink />
    </Container>
  );
}