import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import ApprovalsPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "approvals");
  return {
    title: t("title"),
  };
}

export default function Page() {
  return <ApprovalsPageContainer />;
}