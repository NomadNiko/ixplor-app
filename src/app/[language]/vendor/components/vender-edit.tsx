"use client";

import { useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { mockVendorDetails } from "../mock-data";
import { useForm, FormProvider } from "react-hook-form";
import FormTextInput from "@/components/form/text-input/form-text-input";
import FormSelectInput from "@/components/form/select/form-select";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MuiLink from "@mui/material/Link";



interface VendorEditProps {
  vendorId: string;
  onBackClick: () => void;
}

// Form types for each vendor product
interface BaseForm {
    name: string;
    description?: string;
    price?: string;
  }
  
  interface TourForm extends BaseForm {
    duration: string;
    maxParticipants: string;
  }
  
  interface TicketForm extends BaseForm {
    type: string;
    validFrom: string;
    validTo: string;
    availableCount: string;
  }
  
  interface RentalForm extends BaseForm {
    category: string;
    totalUnits: string;
  }
  
  interface LessonForm extends BaseForm {
    instructor: string;
    duration: string;
  }


// Edit section tab value type
type TabValue = "details" | "calendar" | "inventory";

export default function VendorEdit({ vendorId, onBackClick }: VendorEditProps) {
  const { t } = useTranslation("vendor");
  const { enqueueSnackbar } = useSnackbar();
  const vendor = mockVendorDetails.find((v) => v.id === vendorId);
  const [activeTab, setActiveTab] = useState<TabValue>("details");

  // Form initialization based on vendor type
  const methods = useForm<TourForm | TicketForm | RentalForm | LessonForm>({
    defaultValues: {
      name: "",
      description: "",
      ...(vendor?.type === 'tours' && {
        duration: "",
        maxParticipants: "",
      }),
      ...(vendor?.type === 'tickets' && {
        type: "",
        validFrom: "",
        validTo: "",
        availableCount: "",
      }),
      ...(vendor?.type === 'rentals' && {
        category: "",
        totalUnits: "",
      }),
      ...(vendor?.type === 'lessons' && {
        instructor: "",
        duration: "",
      }),
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  const handleSave = async (formData: TourForm | TicketForm | RentalForm | LessonForm) => {
  // Simulate saving data
  console.log('Saving product:', formData);
  enqueueSnackbar("Changes saved successfully!", { variant: "success" });
};

  // Render different forms based on vendor type
  const renderProductForm = () => {
    if (!vendor) return null;

    switch (vendor.type) {
      case "tours":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Add New Tour
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormTextInput
                  name="name"
                  label="Tour Name"
                  testId="tour-name"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextInput
                  name="description"
                  label="Description"
                  multiline
                  minRows={3}
                  testId="tour-description"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormTextInput
                  name="duration"
                  label="Duration"
                  testId="tour-duration"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormTextInput
                  name="price"
                  label="Price"
                  type="number"
                  testId="tour-price"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormTextInput
                  name="maxParticipants"
                  label="Max Participants"
                  type="number"
                  testId="tour-max-participants"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case "tickets":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Add New Ticket Type
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormTextInput
                  name="name"
                  label="Ticket Name"
                  testId="ticket-name"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormSelectInput
                  name="type"
                  label="Ticket Type"
                  options={[
                    { id: "day-pass", name: "Day Pass" },
                    { id: "season-pass", name: "Season Pass" },
                    { id: "multi-day", name: "Multi-Day Pass" },
                  ]}
                  keyValue="id"
                  renderOption={(option) => option.name}
                  testId="ticket-type"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormTextInput
                  name="price"
                  label="Price"
                  type="number"
                  testId="ticket-price"
                />
              </Grid>
              {/* Add date pickers for validity period */}
            </Grid>
          </Box>
        );

      case "rentals":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Add Rental Equipment
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormTextInput
                  name="name"
                  label="Equipment Name"
                  testId="rental-name"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormTextInput
                  name="category"
                  label="Category"
                  testId="rental-category"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormTextInput
                  name="totalUnits"
                  label="Total Units"
                  type="number"
                  testId="rental-units"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case "lessons":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Add New Lesson
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormTextInput
                  name="name"
                  label="Lesson Name"
                  testId="lesson-name"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormTextInput
                  name="instructor"
                  label="Instructor"
                  testId="lesson-instructor"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormTextInput
                  name="duration"
                  label="Duration"
                  testId="lesson-duration"
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormTextInput
                  name="price"
                  label="Price"
                  type="number"
                  testId="lesson-price"
                />
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  if (!vendor) return null;

  return (
    <FormProvider {...methods}>
      <Container maxWidth="md">
        <Grid container spacing={3} pt={3}>
          {/* Header with back button */}
          <Grid
            size={{ xs: 12 }}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button startIcon={<ArrowBackIcon />} onClick={onBackClick}>
              {t("vendorEdit.actions.cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={methods.handleSubmit(handleSave)}
            >
              {t("vendorEdit.actions.save")}
            </Button>
          </Grid>

          {/* Vendor name and type */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h4" gutterBottom>
              {vendor.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {vendor.description}
            </Typography>
          </Grid>

          {/* Tabs for different sections */}
          <Grid size={{ xs: 12 }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab
                icon={<AddCircleIcon />}
                label="Add Product"
                value="details"
              />
              <Tab
                icon={<CalendarMonthIcon />}
                label="Schedule"
                value="calendar"
              />
              <Tab icon={<ListAltIcon />} label="Inventory" value="inventory" />
            </Tabs>
          </Grid>

          {/* Content based on active tab */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                {activeTab === "details" && renderProductForm()}
                {activeTab === "calendar" && (
                  <Typography>Calendar view coming soon...</Typography>
                )}
                {activeTab === "inventory" && (
                  <Typography>Inventory management coming soon...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid sx={{ mx: "auto" }}>
          <MuiLink href="/privacy-policy">Privacy Policy</MuiLink>
        </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}
