import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateCard } from '@/components/cards/create-cards/CreateCard';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { bookingItemConfig } from '@/components/cards/create-cards/configs/booking-item-config';
import { FormData } from '@/components/cards/shared/types';

export default function BookingItemCreateCard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        router.push('/sign-in');
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
        duration: duration,
        vendorId: formData.vendorId as string,
        status: 'DRAFT'
      };

      const response = await fetch(`${API_URL}/booking-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error('Failed to create booking item');
      }

      router.push('/booking-items');
    } catch (error) {
      console.error('Error creating booking item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/booking-items');
  };

  return (
    <CreateCard
      config={bookingItemConfig}
      initialData={{}}
      onSave={handleSave}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}