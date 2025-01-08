import { useSnackbar } from "@/hooks/use-snackbar";
import useAuth from "@/services/auth/use-auth";
import { useTranslation } from "@/services/i18n/client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, FormProvider } from "react-hook-form";
import FormTextInput from "@/components/form/text-input/form-text-input";
import FormSelectInput from "@/components/form/select/form-select";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

// Types for the form data
type VendorType = {
  id: string;
  name: string;
};

type OnboardFormData = {
  vendorName: string;
  vendorDescription: string;
  vendorType: VendorType;
  vendorEmail: string;
  vendorPhone: string;
  vendorWebsite: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
};

// Styled components
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
}));

// Vendor type options
const vendorTypes = [
  { id: "tours", name: "Tours" },
  { id: "tickets", name: "Tickets" },
  { id: "rentals", name: "Rentals" },
  { id: "lessons", name: "Lessons" },
];

// Main component
export default function OnboardContent() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("onboard");

  const methods = useForm<OnboardFormData>({
    defaultValues: {
      vendorName: "",
      vendorDescription: "",
      vendorType: undefined,
      vendorEmail: "",
      vendorPhone: "",
      vendorWebsite: "",
      address: "",
      facebook: "",
      twitter: "",
      instagram: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    try {
      // Simulate an API call
      console.log('Form data to be sent:', formData);
      
      // Show success message
      enqueueSnackbar("Vendor profile saved successfully! The actual registration will be implemented soon.", {
        variant: "success",
      });
    } catch (error) {
      // Show error message
      enqueueSnackbar("An error occurred while saving the vendor profile.", {
        variant: "error",
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="md">
        <form onSubmit={onSubmit}>
          <Grid container spacing={3} pt={3}>
            {/* User Profile Section */}
            <Grid container spacing={3} size={{ xs: 12 }} mb={4}>
              <Grid size="auto">
                <StyledAvatar
                  alt={user?.firstName + " " + user?.lastName}
                  data-testid="user-icon"
                  src={user?.photo?.path}
                />
              </Grid>
              <Grid size="grow">
                <Typography variant="h3" gutterBottom data-testid="user-name">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="h5" gutterBottom data-testid="user-email">
                  {user?.email}
                </Typography>
              </Grid>
            </Grid>

            {/* Vendor Basic Info */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" gutterBottom>
                {t("sections.basicInfo")}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<OnboardFormData>
                name="vendorName"
                label={t("inputs.vendorName.label")}
                testId="vendor-name"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<OnboardFormData>
                name="vendorDescription"
                label={t("inputs.vendorDescription.label")}
                multiline
                minRows={3}
                testId="vendor-description"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormSelectInput<OnboardFormData, VendorType>
                name="vendorType"
                label={t("inputs.vendorType.label")}
                options={vendorTypes}
                keyValue="id"
                renderOption={(option) => option.name}
                testId="vendor-type"
              />
            </Grid>

            {/* Contact Information */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" gutterBottom>
                {t("sections.contactInfo")}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<OnboardFormData>
                name="vendorEmail"
                label={t("inputs.vendorEmail.label")}
                type="email"
                testId="vendor-email"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<OnboardFormData>
                name="vendorPhone"
                label={t("inputs.vendorPhone.label")}
                testId="vendor-phone"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<OnboardFormData>
                name="vendorWebsite"
                label={t("inputs.vendorWebsite.label")}
                testId="vendor-website"
              />
            </Grid>

            {/* Address Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" gutterBottom>
                {t("sections.location")}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<OnboardFormData>
                name="address"
                label={t("inputs.address.label")}
                testId="vendor-address"
              />
              <Typography variant="caption" color="textSecondary">
                {t("inputs.address.hint")}
              </Typography>
            </Grid>

            {/* Social Media */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h4" gutterBottom>
                {t("sections.social")}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<OnboardFormData>
                name="facebook"
                label={t("inputs.facebook.label")}
                testId="vendor-facebook"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<OnboardFormData>
                name="twitter"
                label={t("inputs.twitter.label")}
                testId="vendor-twitter"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<OnboardFormData>
                name="instagram"
                label={t("inputs.instagram.label")}
                testId="vendor-instagram"
              />
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }} mb={4}>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                >
                  {t("actions.submit")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}