// ImageUploadField.tsx
import React from "react";
import TextField from "@mui/material/TextField";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { useTranslation } from "@/services/i18n/client";
import { ImageUploadFieldProps } from './types';
import Box from "@mui/material/Box";
import { Image } from "@nextui-org/react";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  field,
  mode = 'edit'
}) => {
  const { register, setValue } = useFormContext();
  const { errors } = useFormState();
  const { t } = useTranslation("tests");
  
  const imageUrl = useWatch({
    name: field.name,
  });

  const formatUrl = (value: string) => {
    if (!value) return value;
    const cleanUrl = value.trim().replace(/^(https?:\/\/)?/, '');
    return cleanUrl ? `https://${cleanUrl}` : cleanUrl;
  };


  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatUrl(e.target.value);
    setValue(field.name, formattedValue);
  };

  return (
    <div>
      <TextField
        {...register(field.name, { 
          required: field.required,
          disabled: mode === 'edit' && field.prefilled 
        })}
        label={t(field.label)}
        fullWidth
        error={!!errors[field.name]}
        helperText={errors[field.name]?.message as string}
        InputLabelProps={{ shrink: true }}
        onChange={handleUrlChange}
        placeholder=""
        InputProps={{
          startAdornment: imageUrl ? null : (
            <InputAdornment position="start">
              <Typography color="text.secondary">https://</Typography>
            </InputAdornment>
          ),
        }}
      />
      {imageUrl && (
        <Box sx={{ mt: 2, maxWidth: '100%', overflow: 'hidden' }}>
          <Image
            src={imageUrl}
            alt={t("preview")}
            style={{
              maxWidth: '400px',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '4px'
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default ImageUploadField;