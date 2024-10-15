"use client"

import { parseJwt } from "@/lib/utils"
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

type AuthState = {
  jwtToken: string
  setJwtToken: Dispatch<SetStateAction<string>>
  tickInterval: any
  setTickInterval: Dispatch<SetStateAction<any>>
  toggleRefresh: (status: boolean) => void
  email: string
  role: string
}

const defaultAuth: AuthState = {
  jwtToken: "",
  setJwtToken: () => {},
  tickInterval: null,
  setTickInterval: () => {},
  toggleRefresh: () => {},
  email: "",
  role: "",
}

const AuthContext = createContext<AuthState>(defaultAuth)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [jwtToken, setJwtToken] = useState<string>(defaultAuth.jwtToken)
  const [email, setEmail] = useState<string>(defaultAuth.email)
  const [role, setRole] = useState<string>(defaultAuth.role)

  const [tickInterval, setTickInterval] = useState(defaultAuth.tickInterval)

  const refresh = async () => {
    const requestOptions: RequestInit = {
      method: "POST",
      credentials: "include",
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/auth/refresh`,
      requestOptions,
    )

    return res.json()
  }

  const toggleRefresh = useCallback(
    (status: boolean) => {
      if (status) {
        let i = setInterval(() => {
          refresh()
            .then((data: any) => {
              if (data.message) {
                setJwtToken(data.message)
              }
            })
            .catch((err: Error) => {})
        }, 240000)

        setTickInterval(i)
      } else {
        setTickInterval(null)
        clearInterval(tickInterval)
      }
    },
    [tickInterval],
  )

  useEffect(() => {
    if (jwtToken === "") {
      const isAuthed = localStorage.getItem("authorized")
      if (isAuthed === "true" || isAuthed === null) {
        refresh()
          .then((data: any) => {
            if (data.message) {
              setJwtToken(data.message)
              const jwtPayload = parseJwt(data.message)
              setEmail(jwtPayload.email)
              setRole(jwtPayload.role)

              toggleRefresh(true)
            }
          })
          .catch((err: Error) => {
            if (err.name === "SyntaxError") {
              localStorage.setItem("authorized", "false")
            }
          })
      }
    }
  }, [jwtToken, toggleRefresh])

  return (
    <AuthContext.Provider
      value={{
        jwtToken,
        setJwtToken,
        tickInterval,
        setTickInterval,
        toggleRefresh,
        email,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
