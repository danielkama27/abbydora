"use client";

import { SessionProvider, useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useCallback } from "react";

interface AuthContextType {
  user: { id: string; name: string | null; email: string | null; image: string | null; role: string } | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
});

function AuthInnerProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const signOut = useCallback(async () => {
    await nextAuthSignOut({ redirectTo: "/" });
  }, []);

  const user = session?.user
    ? {
        id: (session.user as any).id || "",
        name: session.user.name || null,
        email: session.user.email || null,
        image: session.user.image || null,
        role: (session.user as any).role || "customer",
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: status === "loading",
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthInnerProvider>{children}</AuthInnerProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
