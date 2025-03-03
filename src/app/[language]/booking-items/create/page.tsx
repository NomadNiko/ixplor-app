import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import BookingItemCreateContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "booking-items");
  return {
    title: t("createBookingItem"),
  };
}

export default function BookingItemCreatePage() {
  return <BookingItemCreateContainer />;
}