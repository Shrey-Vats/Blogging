import type { signInType,  User } from "@/types/auth.types";
import {
  useState,
  createContext,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import API from "@/api/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (data: signInType) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const signIn = async (data: signInType) => {
    try {
      console.log(data)
      const response = await API.post(`/api/auth/sign-in`, data);

      console.log(response)

      if (!response.data.success) {
        throw new Error(response.data.message || "Sign in failed");
      }
      setUser(response.data.user);

      setToken(response.data.token);
      
      localStorage.setItem("token", response.data.token!)
      
      console.log(response.data.token)

      console.log(token)
      navigate("/");
      return;

    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error; 
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    localStorage.clear()
    navigate("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
