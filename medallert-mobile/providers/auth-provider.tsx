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

const TOKEN_KEY = "medallert.token" as const;

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isLoggedIn = user !== null;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!mounted) return;

        if (token) {
          const id = getJwtSubIfNotExpired(token);
          if (id && mounted) {
            setUser({ id });
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

  const login = useCallback(async (login: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:3000/auth/login", {
        method: "POST",
        body: JSON.stringify(login),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw "Failed login";
      }

      const { token }: { token: string } = await res.json();

      setUser({ id: token });
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAccount = useCallback(
    async (createAccount: CreateAccountCredentials): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:3000/auth/register", {
          method: "POST",
          body: JSON.stringify(createAccount),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw "Failed to create account";
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const confirmAccount = useCallback(
    async (confirm: ConfirmAccountCredentials): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:3000/auth/confirm-account", {
          method: "POST",
          body: JSON.stringify(confirm),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw "Failed to confirm account";
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const sendPasswordRecoveryCode = useCallback(
    async (recovery: SendPasswordRecoveryCodeCredentials): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:3000/auth/recover-password", {
          method: "POST",
          body: JSON.stringify(recovery),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw "Failed to recover account";
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const changePassword = useCallback(
    async (changeCredentials: ChangePasswordCredentials): Promise<void> => {
      setIsLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:3000/auth/change-password", {
          method: "POST",
          body: JSON.stringify(changeCredentials),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw "Failed to change password";
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    setUser(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    router.replace("/login");
  }, [router]);

  if (!isReady) return <ActivityIndicator />;

  return (
    <AuthContext.Provider
      value={{
        user: null,
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
