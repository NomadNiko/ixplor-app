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
    title: t("title"),
    description: t("description"),
  };
}

export default function FinancePage() {
  return <FinanceContent />;
}