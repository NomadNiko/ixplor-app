import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import EditCardTestContainer from "./edit-card-test-container";

interface PageProps {
  params: { language: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { t } = await getServerTranslation(params.language, "tests");
  return {
    title: t("editCardTest"),
  };
}

export default function EditCardsTestPage() {
  return <EditCardTestContainer />;
}