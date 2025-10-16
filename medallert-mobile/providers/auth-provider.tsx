import { useRouter } from "expo-router";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import { getJwtSubIfNotExpired } from "@/utils/jwt";
import env from "@/config/env";

export const TOKEN_KEY = "medallert.token" as const;

type User = { id: string };
type LoginCredentials = { email: string; password: string };
type CreateAccountCredentials = LoginCredentials & {
  phone: string;
  fullName: string;
};
type ConfirmAccountCredentials = { code: string; email: string };
type SendPasswordRecoveryCodeCredentials = { email: string };
type ChangePasswordCredentials = ConfirmAccountCredentials & {
  newPassword: string;
};

type AuthContexType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isReady: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  createAccount: (credentials: CreateAccountCredentials) => Promise<void>;
  confirmAccount: (credentials: ConfirmAccountCredentials) => Promise<void>;
  sendPasswordRecoveryCode: (
    credentials: SendPasswordRecoveryCodeCredentials,
  ) => Promise<void>;
  changePassword: (credentials: ChangePasswordCredentials) => Promise<void>;
};

const AuthContext = createContext({} as AuthContexType);

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isLoggedIn = !!user;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!mounted) return;

        if (storedToken) {
          const id = getJwtSubIfNotExpired(storedToken);
          if (id) {
            setUser({ id });
            setToken(storedToken);
          } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
          }
        }
      } finally {
        if (mounted) setIsReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${env.BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        throw new Error("Failed to login");
      }

      const { token } = await res.json();
      const id = getJwtSubIfNotExpired(token);

      if (id) {
        setUser({ id });
        setToken(token);
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAccount = useCallback(
    async (credentials: CreateAccountCredentials) => {
      setIsLoading(true);
      try {
        const res = await fetch(`${env.BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        if (!res.ok) throw new Error("Failed to create account");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const confirmAccount = useCallback(
    async (credentials: ConfirmAccountCredentials) => {
      setIsLoading(true);
      try {
        const res = await fetch(`${env.BASE_URL}/auth/confirm-account`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        if (!res.ok) throw new Error("Failed to confirm account");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const sendPasswordRecoveryCode = useCallback(
    async (credentials: SendPasswordRecoveryCodeCredentials) => {
      setIsLoading(true);
      try {
        const res = await fetch(`${env.BASE_URL}/auth/recover-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        if (!res.ok) throw new Error("Failed to send recovery code");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const changePassword = useCallback(
    async (credentials: ChangePasswordCredentials) => {
      setIsLoading(true);
      try {
        const res = await fetch(`${env.BASE_URL}/auth/change-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        if (!res.ok) throw new Error("Failed to change password");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    router.replace("/login");
  }, [router]);

  if (!isReady) return <ActivityIndicator />;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isLoggedIn,
        isReady,
        login,
        logout,
        createAccount,
        confirmAccount,
        sendPasswordRecoveryCode,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
