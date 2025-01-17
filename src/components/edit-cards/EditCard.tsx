import React from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Save, X, Trash2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { EditCardProps, FormData } from './types';
import { EditCardSection } from './EditCardSection';
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

  const handleSubmit = async (data: FormData) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

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

          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between",
            mt: 3,
            gap: 2 
          }}>
            {onDelete && (
              <Button
                variant="contained"
                color="error"
                startIcon={<Trash2 size={16} />}
                onClick={onDelete}
                disabled={isSubmitting}
              >
                {t('delete')}
              </Button>
            )}

            <Box sx={{ display: "flex", gap: 2, ml: 'auto' }}>
              {customActions}
              <Button
                variant="contained"
                color="inherit"
                startIcon={<X size={16} />}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save size={16} />}
                onClick={methods.handleSubmit(handleSubmit)}
                disabled={isSubmitting}
              >
                {t('save')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </FormProvider>
  );
};