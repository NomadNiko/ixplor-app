import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import EditCardTestContainer from "./edit-card-test-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "tests");
  return {
    title: t("editCardTest"),
  };
}

export default function Page() {
  return <EditCardTestContainer />;
}