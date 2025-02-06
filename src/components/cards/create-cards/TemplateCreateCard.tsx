import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCard } from "@/components/cards/create-cards/CreateCard";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { templateConfig } from "@/components/template/template-form-config";
import { FormData } from "@/components/cards/shared/types";

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
        enqueueSnackbar(t("errors.unauthorized"), { variant: "error" });
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
        latitude: formData.latitude as number,
        longitude: formData.longitude as number,
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
        enqueueSnackbar(t("success.templateCreated"), { variant: "success" });
        router.push("/templates");
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating template:", error);
      enqueueSnackbar(t("errors.createFailed"), { variant: "error" });
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
