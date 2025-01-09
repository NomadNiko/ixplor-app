import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import BaseCampDashboard from "./basecamp/BaseCampDashboard";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { t } = await getServerTranslation(resolvedParams.language, "basecamp");
  
  return {
    title: t("basecamp:title"),
    description: t("basecamp:description")
  };
}

export default function BaseCampPage() {
  return <BaseCampDashboard />;
}