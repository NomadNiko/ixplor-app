"use client";

import { useSnackbar } from "@/hooks/use-snackbar";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

// Type definitions for our vendor profiles
type VendorStatus = "pending" | "published" | "rejected";
type VendorType = "rentals" | "tickets" | "lessons";

interface VendorProfile {
  id: string;
  name: string;
  type: VendorType;
  description: string;
  status: VendorStatus;
  actionRequired?: string;
  lastUpdated: string;
}

// Styled components for consistent design
const StatusChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'status'
  })<{ status: VendorStatus }>(({ theme, status }) => ({
    fontWeight: 500,
    backgroundColor: 
      status === 'published' ? theme.palette.success.main :
      status === 'pending' ? theme.palette.warning.main :
      theme.palette.error.main,
    color: theme.palette.common.white
  }));

const ActionChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  marginLeft: theme.spacing(1)
}));

// Mock data for vendor profiles
const mockVendorProfiles: VendorProfile[] = [
  {
    id: "1",
    name: "Mountain Edge Rentals",
    type: "rentals",
    description: "Premium ski and snowboard rental shop with the latest equipment for all skill levels.",
    status: "published",
    lastUpdated: "2024-01-07"
  },
  {
    id: "2",
    name: "Peak Pass Sales",
    type: "tickets",
    description: "Official vendor for seasonal and daily ski passes to Mountain Resort.",
    status: "pending",
    actionRequired: "Additional documentation needed",
    lastUpdated: "2024-01-06"
  },
  {
    id: "3",
    name: "Pro Snowboarding Lessons",
    type: "lessons",
    description: "Professional snowboarding instruction from certified instructors.",
    status: "rejected",
    actionRequired: "Insurance certificate expired",
    lastUpdated: "2024-01-05"
  }
];

// Helper function to render the status text in a readable format
const getStatusText = (status: VendorStatus) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Main component
export default function VendorPanelContent() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("vendor-panel");

  const handleEdit = (id: string) => {
    enqueueSnackbar("Edit functionality coming soon!" + id, {
      variant: "success",
    });
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid size={{ xs: 12 }} mb={4}>
          <Typography variant="h3" gutterBottom>
            {t("title")}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t("description")}
          </Typography>
        </Grid>

        {mockVendorProfiles.map((profile) => (
          <Grid key={profile.id} size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="h5" component="h2">
                        {profile.name}
                      </Typography>
                      <Box ml={2}>
                        <StatusChip
                          label={getStatusText(profile.status)}
                          status={profile.status}
                          size="small"
                        />
                        {profile.actionRequired && (
                          <ActionChip
                            label={t("labels.actionRequired")}
                            size="small"
                          />
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      {profile.description}
                    </Typography>
                    {profile.actionRequired && (
                      <Typography color="error" variant="body2">
                        {profile.actionRequired}
                      </Typography>
                    )}
                    <Typography variant="caption" color="textSecondary">
                      {t("labels.lastUpdated")}: {profile.lastUpdated}
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={() => handleEdit(profile.id)}
                    aria-label={t("actions.edit")}
                    data-testid={`edit-vendor-${profile.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}