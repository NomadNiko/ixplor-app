import { useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { EditCard } from '@/components/cards/edit-cards/EditCard';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { bookingItemEditConfig } from './configs/booking-item-config';
import { FormData } from '../shared/types';
import { BookingItem, BookingItemStatusEnum}  from "@/components/booking-item/types/booking-item";
import useConfirmDialog from '@/components/confirm-dialog/use-confirm-dialog';

interface BookingItemEditCardProps {
  item: BookingItem;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: BookingItemStatusEnum) => Promise<void>;
}

export default function BookingItemEditCard({
  item,
  onSave,
  onCancel,
  onDelete,
  onStatusChange,
}: BookingItemEditCardProps) {
  const { t } = useTranslation("booking-items");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();

  const initialData: FormData = {
    productName: item.productName,
    description: item.description,
    imageUrl: item.imageUrl || '',
    price: item.price,
    duration: item.duration,
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      // Ensure duration is a multiple of 30
      const duration = Number(formData.duration);
      if (duration % 30 !== 0) {
        throw new Error('Duration must be in 30-minute intervals');
      }

      const submissionData = {
        productName: formData.productName as string,
        description: formData.description as string,
        imageUrl: formData.imageUrl as string,
        price: Number(formData.price) / 100,
        duration: duration
      };

      const response = await fetch(`${API_URL}/booking-items/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking item");
      }

      onSave();
    } catch (error) {
      console.error("Error updating booking item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmed = await confirmDialog({
      title: t('confirmDelete.title'),
      message: t('confirmDelete.message'),
      successButtonText: t('confirmDelete.confirm'),
      cancelButtonText: t('confirmDelete.cancel'),
    });

    if (confirmed) {
      setIsSubmitting(true);
      try {
        await onDelete(item._id);
        onSave();
      } catch (error) {
        console.error('Error deleting booking item:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleStatusChange = async (status: BookingItemStatusEnum) => {
    if (!onStatusChange || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onStatusChange(item._id, status);
      onSave();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editConfig = {
    ...bookingItemEditConfig,
    approvalButtons: onStatusChange ? {
      type: 'booking-item' as const,
      currentStatus: item.status,
      onStatusChange: handleStatusChange
    } : undefined
  };

  return (
    <EditCard
      config={editConfig}
      initialData={initialData}
      onSave={handleSubmit}
      onCancel={onCancel}
      onDelete={onDelete ? handleDelete : undefined}
      isSubmitting={isSubmitting}
    />
  );
}