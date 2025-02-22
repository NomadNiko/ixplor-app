import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateCard } from '@/components/cards/create-cards/CreateCard';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { staffUserConfig } from '@/components/cards/create-cards/configs/staff-user-config';
import { FormData } from '@/components/cards/shared/types';
import { StaffUserStatusEnum } from '@/components/staff-user/types/staff-user';

export default function StaffUserCreateCard() {
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

      const submissionData = {
        vendorId: formData.vendorId as string,
        name: formData.name as string,
        email: formData.email as string,
        phone: formData.phone as string,
        status: StaffUserStatusEnum.ACTIVE
      };

      const response = await fetch(`${API_URL}/staff-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error('Failed to create staff user');
      }

      router.push('/staff-users');
    } catch (error) {
      console.error('Error creating staff user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/staff-users');
  };

  return (
    <CreateCard
      config={staffUserConfig}
      initialData={{}}
      onSave={handleSave}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}