"use client";
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import ShiftGeneratorPageContent from "./page-content";
import { RoleEnum } from "@/services/api/types/role";

export default function ShiftGeneratorPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const params = useParams();
  const staffId = params?.staffId as string;

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.replace('/sign-in');
      } else if (
        Number(user.role?.id) !== RoleEnum.ADMIN && 
        Number(user.role?.id) !== RoleEnum.VENDOR
      ) {
        router.replace('/');
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return null;
  }

  if (!user || (
    Number(user.role?.id) !== RoleEnum.ADMIN && 
    Number(user.role?.id) !== RoleEnum.VENDOR
  )) {
    return null;
  }

  return <ShiftGeneratorPageContent staffId={staffId} />;
}