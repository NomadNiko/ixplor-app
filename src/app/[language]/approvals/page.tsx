"use client";
import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import ApprovalsPage from "./page-content";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";

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

// We'll use the withPageRequiredAuth HOC with the roles from RoleEnum
const SecuredApprovalsPage = withPageRequiredAuth(ApprovalsPage, { 
  roles: [1] // 1 is the admin role ID
});

export default function Page() {
  return <SecuredApprovalsPage />;
}