import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCard } from "@/components/cards/create-cards/CreateCard";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { templateConfig } from "@/components/template/template-form-config";
import { FormData } from "@/components/cards/shared/types";

export default function TemplateCreateCard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        router.push("/sign-in");
        return;
      }

      const submissionData = {
        templateName: formData.templateName as string,
        description: formData.description as string,
        basePrice: Number(formData.basePrice),
        productType: formData.productType as string,
        vendorId: formData.vendorId as string,
        requirements: (formData.requirements as string[]) || [],
        waiver: (formData.waiver as string) || "",
        defaultDuration: formData.defaultDuration
          ? Number(formData.defaultDuration)
          : undefined,
        latitude: Number(formData.location_latitude),
        longitude: Number(formData.location_longitude),
        imageURL: (formData.imageURL as string) || "",
        templateStatus: "DRAFT",
      };

      const response = await fetch(`${API_URL}/product-templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        router.push("/templates");
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating template:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
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
