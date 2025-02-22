import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import StaffUserEditPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "staff-users");
  return {
    title: t("editStaffUser"),
  };
}

export default function StaffUserEditPage() {
  return <StaffUserEditPageContainer />;
}
