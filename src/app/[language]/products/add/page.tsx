import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import ProductCreationPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "products");
  return {
    title: t("productCreation"),
  };
}

export default function ProductAddPage() {
  return <ProductCreationPageContainer />;
}