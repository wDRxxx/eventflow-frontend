"use client"

import { useEffect, useState } from "react"
import { Event, Price } from "@/types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/AuthProvider"
import MDEditor from "@uiw/react-md-editor"
import { convertUTCDateToLocalDate } from "@/lib/utils"

type EventPageProps = {
  params: {
    url_title: string
  }
}

export default function EventPage(props: EventPageProps) {
  const { jwtToken } = useAuth()

  const [event, setEvent] = useState<Event>()
  const [price, setPrice] = useState<Price>()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const router = useRouter()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/events/${props.params.url_title}`)
      .then((resp) => resp.json())
      .then((data) => {
        data.beginning_time = convertUTCDateToLocalDate(
          new Date(Date.parse(data.beginning_time)),
        )
        data.end_time = convertUTCDateToLocalDate(
          new Date(Date.parse(data.end_time)),
        )
        setEvent(data)
        if (data.prices !== null) {
          setPrice(data.prices[0])
        }
      })
  }, [])

  const confirm = () => {
    const body = {
      event_url_title: props.params.url_title,
      first_name: firstName,
      last_name: lastName,
      price_id: price?.id,
    }

    const headers = new Headers()
    headers.append("Authorization", `Bearer ${jwtToken}`)

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(body),
      headers: headers,
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/tickets/`, requestOptions)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error) {
          return
        }

        if (!event?.is_free) {
          window.open(data.message, "_blank")
        }

        router.push("/user/tickets")
      })
  }

  return (
    <div className={"flex w-full justify-center p-20"}>
      <div className={"flex h-full w-full flex-col justify-center"}>
        <div className={"flex w-full"}>
          <img
            className={"w-1/2 object-cover"}
            src={`${process.env.NEXT_PUBLIC_BACKEND}/static/${event?.preview_image}`}
          />
          <div className={"ml-5 w-full"}>
            <h1 className={"text-4xl"}>{event?.title}</h1>
            <div className={"mt-2"}>
              {event?.beginning_time.toLocaleString()} -{" "}
              {event?.end_time.toLocaleString()}
            </div>
            <div>Minimal age: {event?.minimal_age}</div>
            {
              // @ts-ignore
              event?.capacity < 100 && (
                <div>Tickets left: {event?.capacity}</div>
              )
            }
            <div className={"flex w-full items-center"}>
              {
                // @ts-ignore
                event?.capacity > 0 &&
                  (event?.is_free ? (
                    <div>Free</div>
                  ) : (
                    <div className={"flex w-52 items-center"}>
                      <div className={"w-1/3 font-bold"}>{price?.price}</div>
                      <div className={"ml-2 w-2/3"}>
                        <Select
                          onValueChange={(val) => {
                            // @ts-ignore
                            setPrice(val)
                          }}
                        >
                          <SelectTrigger>{price?.currency}</SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {event?.prices?.map((p, i) => {
                                return (
                                  // @ts-ignore
                                  <SelectItem value={p} key={i}>
                                    {p.currency}
                                  </SelectItem>
                                )
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))
              }
              <Dialog>
                <DialogTrigger asChild={true}>
                  <Button className={"ml-5 w-1/3"}>Buy</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Buy a ticket</DialogTitle>
                    <DialogDescription>
                      You will be redirected to payment page
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="firstname" className="text-right">
                        First name
                      </Label>
                      <Input
                        id="firstname"
                        className="col-span-3"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value)
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="lastname" className="text-right">
                        Last name
                      </Label>
                      <Input
                        id="lastname"
                        className="col-span-3"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <div className={"flex w-full items-center justify-between"}>
                      <h1 className={"text-2xl"}>
                        Price:{" "}
                        {event?.is_free ? (
                          <span>Free</span>
                        ) : (
                          <span>{price?.price + " " + price?.currency}</span>
                        )}
                      </h1>
                      <Button onClick={confirm}>Confirm</Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className={"mt-2 w-full"}>
              <MDEditor.Markdown
                source={event?.description}
                className={"w-full whitespace-pre-wrap !bg-transparent"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
