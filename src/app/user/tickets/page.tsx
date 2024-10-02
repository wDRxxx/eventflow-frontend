"use client"

import { useAuth } from "@/components/providers/AuthProvider"
import { useEffect, useState } from "react"
import { Ticket } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { convertUTCDateToLocalDate } from "@/lib/utils"

export default function UserTickets() {
  const { jwtToken } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>()
  const { toast } = useToast()

  useEffect(() => {
    const headers = new Headers()
    headers.append("Authorization", `Bearer ${jwtToken}`)

    const requestOptions = {
      headers: headers,
      method: "GET",
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/tickets`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setTickets(data)
      })
      .catch((err: Error) => {
        toast({
          title: err.message,
          variant: "destructive",
          duration: 2000,
        })
      })
  }, [jwtToken])

  return (
    <div>
      <div className={"mb-20 mt-20"}>
        {tickets?.map((ticket) => {
          return (
            <div key={ticket.id} className={"h-32"}>
              <div>{ticket.id}</div>
              <div>
                {ticket.event?.title} -{" "}
                {
                  <span>
                    {convertUTCDateToLocalDate(
                      // @ts-ignore
                      new Date(Date.parse(ticket.event?.beginning_time)),
                    ).toLocaleString()}
                  </span>
                }
              </div>
              <img
                className={"h-10 object-cover"}
                src={`${process.env.NEXT_PUBLIC_BACKEND}/static/${ticket.event?.preview_image}`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
