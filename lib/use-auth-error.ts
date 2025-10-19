"use client";

import { useTranslations } from "next-intl";
import { AUTH_ERROR_CODES, type AuthErrorCode } from "./auth-error-codes";

function isAuthErrorCode(errorCode: string): errorCode is AuthErrorCode {
  return (AUTH_ERROR_CODES as readonly string[]).includes(errorCode);
}

export function useAuthError() {
  const translate = useTranslations("betterAuth.error");

  const getAuthErrorMessage = (errorCode: string | undefined): string => {
    if (!errorCode || !isAuthErrorCode(errorCode)) {
      return translate("UNKNOWN_ERROR");
    }

    try {
      return translate(errorCode);
    } catch {
      return translate("UNKNOWN_ERROR");
    }
  };

  return { getAuthErrorMessage };
}
