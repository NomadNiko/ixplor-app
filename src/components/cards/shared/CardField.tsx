import React from 'react';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useFormContext, useFormState, RegisterOptions } from "react-hook-form";
import { FormData, CardFieldProps } from './types';
import { AddressField } from './AddressField';
import { ImageUploadField } from './ImageUploadField';
import { useTranslation } from "@/services/i18n/client";
import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import FormTimePickerInput from "@/components/form/date-pickers/time-picker";

export const CardField: React.FC<CardFieldProps> = ({ 
  field,
  mode = 'edit'
}) => {
  const { register } = useFormContext<FormData>();
  const { errors } = useFormState();
  const { t } = useTranslation('tests');

  if (field.type === 'address') {
    return <AddressField field={field} mode={mode} />;
  }

  if (field.type === 'image') {
    return <ImageUploadField field={field} mode={mode} />;
  }

  if (field.type === 'date') {
    return (
      <FormDatePickerInput
        name={field.name}
        label={t(field.label)}
      />
    );
  }

  if (field.type === 'time') {
    return (
      <FormTimePickerInput
        name={field.name}
        label={t(field.label)}
        format="HH:mm"
      />
    );
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
    helperText: errors[field.name]?.message as string,
    InputLabelProps: { 
      shrink: true,
      sx: {
        transform: 'translate(14px, -9px) scale(0.75)'
      }
    },
    sx: {
      mb: 3,
      mt: 1,
      '& .MuiInputBase-root': {
        height: field.type === 'textarea' ? 'auto' : '56px'
      }
    }
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

export default CardField;