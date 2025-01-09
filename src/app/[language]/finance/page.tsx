import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import FinanceContent from "./page-content";

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

// The page component itself should be a server component
export default function FinancePage() {
  return <FinanceContent />;
}