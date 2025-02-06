import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateCard } from '@/components/cards/create-cards/CreateCard';
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { templateConfig } from '@/components/template/template-form-config';
import { FormData } from '@/components/cards/shared/types';
import { TemplateStatusEnum } from './template-status-badge';

export default function TemplateCreateCard() {
  const { t } = useTranslation("templates");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        router.push('/sign-in');
        return;
      }

      // Log the form data to help debug
      console.log('Submitting template data:', formData);

      const submissionData = {
        templateName: formData.templateName,
        description: formData.description,
        basePrice: Number(formData.basePrice),
        productType: formData.productType,
        vendorId: formData.vendorId,
        requirements: formData.requirements || [],
        waiver: formData.waiver,
        defaultDuration: formData.defaultDuration ? Number(formData.defaultDuration) : undefined,
        defaultLatitude: formData.latitude,
        defaultLongitude: formData.longitude,
        imageURL: formData.imageURL,
        additionalInfo: formData.additionalInfo,
        templateStatus: TemplateStatusEnum.DRAFT
      };

      const response = await fetch(`${API_URL}/product-templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`  
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create template');
      }

      enqueueSnackbar(t('success.templateCreated'), { variant: 'success' });
      router.push('/templates');  

    } catch (error) {
      console.error('Error creating template:', error);
      enqueueSnackbar(t('errors.createFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);  
    }
  };

  const handleCancel = () => {
    router.push('/templates');  
  };

  return (
    <CreateCard 
      config={templateConfig}
      initialData={{}} 
      onSave={handleSave}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}