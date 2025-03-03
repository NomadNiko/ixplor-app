import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import ShiftGeneratorPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "staff-shifts");
  return {
    title: t("generateShifts"),
  };
}

export default function ShiftGeneratorPage() {
  return <ShiftGeneratorPageContainer />;
}