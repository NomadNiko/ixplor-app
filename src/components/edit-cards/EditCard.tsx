import React from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useForm, FormProvider } from "react-hook-form";
import { EditCardProps, FormData } from './types';
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
  isSubmitting = false
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