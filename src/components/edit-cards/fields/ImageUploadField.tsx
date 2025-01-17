import React from "react";
import TextField from "@mui/material/TextField";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { useTranslation } from "@/services/i18n/client";
import { FieldConfig } from "../types";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

interface ImageUploadFieldProps {
  field: FieldConfig;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  field,
}) => {
  const { register } = useFormContext();
  const { errors } = useFormState();
  const { t } = useTranslation("common");
  const theme = useTheme();

  const imageUrl = useWatch({
    name: field.name,
  });

  return (
    <div>
      <TextField
        {...register(field.name, { required: field.required })}
        label={t(field.label)}
        fullWidth
        error={!!errors[field.name]}
        helperText={errors[field.name]?.message as string}
      />
      {imageUrl && (
        <Box sx={{ mt: theme.spacing(1) }}>
          <Image
            src={imageUrl}
            alt={t("preview")}
            width={400}
            height={200}
            style={{
              maxWidth: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      )}
    </div>
  );
};
