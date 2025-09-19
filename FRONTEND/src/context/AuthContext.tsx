import type { signInType, signUpType, User } from "@/types/auth.types";
import { useState, createContext, type ReactNode, useContext } from "react";

import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    signIn: (data: signInType) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [cookies] = useCookies(['token']);
  const [token, setToken] = useState<string | null>(cookies.token || null);

  const navigation = useNavigate();


  const signIn = async (data: signInType) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/sign-in', data);
      if(response.data.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        navigation('/');
        return;
      }

      throw new Error('Sign in failed');
    } catch (error) {
      console.error(error);
    }
  }

  const signOut = async () => {
    setUser(null);
    setToken(null);
    navigation('/sign-in');
  }

  return <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, signIn, signOut }}>
    {children}
  </AuthContext.Provider>

}
