import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import FinanceContent from "./page-content";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { t } = await getServerTranslation(resolvedParams.language, "finance");
  
  return {
    title: t("finance:title"),
    description: t("finance:description"),
    openGraph: {
      title: t("finance:title"),
      description: t("finance:description"),
      type: "website",
    },
  };
}

// This ensures the finance page requires authentication
const ProtectedFinanceContent = withPageRequiredAuth(FinanceContent);

export default function FinancePage() {
  return <ProtectedFinanceContent />;
}