import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { auth } from "@/lib/firebase/auth"
import { AppUser } from "@/types/user"

export type AuthContextType =
  | {
      isLoading: boolean
      user: null
    }
  | {
      isLoading: false
      user: AppUser
    }

export type AuthOperationContextType = {
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)
const AuthOperationContext = createContext<AuthOperationContextType | null>(null)

export type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authValue, setAuthValue] = useState<AuthContextType>({ isLoading: true, user: null })

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setAuthValue({
        isLoading: false,
        user:
          user == null
            ? null
            : {
                id: user.uid,
                name: user.displayName as string,
                iconUrl: user.photoURL as string,
              },
      })
    })
  }, [])

  const login = useCallback(async () => {
    await signInWithRedirect(auth, new GoogleAuthProvider())
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  useEffect(() => {
    getRedirectResult(auth)
  }, [])

  const authOperationValue = useMemo(() => ({ login, logout }), [login, logout])

  return (
    <AuthContext.Provider value={authValue}>
      <AuthOperationContext.Provider value={authOperationValue}>
        {children}
      </AuthOperationContext.Provider>
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context == null) {
    throw new Error("Unable to use useAuth outside of context provider.")
  }
  return context
}

export const useUser = () => {
  return useAuth().user
}

export const useIsLoggedIn = () => {
  return useAuth().user != null
}

export const useAuthOperation = () => {
  const context = useContext(AuthOperationContext)
  if (context == null) {
    throw new Error("Unable to use useAuthOperation outside of context provider.")
  }
  return context
}
