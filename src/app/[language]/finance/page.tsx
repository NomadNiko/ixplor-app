import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import FinanceContent from "./page-content";

type Props = {
  params: { language: string };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(props.params.language, "finance");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function FinancePage() {
  return <FinanceContent />;
}