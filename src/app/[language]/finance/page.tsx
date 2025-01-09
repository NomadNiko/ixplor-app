import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import FinanceContent from "./page-content";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "finance");

  return {
    title: t("title"),
  };
}

export default function FinanceWrapperPage() {
  return (
    <div>
      {/* You can add any header or other elements here */}
      <FinanceContent />
      {/* You can add a footer or other elements here */}
    </div>
  );
}