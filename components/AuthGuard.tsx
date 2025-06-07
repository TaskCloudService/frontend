"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

interface Props { children: ReactNode }

export function AuthGuard({ children }: Props) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();


  const publicPaths = ["/events", "/events/", "/events/[id]"]; 
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

 
  useEffect(() => {
    if (!isPublic && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPublic, user, pathname, router]);

 
  if (!isPublic && !user) return null;

 
  return <>{children}</>;
}
