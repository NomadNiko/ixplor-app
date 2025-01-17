import React, { useEffect } from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useForm, FormProvider, useWatch, useFormContext } from "react-hook-form";
import { BaseFieldValue, EditCardProps, FormData } from './types';
import { EditCardSection } from './EditCardSection';
import { EditCardActions } from './EditCardActions';
import { useTranslation } from "@/services/i18n/client";

export const EditCard: React.FC<EditCardProps> = ({
    config,
    initialData,
    onSave,
    onCancel,
    onDelete,
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
  
            <EditCardFormValues onChange={onChange} />
  
            {config.sections.map((section, index) => (
              <React.Fragment key={section.id}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <EditCardSection section={section} />
              </React.Fragment>
            ))}
  
            <EditCardActions
              onSave={onSave}
              onCancel={onCancel}
              onDelete={onDelete}
              isSubmitting={isSubmitting}
              methods={methods}
              customActions={customActions}
              t={t}
            />
          </CardContent>
        </Card>
      </FormProvider>
    );
  };
  
  const EditCardFormValues: React.FC<{ onChange?: (data: FormData) => void }> = ({ onChange }) => {
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