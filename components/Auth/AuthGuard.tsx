"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/apiFetch";
import { useAuthStore } from "@/store/AuthStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<null | boolean>(null);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((response) => {
        setAuth(true)
        useAuthStore.getState().setIsAuthenticated(response.authenticated);
      })
      .catch(() => {
        setAuth(false);
        router.replace("/");
      });
  }, [router]);

  if (auth === null)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <span>Chargement...</span>
      </div>
    );

  if (!auth) return null;

  return <>{children}</>;
}
