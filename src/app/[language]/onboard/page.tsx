import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const OnboardContent = dynamic(() => import('./page-content'), { ssr: false });

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "onboard");

  return {
    title: t("title"),
  };
}

export default function Page() {
  // Server Component
  return <OnboardContent />;
}