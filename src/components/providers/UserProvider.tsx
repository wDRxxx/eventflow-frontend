"use client"

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  SetStateAction,
  Dispatch,
} from "react"
import { useAuth } from "./AuthProvider"
import { User } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { usePathname, useRouter } from "next/navigation"

type UserState = {
  user: User
  setUser: Dispatch<SetStateAction<User>>
}

const defaultUserState: UserState = {
  user: {
    email: "",
    yookassa_settings: {
      shop_id: "",
      shop_key: "",
    },
  },
  setUser: () => {},
}

const UserContext = createContext<UserState>(defaultUserState)

export default function UserProvider({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const auth = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<User>(defaultUserState.user)

  useEffect(() => {
    if (auth.jwtToken === "") {
      toast({
        title: "Login first!",
      })

      router.push("/")
      return
    }

    const headers = new Headers()
    headers.append("Authorization", `Bearer ${auth.jwtToken}`)

    const requestOptions = {
      headers: headers,
      method: "GET",
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/profile`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setUser(data)
      })
      .catch((err: Error) => {
        toast({
          title: err.message,
          variant: "destructive",
          duration: 2000,
        })
      })
    router.push(pathname)
  }, [auth, router, pathname])

  if (auth.jwtToken === "") return <></>
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
