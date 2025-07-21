"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/apiFetch";
import { useAuthStore } from "@/store/AuthStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<null | boolean>(null);
  const router = useRouter();

  const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/user/user-profile");
        console.log("User profile fetched:", response);
        useAuthStore.getState().setProfile(response);
      } catch {
        console.error("User profile fetch error");
      }
    };

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((response) => {
        console.log("AuthGuard response:", response);
        if (response.authenticated === true) {
          setAuth(true)
          fetchUserProfile();
          useAuthStore.getState().setIsAuthenticated(response.authenticated);
        }
      })
      .catch(() => {
        setAuth(false);
        router.replace("/");
      });
  }, [router]);

  if (auth === null)
    return (
      <div className="">
        <span></span>
      </div>
    );

  if (!auth) return null;

  return <>{children}</>;
}
