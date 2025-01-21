"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import ProductCreationPageContent from "./page-contents";
import { RoleEnum } from "@/services/api/types/role";

export default function ProductCreationPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        // Not logged in - redirect to login
        router.replace('/login');
      } else if (
        Number(user.role?.id) !== RoleEnum.ADMIN && 
        Number(user.role?.id) !== RoleEnum.VENDOR
      ) {
        // Logged in but not ADMIN or VENDOR - redirect to home
        router.replace('/');
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return null;
  }

  // Only show content if user is logged in and has appropriate role
  if (!user || (
    Number(user.role?.id) !== RoleEnum.ADMIN && 
    Number(user.role?.id) !== RoleEnum.VENDOR
  )) {
    return null;
  }

  return <ProductCreationPageContent />;
}