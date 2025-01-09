'use client';

import { useRouter } from "next/navigation";
import useAuth from "./use-auth";
import React, { FunctionComponent, useEffect } from "react";
import useLanguage from "../i18n/use-language";
import { RoleEnum } from "../api/types/role";

type PropsType = {
  params?: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
};

type OptionsType = {
  roles?: RoleEnum[];
};

const defaultRoles = Object.values(RoleEnum).filter(
  (value): value is RoleEnum => !Number.isNaN(Number(value))
);

export default function withPageRequiredAuth(
  Component: FunctionComponent<PropsType>,
  options?: OptionsType
) {
  // Make it explicit that this is a client component wrapper
  function WithPageRequiredAuth(props: PropsType) {
    const { user, isLoaded } = useAuth();
    const router = useRouter();
    const language = useLanguage();
    const optionRoles = options?.roles || defaultRoles;

    useEffect(() => {
      if (!isLoaded) return;

      const isAuthorized = user && 
        user.role?.id && 
        optionRoles.includes(Number(user.role.id));

      if (!isAuthorized) {
        const currentLocation = window.location.toString();
        const returnToPath = currentLocation.replace(
          new URL(currentLocation).origin, 
          ""
        ) || `/${language}`;

        const params = new URLSearchParams({
          returnTo: returnToPath,
        });

        const redirectTo = user 
          ? `/${language}` 
          : `/${language}/sign-in?${params.toString()}`;

        router.replace(redirectTo);
      }
    }, [user, isLoaded, router, language, optionRoles]);

    // Show nothing while loading or if not authorized
    if (!isLoaded || !user || !user.role?.id || 
        !optionRoles.includes(Number(user.role.id))) {
      return null;
    }

    return <Component {...props} />;
  }

  WithPageRequiredAuth.displayName = 
    `WithPageRequiredAuth(${Component.displayName || Component.name})`;

  return WithPageRequiredAuth;
}