import { useFormContext, useWatch } from "react-hook-form";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import { X } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import FormTimePickerInput from "@/components/form/date-pickers/time-picker";
import { ProductFormData } from "./types";

export function ProductFormFields() {
  const { t } = useTranslation("products");
  const { control, setValue } = useFormContext<ProductFormData>();
  const formData = useWatch({
    control
  });

  const handleRequirementsChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const value = target.value.trim();
      if (value) {
        setValue("productRequirements", [...(formData.productRequirements || []), value]);
        target.value = "";
      }
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const currentRequirements = formData.productRequirements || [];
    setValue(
      "productRequirements",
      currentRequirements.filter((_, i) => i !== index)
    );
  };

  return (
    <Box sx={{ display: "grid", gap: 2, mb: 3 }}>
      <TextField
        fullWidth
        label={t("fields.productName")}
        name="productName"
        value={formData.productName}
        onChange={(e) => setValue("productName", e.target.value)}
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        name="productDescription"
        label={t("fields.productDescription")}
        value={formData.productDescription}
        onChange={(e) => setValue("productDescription", e.target.value)}
      />
      <TextField
        select
        fullWidth
        name="productType"
        label={t("fields.productType")}
        value={formData.productType}
        onChange={(e) =>
          setValue(
            "productType",
            e.target.value as "tours" | "lessons" | "rentals" | "tickets"
          )
        }
      >
        {["tours", "lessons", "rentals", "tickets"].map((type) => (
          <MenuItem key={type} value={type}>
            {t(`productTypes.${type}`)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        type="number"
        name="productPrice"
        label={t("fields.productPrice")}
        value={formData.productPrice}
        onChange={(e) => setValue("productPrice", Number(e.target.value))}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">$</InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        type="number"
        name="productDuration"
        label={t("fields.productDuration")}
        value={formData.productDuration}
        onChange={(e) => setValue("productDuration", Number(e.target.value))}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">{t("hours")}</InputAdornment>
          ),
        }}
      />
      <FormDatePickerInput name="productDate" label={t("fields.productDate")} />
      
      <FormTimePickerInput
        name="productStartTime"
        label={t("fields.productStartTime")}
        format="HH:mm"
      />
      <FormTimePickerInput
        name="productEndTime"
        label={t("fields.productEndTime")}
        format="HH:mm"
      />
      <TextField
        fullWidth
        name="productImageURL"
        label={t("fields.productImageURL")}
        value={formData.productImageURL}
        onChange={(e) => setValue("productImageURL", e.target.value)}
      />
      <Box>
        <TextField
          fullWidth
          label={t("fields.productRequirements")}
          placeholder={t("requirementsHelp")}
          onKeyDown={handleRequirementsChange}
        />
        {(formData.productRequirements || []).length > 0 && (
          <Box sx={{ mt: 1 }}>
            {(formData.productRequirements || []).map((req, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                }}
              >
                • {req}
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemoveRequirement(index)}
                >
                  <X size={14} />
                </Button>
              </Typography>
            ))}
          </Box>
        )}
      </Box>
      <TextField
        fullWidth
        multiline
        rows={4}
        name="productWaiver"
        label={t("fields.productWaiver")}
        value={formData.productWaiver}
        onChange={(e) => setValue("productWaiver", e.target.value)}
      />
    </Box>
  );
}
