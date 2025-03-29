"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthRedirectProps {
  configurationId: string;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ configurationId }) => {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("configurationId", configurationId);
    router.push("/auth");
  }, [configurationId, router]);

  return <p>Redirecting to authentication...</p>;
};

export default AuthRedirect;
