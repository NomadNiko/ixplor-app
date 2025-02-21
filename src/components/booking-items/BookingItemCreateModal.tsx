import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form"; // Use useFormState
import { useTranslation } from "@/services/i18n/client";
import { CreateBookingItemDto } from '@/hooks/booking/types';
import DurationPickerBookingItems from '../cards/shared/DurationPickerBookingItems';
import { ImageUploadField } from '@/components/cards/shared/ImageUploadField';
import { BookingFormData } from './types';

interface BookingItemCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookingItemDto) => Promise<void>;
  vendorId: string;
}

const defaultValues: BookingFormData = {
  productName: '',
  description: '',
  price: 0,
  duration: 30,
  imageUrl: '',
  vendorId: ''
};

export const BookingItemCreateModal: React.FC<BookingItemCreateModalProps> = ({
  open,
  onClose,
  onSubmit,
  vendorId,
}) => {
  const { t } = useTranslation("booking-items");
  
  const { control, handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      ...defaultValues,
      vendorId
    }
  });

  // Use useFormState instead of formState from useForm
  //const { errors } = useFormState({ control });

  const handleFormSubmit = async (data: BookingFormData) => {
    await onSubmit({ ...data, vendorId } as CreateBookingItemDto);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('create.title')}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              {...register('productName', { required: true })}
              label={t('fields.name')}
              fullWidth
              //error={!!errors.productName}
              //helperText={errors.productName ? t('errors.required') : ''}
            />
            <TextField
              {...register('description', { required: true })}
              label={t('fields.description')}
              fullWidth
              multiline
              rows={3}
              //error={!!errors.description}
              //helperText={errors.description ? t('errors.required') : ''}
            />
            <TextField
              {...register('price', { 
                required: true, 
                min: 0,
                validate: (value) => !isNaN(Number(value)) 
              })}
              label={t('fields.price')}
              type="number"
              fullWidth
              //error={!!errors.price}
              //helperText={errors.price ? t('errors.invalidPrice') : ''}
            />
            <DurationPickerBookingItems
              name="duration"
              label={t('fields.duration')}
              control={control}
              required={true}
            />
            <ImageUploadField
              field={{
                name: 'imageUrl',
                label: t('fields.image'),
                type: 'fileUpload'
              }}
              mode="create"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" variant="contained">
            {t('actions.create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};