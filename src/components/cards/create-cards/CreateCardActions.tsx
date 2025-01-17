// /src/components/cards/create-cards/CreateCardActions.tsx

import React from 'react';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Save, X } from 'lucide-react';
import { FormData } from './types';
import { UseFormReturn } from 'react-hook-form';
import { ReactNode } from 'react';
import { useTheme } from '@mui/material/styles';

interface CreateCardActionsProps {
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  methods: UseFormReturn<FormData>;
  customActions?: ReactNode;
  t: (key: string) => string;
  type: 'vendor' | 'product';
}

export const CreateCardActions: React.FC<CreateCardActionsProps> = ({
  onSave,
  onCancel,
  isSubmitting,
  methods,
  customActions,
  t,
  type
}) => {
  const theme = useTheme();

  const handleSubmit = async (data: FormData) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      justifyContent: "flex-end",
      mt: 3,
      gap: 2 
    }}>
      {customActions}
      <Button
        variant="contained"
        sx={{
          background: theme.palette.customGradients.buttonMain,
          '&:hover': {
            background: theme.palette.customGradients.buttonMain,
            filter: 'brightness(0.9)',
          }
        }}
        startIcon={<X size={16} />}
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {t('cancel')}
      </Button>
      <Button
        variant="contained"
        sx={{
          background: theme.palette.customGradients.buttonSecondary,
          '&:hover': {
            background: theme.palette.customGradients.buttonSecondary,
            filter: 'brightness(0.9)',
          }
        }}
        startIcon={<Save size={16} />}
        onClick={methods.handleSubmit(handleSubmit)}
        disabled={isSubmitting}
      >
        {t(`create${type.charAt(0).toUpperCase() + type.slice(1)}`)}
      </Button>
    </Box>
  );
};