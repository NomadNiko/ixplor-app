"use client";
import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useFormContext, useFormState } from "react-hook-form";
import { FormData, CardFieldProps } from './types';
import { AddressField } from './AddressField';
import { ImageUploadField } from './ImageUploadField';
import { useTranslation } from "@/services/i18n/client";
import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import FormTimePickerInput from "@/components/form/date-pickers/time-picker";
import BaseCurrencyInput from './CurrencyInput';
import DurationInput from './DurationInput';
import DynamicRequirementsField from './DynamicRequirementsField';
import Grid from '@mui/material/Grid';

export const CardField: React.FC<CardFieldProps> = ({ 
  field,
  mode = 'edit'
}) => {
  const { register, control, setValue } = useFormContext<FormData>();
  const { errors } = useFormState();
  const { t } = useTranslation('tests');
  const [incrementType, setIncrementType] = useState<'5mins' | '15mins' | 'hours' | 'days'>('15mins');

  if (field.type === 'break') {
    return <Grid item xs={12} />;
  }

  const validationRules = {
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
    InputLabelProps: { shrink: true },
  };

  if (field.type === 'price') {
    return (
      <BaseCurrencyInput
        name={field.name}
        label={t(field.label)}
        control={control}
        error={errors[field.name]?.message as string}
        required={field.required}
        onCurrencyChange={(currency) => console.log('Currency changed to:', currency)}
      />
    );
  }

  if (field.type === 'duration') {
    return (
      <DurationInput
        name={field.name}
        label={t(field.label)}
        control={control}
        required={field.required}
        incrementType={incrementType}
        onIncrementChange={(type) => {
          setIncrementType(type);
          setValue(field.name, '');
        }}
      />
    );
  }

  if (field.type === 'requirements') {
    return <DynamicRequirementsField field={field} mode={mode} />;
  }

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

  if (field.type === 'multiselect') {
    return (
      <TextField
        select
        SelectProps={{
          multiple: true,
          renderValue: (selected) => {
            const selectedValues = selected as string[];
            return selectedValues
              .map(value => field.options?.find(opt => opt.value === value)?.label)
              .join(', ');
          }
        }}
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