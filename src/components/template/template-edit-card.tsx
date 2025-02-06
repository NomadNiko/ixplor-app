import { useState } from "react";
import { useSnackbar } from "@/hooks/use-snackbar";
import { useTranslation } from "@/services/i18n/client";
import { EditCard } from '@/components/cards/edit-cards/EditCard';
import { templateConfig } from './template-form-config';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { FormData } from '../cards/shared/types';
import useConfirmDialog from '@/components/confirm-dialog/use-confirm-dialog';
import { TemplateStatusEnum } from './template-status-badge';

interface Template {
  _id: string;
  templateName: string;
  description: string;
  basePrice: number;
  productType: string;
  vendorId: string;
  requirements: string[];
  additionalInfo: string;
  waiver: string;
  imageURL?: string;
  defaultLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  defaultDuration?: number;
  templateStatus: TemplateStatusEnum;
}

interface TemplateEditCardProps {
  template: Template;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: TemplateStatusEnum) => Promise<void>;
}

export default function TemplateEditCard({
  template,
  onSave,
  onCancel,
  onDelete,
  onStatusChange,
}: TemplateEditCardProps) {
  const { t } = useTranslation("templates");
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();

  const initialData: FormData = {
    templateName: template.templateName,
    description: template.description,
    basePrice: template.basePrice,
    productType: template.productType,
    vendorId: template.vendorId,
    requirements: template.requirements,
    waiver: template.waiver,
    imageURL: template.imageURL || '',
    defaultDuration: template.defaultDuration || null,
    additionalInfo: template.additionalInfo,
    latitude: template.defaultLocation?.coordinates[1] || null,
    longitude: template.defaultLocation?.coordinates[0] || null,
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t("errors.unauthorized"), { variant: "error" });
        return;
      }

      const submissionData = {
        templateName: formData.templateName as string,
        description: formData.description as string,
        basePrice: Number(formData.basePrice),
        productType: formData.productType as string,
        requirements: formData.requirements as string[],
        waiver: formData.waiver as string,
        imageURL: formData.imageURL as string,
        additionalInfo: formData.additionalInfo as string,
        defaultLatitude: Number(formData.latitude),
        defaultLongitude: Number(formData.longitude),
        defaultDuration: formData.defaultDuration ? Number(formData.defaultDuration) : undefined,
      };

      const response = await fetch(`${API_URL}/product-templates/${template._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to update template");
      }

      enqueueSnackbar(t("success.updated"), { variant: "success" });
      onSave();
    } catch (error) {
      console.error("Error updating template:", error);
      enqueueSnackbar(t("errors.updateFailed"), { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = await confirmDialog({
      title: t('deleteConfirm.title'),
      message: t('deleteConfirm.message'),
      successButtonText: t('deleteConfirm.confirm'),
      cancelButtonText: t('deleteConfirm.cancel'),
    });

    if (confirmed) {
      setIsSubmitting(true);
      try {
        await onDelete(template._id);
        enqueueSnackbar(t('success.deleted'), { variant: 'success' });
        onSave();
      } catch (error) {
        console.error('Error deleting template:', error);
        enqueueSnackbar(t('errors.deleteFailed'), { variant: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleStatusChange = async (status: TemplateStatusEnum) => {
    if (!onStatusChange || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onStatusChange(template._id, status);
      enqueueSnackbar(t(`success.status.${status.toLowerCase()}`), { variant: 'success' });
      onSave();
    } catch (error) {
      console.error('Error updating status:', error);
      enqueueSnackbar(t('errors.statusUpdateFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const editConfig = {
    ...templateConfig,
    type: 'template' as const,
    approvalButtons: onStatusChange ? {
      type: 'template' as const,
      currentStatus: template.templateStatus,
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