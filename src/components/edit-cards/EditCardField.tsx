import React from 'react';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useFormContext, useFormState, RegisterOptions } from "react-hook-form";
import { FieldConfig, FormData } from './types';
import { AddressField } from './fields/AddressField';
import { ImageUploadField } from './fields/ImageUploadField';
import { useTranslation } from "@/services/i18n/client";

interface EditCardFieldProps {
  field: FieldConfig;
}

export const EditCardField: React.FC<EditCardFieldProps> = ({ field }) => {
  const { register } = useFormContext<FormData>();
  const { errors } = useFormState();
  const { t } = useTranslation('common');

  if (field.type === 'address') {
    return <AddressField field={field} />;
  }

  if (field.type === 'image') {
    return <ImageUploadField field={field} />;
  }

  const validationRules: RegisterOptions = {
    required: field.required && {
      value: true,
      message: t('fieldRequired')
    },
    ...((field.validation?.min !== undefined) && {
      min: {
        value: field.validation.min,
        message: t('validationMin', { min: field.validation.min })
      }
    }),
    ...((field.validation?.max !== undefined) && {
      max: {
        value: field.validation.max,
        message: t('validationMax', { max: field.validation.max })
      }
    }),
    ...((field.validation?.pattern !== undefined) && {
      pattern: {
        value: new RegExp(field.validation.pattern),
        message: t('validationPattern')
      }
    })
  };

  const baseProps = {
    ...register(field.name, validationRules),
    label: t(field.label),
    fullWidth: true,
    error: !!errors[field.name],
    helperText: errors[field.name]?.message as string
  };

  if (field.type === 'select') {
    return (
      <TextField
        select
        {...baseProps}
      >
        {field.options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {t(option.label)}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (field.type === 'textarea') {
    return (
      <TextField
        {...baseProps}
        multiline
        rows={field.rows || 4}
      />
    );
  }

  return (
    <TextField
      {...baseProps}
      type={field.type}
    />
  );
};