"use client"

import { useAuth } from "@/components/providers/AuthProvider"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/components/providers/UserProvider"
import { useRouter } from "next/navigation"

export default function Profile() {
  const { toast } = useToast()
  const router = useRouter()
  const auth = useAuth()

  const { user, setUser } = useUser()
  const [shopID, setShopID] = useState<string>(user.yookassa_settings.shop_id)
  const [shopKey, setShopKey] = useState<string>(
    user.yookassa_settings.shop_key,
  )

  const update = () => {
    const body = user
    body!.yookassa_settings!.shop_id = shopID!
    body!.yookassa_settings!.shop_key = shopKey!

    const headers = new Headers()
    headers.append("Authorization", `Bearer ${auth.jwtToken}`)

    const requestOptions = {
      headers: headers,
      method: "PUT",
      body: JSON.stringify(body),
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/profile`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          window.location.reload()
        } else {
          toast({
            title: data.message,
            variant: "destructive",
            duration: 2000,
          })
        }
      })
      .catch((err: Error) => {
        toast({
          title: err.message,
          variant: "destructive",
          duration: 2000,
        })
      })
  }

  useEffect(() => {
    setShopID(user.yookassa_settings.shop_id)
    setShopKey(user.yookassa_settings.shop_key)
  }, [user])

  return (
    <div className={"w-80"}>
      <Button
        className={"mb-6 w-full"}
        onClick={() => {
          router.push("/user/tickets")
        }}
      >
        tickets
      </Button>
      <Button
        className={"mb-6 w-full"}
        onClick={() => {
          router.push("/user/my-events")
        }}
      >
        events created by you
      </Button>
      <div>Your email: {user?.email}</div>
      <div className={"mt-2 flex w-full items-center"}>
        <div className={"w-4/12"}>Your telegram:</div>
        <div className={"ml-2 flex w-full"}>
          <Input
            value={user?.tg_username}
            onChange={(e) => {
              setUser({ ...user!, tg_username: e.target.value })
            }}
          />
        </div>
      </div>
      <div className={"mt-4"}>
        Yookassa settings:
        <div className={"mt-2 flex w-full"}>
          <p className={"w-4/12"}>shop id:</p>
          <Input
            className={"w-full"}
            value={shopID}
            onChange={(e) => {
              setShopID(e.target.value)
            }}
          />
        </div>
        <div className={"mt-2 flex w-full"}>
          <p className={"w-4/12"}>shop key:</p>
          <Input
            className={"w-full"}
            value={shopKey}
            onChange={(e) => {
              setShopKey(e.target.value)
            }}
          />
        </div>
      </div>
      <Button className={"mt-6 w-full"} onClick={update}>
        update
      </Button>
    </div>
  )
}
