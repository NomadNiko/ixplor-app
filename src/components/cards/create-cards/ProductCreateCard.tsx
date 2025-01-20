
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateCard } from '@/components/cards/create-cards/CreateCard';
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { productConfig } from '@/components/cards/create-cards/configs';
import { FormData } from '@/components/cards/shared/types';
import { format } from 'date-fns';

export default function ProductCreateCard() {
  const { t } = useTranslation("products");
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

      const submissionData = {
        productName: formData.productName as string,
        productDescription: formData.productDescription as string,
        productType: formData.productType as string,
        productPrice: Number(formData.productPrice),
        productDuration: formData.productDuration ? Number(formData.productDuration) : undefined,
        productDate: formData.productDate ? format(new Date(formData.productDate as string), 'yyyy-MM-dd') : undefined,
        productStartTime: formData.productStartTime ? format(new Date(formData.productStartTime as string), 'HH:mm') : undefined,   
        productImageURL: formData.productImageURL as string,
        productAdditionalInfo: formData.productAdditionalInfo as string | undefined,
        productRequirements: formData.productRequirements as string[] | undefined, 
        productWaiver: formData.productWaiver as string | undefined,
        productStatus: 'DRAFT',
        vendorId: formData.vendorId as string,
        latitude: formData.latitude as number, 
        longitude: formData.longitude as number
      };
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`  
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        enqueueSnackbar(t('success.productCreated'), { variant: 'success' });
        router.push('/products');  
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      enqueueSnackbar(t('errors.createFailed'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);  
    }
  };

  const handleCancel = () => {
    router.push('/products');  
  };

  return (
    <CreateCard 
      config={productConfig}
      initialData={{}} 
      onSave={handleSave}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}