"use client";

import FormSelectInput from "@/components/form/select/form-select";
import FormTextInput from "@/components/form/text-input/form-text-input";
import { VendorStatusEnum, VendorType } from "@/app/[language]/types/vendor";
import { useTranslation } from "@/services/i18n/client";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Popover from "@mui/material/Popover";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { VendorFilterType } from "./vendor-filter-types";

function VendorFilter() {
  const { t } = useTranslation("vendor-admin");
  const router = useRouter();
  const searchParams = useSearchParams();
  const methods = useForm<VendorFilterType>({
    defaultValues: {
      status: undefined,
      type: undefined,
      city: "",
      state: "",
      postalCode: "",
    },
  });
  const { handleSubmit, reset } = methods;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "vendor-filter-popover" : undefined;

  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter) {
      handleClose();
      const filterParsed = JSON.parse(filter);
      reset(filterParsed);
    }
  }, [searchParams, reset]);

  return (
    <FormProvider {...methods}>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Container
          sx={{
            minWidth: 300,
            p: 3,
          }}
        >
          <form
            onSubmit={handleSubmit((data) => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set("filter", JSON.stringify(data));
              router.push(
                window.location.pathname + "?" + searchParams.toString()
              );
            })}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormSelectInput<VendorFilterType, { id: VendorStatusEnum }>
                  name="status"
                  testId="status"
                  label={t("filters.status")}
                  options={[
                    { id: VendorStatusEnum.SUBMITTED },
                    { id: VendorStatusEnum.PENDING_APPROVAL },
                    { id: VendorStatusEnum.ACTION_NEEDED },
                    { id: VendorStatusEnum.APPROVED },
                    { id: VendorStatusEnum.REJECTED },
                  ]}
                  keyValue="id"
                  renderOption={(option) =>
                    t(`status.${option.id.toLowerCase()}`)
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormSelectInput<VendorFilterType, { id: VendorType }>
                  name="type"
                  testId="type"
                  label={t("filters.type")}
                  options={[
                    { id: "tours" as VendorType },
                    { id: "lessons" as VendorType },
                    { id: "rentals" as VendorType },
                    { id: "tickets" as VendorType },
                  ]}
                  keyValue="id"
                  renderOption={(option) =>
                    t(`vendorTypes.${option.id}`)
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormTextInput<VendorFilterType>
                  name="city"
                  testId="city"
                  label={t("filters.city")}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormTextInput<VendorFilterType>
                  name="state"
                  testId="state"
                  label={t("filters.state")}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormTextInput<VendorFilterType>
                  name="postalCode"
                  testId="postal-code"
                  label={t("filters.postalCode")}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button variant="contained" type="submit">
                  {t("filters.apply")}
                </Button>
                <Button
                  sx={{ ml: 1 }}
                  variant="outlined"
                  onClick={() => {
                    reset({
                      status: undefined,
                      type: undefined,
                      city: "",
                      state: "",
                      postalCode: "",
                    });
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.delete("filter");
                    router.push(
                      window.location.pathname + "?" + searchParams.toString()
                    );
                  }}
                >
                  {t("filters.clearAll")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Popover>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        {t("filters.title")}
      </Button>
    </FormProvider>
  );
}

export default VendorFilter;