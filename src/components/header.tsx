"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function Header() {
  const router = useRouter()
  const auth = useAuth()
  const { toast } = useToast()

  const callToast = (
    message: string,
    variant?: "default" | "destructive" | "success" | null | undefined,
  ) => {
    toast({
      title: message,
      variant: variant,
      duration: 2000,
    })
  }

  const logout = () => {
    let requestOptions: RequestInit = {
      method: "POST",
      credentials: "include",
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/logout`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          callToast(data.message, "destructive")

          return
        }

        callToast("You was successfully logged out!", "success")

        localStorage.setItem("authorized", "false")
        router.push("/")
        auth.setJwtToken("")
        setTimeout(() => {
          window.location.reload()
        }, 100)
      })
      .catch((error: Error) => {
        router.push("/")
        auth.setJwtToken("")
        setTimeout(() => {
          window.location.reload()
        }, 100)
      })
  }

  return (
    <header
      className={
        "backdrop-blu sticky flex h-16 w-full justify-center bg-white/30"
      }
    >
      <div
        className={"flex w-full max-w-screen-xl items-center justify-between"}
      >
        <h1
          className={"cursor-pointer text-4xl font-bold leading-tight"}
          onClick={() => router.push("/")}
        >
          EventFlow
        </h1>
        <div>
          {auth.jwtToken === "" ? (
            <div>
              <Link className={"mr-2"} href={"/auth/login"}>
                <Button>login</Button>
              </Link>
              <Link href={"/auth/register"}>
                <Button>signup</Button>
              </Link>
            </div>
          ) : (
            <div>
              <Link href={"/user/profile"} className={"mr-2"}>
                <Button>profile</Button>
              </Link>
              <Button onClick={logout}>logout</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
