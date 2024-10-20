"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { validateEmail } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

export default function SignUp() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const { toast } = useToast()

  const router = useRouter()
  const pathname = usePathname()

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

  const onSubmit = () => {
    if (email === "") {
      callToast("Email is required", "destructive")

      return
    }

    if (!validateEmail(email)) {
      callToast("Wrong email format", "destructive")

      return
    }

    if (password === "") {
      callToast("Password is required", "destructive")

      return
    }

    const body = {
      email: email,
      password: password,
    }

    if (pathname == "/auth/login") {
      let requestOptions: RequestInit = {
        body: JSON.stringify(body),
        method: "POST",
        credentials: "include",
      }

      fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/login`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            callToast(data.message, "destructive")

            return
          }

          localStorage.setItem("authorized", "true")
          router.push("/")
          setTimeout(() => {
            window.location.reload()
          }, 100)
        })
        .catch((error: Error) => {
          callToast(`${error.message}... try again later`, "destructive")
        })
    } else if (pathname == "/auth/register") {
      let requestOptions = {
        body: JSON.stringify(body),
        method: "POST",
      }

      fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/register`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            callToast(data.message, "destructive")

            return
          }

          router.push("/")
          setTimeout(() => {
            window.location.reload()
          }, 100)
        })
        .catch((error: Error) => {
          callToast(`${error.message}... try again later`, "destructive")
        })
    }
  }

  return (
    <div className="flex-1 sm:w-screen md:mx-auto md:w-full md:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className={"w-full"} onClick={onSubmit}>
              {pathname === "/oauth/register" ? "Sign up" : "Log in"}
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid">
            <div className={"cursor-pointer"}>
              <a
                onClick={() => {
                  localStorage.removeItem("authorized")
                }}
                href={`${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CALLBACK}`}
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
              >
                <span className="sr-only">Sign up with Google</span>
                <svg
                  className="size-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
