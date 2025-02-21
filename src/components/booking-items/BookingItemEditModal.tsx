import React, { useState } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";
import { useTranslation } from "@/services/i18n/client";
import { BookingItem, UpdateBookingItemDto } from '@/hooks/booking/types';
import { ImageUploadField } from '@/components/cards/shared/ImageUploadField';
import { BookingItemStatusToggle } from './BookingItemStatusToggle';
import { BookingItemStatusEnum } from '@/types/booking-item';
import DurationPickerBookingItems from '../cards/shared/DurationPickerBookingItems';
import { BookingFormData } from './types';

interface BookingItemEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateBookingItemDto) => Promise<void>;
  onStatusChange: (status: BookingItemStatusEnum) => Promise<void>;
  item: BookingItem;
}

export const BookingItemEditModal: React.FC<BookingItemEditModalProps> = ({
  open,
  onClose,
  onSubmit,
  onStatusChange,
  item,
}) => {
  const { t } = useTranslation("booking-items");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, control } = useForm<BookingFormData>({
    defaultValues: {
      productName: item.productName,
      description: item.description,
      price: item.price,
      duration: item.duration,
      imageUrl: item.imageUrl,
    },
  });

  const handleFormSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data as UpdateBookingItemDto);
      onClose();
    } catch (error) {
      console.error('Error updating booking item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isSubmitting ? onClose : undefined}
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {t('edit.title')}
        <BookingItemStatusToggle
          status={item.status}
          onStatusChange={onStatusChange}
          disabled={isSubmitting}
        />
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              {...register('productName', { required: true })}
              label={t('fields.name')}
              fullWidth
              disabled={isSubmitting}
            />
            <TextField
              {...register('description', { required: true })}
              label={t('fields.description')}
              fullWidth
              multiline
              rows={3}
              disabled={isSubmitting}
            />
            <TextField
              {...register('price', { 
                required: true,
                min: 0,
                valueAsNumber: true
              })}
              label={t('fields.price')}
              type="number"
              fullWidth
              disabled={isSubmitting}
            />
            <DurationPickerBookingItems
              name="duration"
              label={t('fields.duration')}
              control={control}
              required={true}
              disabled={isSubmitting}
            />
            {!isSubmitting && (
              <ImageUploadField
                field={{
                  name: 'imageUrl',
                  label: t('fields.image'),
                  type: 'fileUpload'
                }}
                mode="edit"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('actions.cancel')}
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? t('actions.saving') : t('actions.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};