// src/components/cards/edit-cards/StaffUserEditCard.tsx
import { useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { EditCard } from '@/components/cards/edit-cards/EditCard';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { staffUserEditConfig } from './configs/staff-user-config';
import { FormData, CardConfig } from '../shared/types';
import useConfirmDialog from '@/components/confirm-dialog/use-confirm-dialog';
import { StaffUser, StaffUserStatusEnum } from '@/components/staff-user/types/staff-user';

interface StaffUserEditCardProps {
  staffUser: StaffUser;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: StaffUserStatusEnum) => Promise<void>;
}

export default function StaffUserEditCard({
  staffUser,
  onSave,
  onCancel,
  onDelete,
  onStatusChange,
}: StaffUserEditCardProps) {
  const { t } = useTranslation("staff-users");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();

  const initialData: FormData = {
    name: staffUser.name,
    email: staffUser.email || '',
    phone: staffUser.phone || '',
    qualifiedProducts: staffUser.qualifiedProducts,
    vendorId: staffUser.vendorId
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const submissionData = {
        name: formData.name as string,
        email: formData.email as string,
        phone: formData.phone as string,
        qualifiedProducts: formData.qualifiedProducts as string[]
      };

      const response = await fetch(`${API_URL}/staff-users/${staffUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to update staff user");
      }
      onSave();
    } catch (error) {
      console.error("Error updating staff user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmed = await confirmDialog({
      title: t("deleteConfirm.title"),
      message: t("deleteConfirm.message"),
      successButtonText: t("deleteConfirm.confirm"),
      cancelButtonText: t("deleteConfirm.cancel"),
    });

    if (confirmed) {
      setIsSubmitting(true);
      try {
        await onDelete(staffUser._id);
        onSave();
      } catch (error) {
        console.error("Error deleting staff user:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleStatusChange = async (status: StaffUserStatusEnum) => {
    if (!onStatusChange || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onStatusChange(staffUser._id, status);
      onSave();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editConfig: CardConfig = {
    ...staffUserEditConfig,
    type: 'staff-user',
    approvalButtons: onStatusChange ? {
      type: 'staff-user',
      currentStatus: staffUser.status,
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