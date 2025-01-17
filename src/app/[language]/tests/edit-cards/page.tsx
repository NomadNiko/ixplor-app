import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import EditCardTestContainer from "./edit-card-test-container";

type Props = {
  params: { language: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getServerTranslation(params.language, "tests");
  return {
    title: t("editCardTest"),
  };
}

export default function Page() {
  return <EditCardTestContainer />;
}