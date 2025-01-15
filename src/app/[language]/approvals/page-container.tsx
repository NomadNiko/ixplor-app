"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import ApprovalsPage from "./page-content";

export default function ApprovalsPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  useEffect(() => {
    if (isLoaded && (!user?.role || user.role.id !== 1)) {
      router.replace('/');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return null;
  }

  if (!user?.role || user.role.id !== 1) {
    return null;
  }

  return <ApprovalsPage />;
}