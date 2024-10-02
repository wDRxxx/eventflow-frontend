"use client"

import { Input } from "@/components/ui/input"
import { Event, Price } from "@/types"
import { ChangeEvent, useEffect, useState } from "react"
import { DateTimePicker } from "@/components/ui/time-picker/DateTimePicker"
import MDEditor from "@uiw/react-md-editor"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useUser } from "@/components/providers/UserProvider"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { convertUTCDateToLocalDate } from "@/lib/utils"
import { useAuth } from "@/components/providers/AuthProvider"
import { toast, useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type EditEventPageProps = {
  params: {
    url_title: string
  }
}

export default function EditEvent(props: EditEventPageProps) {
  const { user } = useUser()
  const { jwtToken } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [event, setEvent] = useState<Event>({
    beginning_time: new Date(new Date().getTime()),
    capacity: 0,
    creator_id: 0,
    description: "",
    end_time: new Date(new Date().getTime()),
    is_free: true,
    is_public: true,
    location: "",
    minimal_age: 0,
    preview_image: "",
    title: "",
    url_title: "",
    prices: [],
  })

  const [image, setImage] = useState<Blob>()

  const onChange = (e: ChangeEvent<any>) => {
    setEvent({ ...event, [e.target.title]: e.target.value })
  }

  useEffect(() => {
    if (props.params.url_title !== "new") {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/events/${props.params.url_title}`,
      )
        .then((resp) => resp.json())
        .then((data) => {
          if (data.prices == null) {
            data.prices = []
          }
          for (let i = 0; i < data.prices?.length; i++) {
            data.prices[i].not_visible = false
          }
          data.beginning_time = new Date(Date.parse(data.beginning_time))
          data.end_time = new Date(Date.parse(data.end_time))
          setEvent(data)
        })
    }
  }, [])

  const createEvent = () => {
    if (event.is_free) {
      event.prices = []
    }

    event.utc_offset = -event.beginning_time.getTimezoneOffset()
    event.capacity = parseInt(String(event.capacity), 10)
    event.minimal_age = parseInt(String(event.minimal_age), 10)

    const formData = new FormData()
    formData.append("event", JSON.stringify(event))
    if (image != undefined) {
      formData.append(
        "image",
        image,
        `event-poster.${image.type.split("/")[1]}`,
      )
    }

    const headers = new Headers()
    headers.append("Authorization", `Bearer ${jwtToken}`)
    const requestOptions = {
      headers: headers,
      method: "POST",
      body: formData,
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/events`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: data.message,
            variant: "destructive",
          })

          return
        }

        toast({
          title: data.message,
          variant: "success",
        })

        router.push("/")
      })
      .catch((error: Error) => {
        toast({
          title: error.message,
          variant: "destructive",
        })
      })
  }

  const updateEvent = () => {
    if (event.is_free && event.prices !== undefined) {
      for (let i = 0; i < event.prices?.length; i++) {
        event.prices[i].price = -1
      }
    }
    //@ts-ignore
    for (let i = 0; i < event.prices?.length; i++) {
      //@ts-ignore
      delete event.prices[i].not_visible
    }

    event.utc_offset = -event.beginning_time.getTimezoneOffset()
    event.capacity = parseInt(String(event.capacity), 10)
    event.minimal_age = parseInt(String(event.minimal_age), 10)

    const formData = new FormData()
    formData.append("event", JSON.stringify(event))
    if (image != undefined) {
      formData.append(
        "image",
        image,
        `event-poster.${image.type.split("/")[1]}`,
      )
    }

    const headers = new Headers()
    headers.append("Authorization", `Bearer ${jwtToken}`)
    const requestOptions = {
      headers: headers,
      method: "PUT",
      body: formData,
    }

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/events/${props.params.url_title}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: data.message,
            variant: "destructive",
          })

          return
        }

        toast({
          title: data.message,
          variant: "success",
        })

        router.push("/")
      })
      .catch((error: Error) => {
        toast({
          title: error.message,
          variant: "destructive",
        })
      })
  }

  const submit = (e: any) => {
    e.preventDefault()

    if (props.params.url_title === "new") {
      createEvent()
      return
    }

    updateEvent()
  }

  const deleteEvent = () => {
    const headers = new Headers()
    headers.append("Authorization", `Bearer ${jwtToken}`)
    const requestOptions = {
      headers: headers,
      method: "DELETE",
    }

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/events/${props.params.url_title}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: data.message,
            variant: "destructive",
          })

          return
        }

        toast({
          title: data.message,
          variant: "success",
        })

        router.push("/")
      })
      .catch((error: Error) => {
        toast({
          title: error.message,
          variant: "destructive",
        })
      })
  }

  return (
    <div
      className={"rounded bg-white/30 backdrop-blur md:h-[95vh] md:w-[95vw]"}
    >
      <div className={"m-3 h-full w-full px-4"}>
        <div className={"w-full p-3 md:flex md:min-h-[50%]"}>
          <div className={"h-[40vh] md:w-1/2"}>
            <div className={"mr-5 h-full bg-purple-200/30 backdrop-blur"}>
              <img
                src={
                  props.params.url_title !== "new"
                    ? image !== undefined
                      ? URL.createObjectURL(image)
                      : `${process.env.NEXT_PUBLIC_BACKEND}/static/${event.preview_image}`
                    : image !== undefined
                      ? URL.createObjectURL(image)
                      : ""
                }
                className={"h-full w-full object-cover"}
              />
              <div className={"absolute bottom-0 right-0 cursor-pointer"}>
                <Input
                  className={"w-32 cursor-pointer"}
                  accept="image/png, image/jpeg, image/webp"
                  multiple={false}
                  type={"file"}
                  onChange={(event) => {
                    const fileList = event.target.files
                    // @ts-ignore
                    const files: File[] = Array.from(fileList)
                    setImage(files[0])
                  }}
                />
              </div>
            </div>
          </div>
          <div className={"relative h-full md:w-1/2"}>
            <div>
              <Input
                className={
                  "placeholder h-16 w-full !border-b border-none bg-transparent shadow-none focus:!ring-0 sm:text-4xl"
                }
                placeholder={"Event title"}
                value={event.title}
                onChange={onChange}
                title={"title"}
              />
            </div>
            <div>
              <div className={"h-full w-full md:flex"}>
                <div className={"flex w-full"}>
                  <div className={"w-1/2"}>
                    <DateTimePicker
                      className={"w-full"}
                      date={event.beginning_time}
                      setDate={(date) => {
                        setEvent({ ...event, beginning_time: date })
                      }}
                    />
                  </div>
                  <div className={"ml-1 w-1/2"}>
                    <DateTimePicker
                      className={"w-full"}
                      date={event.end_time}
                      setDate={(date) => {
                        setEvent({ ...event, end_time: date })
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className={"mt-2 w-full"}>
                <Input
                  className={"w-full"}
                  title={"location"}
                  value={event.location}
                  onChange={onChange}
                  placeholder={"Event location"}
                />
                <div className={"mt-2 flex h-10"}>
                  <Label className={"h-10 align-text-bottom text-sm"}>
                    Event capacity
                  </Label>
                  <Input
                    id={"capacity"}
                    className={"w-1/2"}
                    title={"capacity"}
                    value={event.capacity}
                    onChange={onChange}
                    placeholder={"Event capacity"}
                    type={"number"}
                  />
                  <Label className={"ml-4 mr-3 h-10 align-text-bottom text-sm"}>
                    Minimal <br /> age
                  </Label>
                  <Input
                    className={"ml-1 w-1/2"}
                    title={"minimal_age"}
                    value={event.minimal_age}
                    onChange={onChange}
                    placeholder={"Minimal age"}
                    type={"number"}
                  />
                </div>
              </div>
            </div>
            <div className={"mt-4"}>
              <h3 className={"text-2xl"}>Event prices</h3>
              <div className={""}>
                <p>
                  {user.yookassa_settings.shop_id === "" && (
                    <span className={"text-red-600"}>
                      Tickets are free, to be able to set prices for events,
                      connect yookassa in profile settings
                    </span>
                  )}
                </p>
                {user.yookassa_settings.shop_id !== "" && (
                  <div className="mt-2 flex h-12 items-center">
                    <div className={"flex h-12 w-9/12"}>
                      <p>Free</p>
                      <Switch
                        className={"ml-2"}
                        checked={event.is_free}
                        onCheckedChange={(checked) => {
                          setEvent({ ...event, is_free: checked })
                        }}
                      />
                      {!event.is_free && (
                        <div>
                          <Button
                            className={"ml-2"}
                            onClick={() => {
                              if (event.prices === undefined) event.prices = []
                              setEvent({
                                ...event,
                                prices: [
                                  {
                                    id:
                                      event.prices!.length > 0
                                        ? event.prices![
                                            event.prices!.length - 1
                                          ]!.id! + event.prices!.length
                                        : 0,
                                    price: 0,
                                    currency: "USD",
                                  },
                                  ...event.prices!,
                                ],
                              })
                            }}
                          >
                            add price
                          </Button>
                          <Button
                            onClick={() => {
                              setEvent({
                                ...event,
                                prices: [],
                              })
                            }}
                            className="ml-2 bg-red-500 hover:bg-red-400"
                          >
                            delete all
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className={"flex"}>
                      <p>Public</p>
                      <Switch
                        className={"ml-2"}
                        checked={event.is_public}
                        onCheckedChange={(checked) => {
                          setEvent({ ...event, is_public: checked })
                        }}
                      />
                    </div>
                  </div>
                )}
                {!event.is_free && (
                  <Accordion
                    collapsible={true}
                    type={"single"}
                    className="w-full pb-2"
                  >
                    {event.prices?.map(
                      (price: Price, i: number) =>
                        (!price.not_visible ||
                          props.params.url_title === "new") && (
                          <AccordionItem value={`price-${i}`} key={price.id}>
                            <AccordionTrigger className="h-10 w-full">
                              {price.price} {price.currency}
                            </AccordionTrigger>
                            <AccordionContent className={"px-2 py-4"}>
                              <Input
                                type="number"
                                value={event.prices![i].price}
                                onChange={(e) => {
                                  let value = parseInt(e.target.value)

                                  const prices = event.prices
                                  prices![i].price = value

                                  setEvent({ ...event, prices: [...prices!] })
                                }}
                              />
                              <Input
                                className={"mt-2"}
                                type="text"
                                maxLength={3}
                                value={event.prices![i].currency}
                                onChange={(e) => {
                                  const prices = event.prices
                                  prices![i].currency = e.target.value

                                  setEvent({ ...event, prices: [...prices!] })
                                }}
                              />
                              <Button
                                onClick={() => {
                                  if (props.params.url_title === "new") {
                                    const prices = event.prices!
                                    prices.splice(i, 1)

                                    setEvent({
                                      ...event,
                                      prices: prices,
                                    })
                                  } else {
                                    // @ts-ignore
                                    event!.prices[i].price = -1
                                    // @ts-ignore
                                    event!.prices[i].not_visible = true
                                  }
                                }}
                                color="red"
                                className="mt-2"
                              >
                                delete
                                {props.params.url_title !== "new" && (
                                  <span>
                                    (will be deleted, may be visual bug)
                                  </span>
                                )}
                              </Button>
                            </AccordionContent>
                          </AccordionItem>
                        ),
                    )}
                  </Accordion>
                )}
              </div>
            </div>
            {props.params.url_title !== "new" && (
              <Button
                className={"mt-10 w-full bg-red-600 hover:bg-red-500"}
                onClick={deleteEvent}
              >
                delete event
              </Button>
            )}
          </div>
        </div>
        <div className={"md:h-1/2"}>
          <div className={"mb-3 text-2xl"}>Event description</div>
          <MDEditor
            className={"mr-6 selection:!text-white"}
            value={event.description}
            onChange={(value) => {
              setEvent({ ...event, description: value! })
            }}
          />
          <Button className={"mt-10 w-full"} onClick={submit}>
            {props.params.url_title === "new" ? "create event" : "update event"}
          </Button>
        </div>
      </div>
      <pre>{JSON.stringify(event, null, 2)}</pre>
    </div>
  )
}
