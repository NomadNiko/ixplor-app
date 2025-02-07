"use client";
import Button from "@mui/material/Button";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import { useEffect } from "react";
import { useSnackbar } from "@/hooks/use-snackbar";
import Link from "@/components/link";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import { FileEntity } from "@/services/api/types/file-entity";
import useLeavePage from "@/services/leave-page/use-leave-page";
import Box from "@mui/material/Box";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { useParams } from "next/navigation";
import { RoleEnum } from "@/services/api/types/role";
import FormSelectInput from "@/components/form/select/form-select";
import { VendorType, VendorStatusEnum } from "@/app/[language]/types/vendor";

type EditVendorFormData = {
  businessName: string;
  description: string;
  vendorTypes: VendorType[];
  email: string;
  phone: string;
  website?: string;
  logoUrl?: FileEntity;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  vendorStatus: VendorStatusEnum;
  actionNeeded?: string;
  adminNotes?: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("vendor-admin");
  return yup.object().shape({
    businessName: yup.string().required(t("validation.required")),
    description: yup.string().required(t("validation.required")),
    vendorTypes: yup.array().of(
      yup.string().oneOf(['tours', 'lessons', 'rentals', 'tickets'] as const)
    ).min(1, t("validation.vendorTypesRequired")),
    email: yup.string().email(t("validation.email")).required(t("validation.required")),
    phone: yup.string().required(t("validation.required")),
    website: yup.string().url(t("validation.url")).nullable(),
    address: yup.string().required(t("validation.required")),
    city: yup.string().required(t("validation.required")),
    state: yup.string().required(t("validation.required")),
    postalCode: yup.string().required(t("validation.required")),
    latitude: yup.number().required(),
    longitude: yup.number().required(),
    vendorStatus: yup.string().oneOf(Object.values(VendorStatusEnum)).required(t("validation.required")),
    actionNeeded: yup.string().when('vendorStatus', {
      is: VendorStatusEnum.ACTION_NEEDED,
      then: (schema) => schema.required(t("validation.actionNeededRequired")),
      otherwise: (schema) => schema.optional(),
    }),
    adminNotes: yup.string().optional(),
  }) as yup.ObjectSchema<EditVendorFormData>;
};

function EditVendorFormActions() {
  const { t } = useTranslation("vendor-admin");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
    >
      {t("actions.submit")}
    </Button>
  );
}

function FormEditVendor() {
  const params = useParams<{ id: string }>();
  const vendorId = params.id;
  const { t } = useTranslation("vendor-admin");
  const validationSchema = useValidationSchema();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<EditVendorFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      businessName: "",
      description: "",
      vendorTypes: [],
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      latitude: 0,
      longitude: 0,
      vendorStatus: VendorStatusEnum.SUBMITTED,
      actionNeeded: "",
      adminNotes: "",
    },
  });

  const { handleSubmit, setError, reset } = methods;

  useEffect(() => {
    const fetchVendor = async () => {
      const response = await fetch(`/api/vendors/${vendorId}`);
      if (response.ok) {
        const vendor = await response.json();
        reset(vendor.data);
      }
    };
    fetchVendor();
  }, [vendorId, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    const response = await fetch(`/api/vendors/${vendorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (Object.keys(data.errors) as Array<keyof EditVendorFormData>).forEach(
        (key) => {
          setError(key, {
            type: "manual",
            message: t(`validation.${data.errors[key]}`),
          });
        }
      );
      return;
    }

    if (response.status === HTTP_CODES_ENUM.OK) {
      enqueueSnackbar(t("success.updated"), {
        variant: "success",
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">{t("editVendor")}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormAvatarInput<EditVendorFormData>
                name="logoUrl"
                testId="logo"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="businessName"
                testId="business-name"
                label={t("businessName")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="description"
                testId="description"
                label={t("description")}
                multiline
                rows={4}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormSelectInput<EditVendorFormData, { id: VendorType }>
                name="vendorTypes"
                testId="vendor-types"
                label={t("vendorTypes")}
                multiple
                options={[
                  { id: "tours" as VendorType },
                  { id: "lessons" as VendorType },
                  { id: "rentals" as VendorType },
                  { id: "tickets" as VendorType }
                ]}
                keyValue="id"
                renderOption={(option) => t(`vendorTypes.${option.id}`)}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormSelectInput<EditVendorFormData, { id: VendorStatusEnum }>
                name="vendorStatus"
                testId="vendor-status"
                label={t("status")}
                options={Object.values(VendorStatusEnum).map(status => ({ id: status }))}
                keyValue="id"
                renderOption={(option) => t(`status.${option.id.toLowerCase()}`)}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="actionNeeded"
                testId="action-needed"
                label={t("actionNeeded")}
                multiline
                rows={2}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="adminNotes"
                testId="admin-notes"
                label={t("adminNotes")}
                multiline
                rows={3}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="email"
                testId="email"
                label={t("email")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="phone"
                testId="phone"
                label={t("phone")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="website"
                testId="website"
                label={t("website")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="address"
                testId="address"
                label={t("address")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="city"
                testId="city"
                label={t("city")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="state"
                testId="state"
                label={t("state")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditVendorFormData>
                name="postalCode"
                testId="postal-code"
                label={t("postalCode")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <EditVendorFormActions />
              <Box ml={1} component="span">
                <Button
                  variant="contained"
                  color="inherit"
                  LinkComponent={Link}
                  href="/admin-panel/vendors"
                >
                  {t("actions.cancel")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}

function EditVendor() {
  return <FormEditVendor />;
}

export default withPageRequiredAuth(EditVendor, { roles: [RoleEnum.ADMIN] });