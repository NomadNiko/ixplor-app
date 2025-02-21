"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import BookingItemsPageContent from "./page-content";
import { RoleEnum } from "@/services/api/types/role";

export default function BookingItemsPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  useEffect(() => {
    if (isLoaded && (!user || Number(user.role?.id) !== RoleEnum.VENDOR)) {
      router.replace('/');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user || Number(user.role?.id) !== RoleEnum.VENDOR) {
    return null;
  }

  return <BookingItemsPageContent />;
}