import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { TUser } from "../types/user";
import { useNavigate } from "react-router-dom";

type TAuthContext = {
  user: TUser | null;
  loading: boolean;
  error: any;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    firstname: string,
    lastname: string,
    password: string
  ) => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<TAuthContext>({} as any);

const TOKEN_KEY = "token";
const EXPIRY_KEY = "expiry";

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<TUser | null>(null);
  const [error, setError] = useState<any>(null);
  const toast = useToast();

  const login: TAuthContext["login"] = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post<{ user: TUser; accessToken: string }>(
        "/api/accounts/login",
        { email, password }
      );

      if (res.data) {
        toast({
          title: "Login successfull",
          status: "info",
        });

        const _24Hours = new Date();
        _24Hours.setDate(_24Hours.getDate() + 1);
        localStorage.setItem(EXPIRY_KEY, _24Hours.getTime().toString());
        localStorage.setItem(TOKEN_KEY, res.data.accessToken);

        setUser(res.data.user);

        navigate("/workflows");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        status: "error",
      });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout: TAuthContext["logout"] = async () => {
    setLoading(false);
    setError(null);
    setUser(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);

    navigate("/");
  };

  const register: TAuthContext["register"] = async (
    email,
    firstname,
    lastname,
    password
  ) => {};

  const refresh: TAuthContext["refresh"] = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post<{ user: TUser; accessToken: string }>(
        "/api/accounts/refresh"
      );

      if (res.data) {
        setUser(res.data.user);

        const _24Hours = new Date();
        _24Hours.setDate(_24Hours.getDate() + 1);
        localStorage.setItem(EXPIRY_KEY, _24Hours.getTime().toString());
        localStorage.setItem(TOKEN_KEY, res.data.accessToken);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const expiry = localStorage.getItem(EXPIRY_KEY);

        const userActive = token && expiry && +expiry > new Date().getTime();

        if (!userActive) {
          refresh();
        } else {
          const res = await axios.get<TUser>("/api/accounts", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem(TOKEN_KEY),
            },
          });

          if (res.data) {
            setUser(res.data);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        error,
        loading,
        user,

        login,
        logout,
        register,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("Missing AuthContextProvider");
  }

  return context;
}

function IfSignedIn({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? children : null;
}

function IfSignedOut({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? null : children;
}

export const Auth = {
  IfSignedIn,
  IfSignedOut,
};
