// /src/components/cards/create-cards/CreateCard.tsx

import React, { useEffect } from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useForm, FormProvider, useWatch, useFormContext } from "react-hook-form";
import { BaseFieldValue, CreateCardProps, FormData } from './types';
import { CreateCardSection } from './CreateCardSection';
import { CreateCardActions } from './CreateCardActions';
import { useTranslation } from "@/services/i18n/client";

export const CreateCard: React.FC<CreateCardProps> = ({
  config,
  initialData,
  onSave,
  onCancel,
  customActions,
  isSubmitting = false,
  onChange
}) => {
  const { t } = useTranslation('tests');
  const methods = useForm<FormData>({ defaultValues: initialData });
  
  return (
    <FormProvider {...methods}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t(config.title)}
          </Typography>
          <CreateCardFormValues onChange={onChange} />
          
          {config.sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 && <Divider sx={{ my: 2 }} />}
              <CreateCardSection section={section} />
            </React.Fragment>
          ))}
          
          <CreateCardActions
            onSave={onSave}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            methods={methods}
            customActions={customActions}
            t={t}
            type={config.type}
          />
        </CardContent>
      </Card>
    </FormProvider>
  );
};

const CreateCardFormValues: React.FC<{ onChange?: (data: FormData) => void }> = ({ onChange }) => {
  const formValues = useWatch({ control: useFormContext().control });
  
  useEffect(() => {
    if (onChange) {
      const cleanedValues = Object.entries(formValues).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value as BaseFieldValue;
        }
        return acc;
      }, {} as FormData);
      onChange(cleanedValues);
    }
  }, [onChange, formValues]);
  
  return null;
};