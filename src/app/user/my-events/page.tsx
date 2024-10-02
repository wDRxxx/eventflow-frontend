"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import EventCard from "@/components/eventCard"
import { Event } from "@/types"
import { useAuth } from "@/components/providers/AuthProvider"

export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>([])

  const { jwtToken } = useAuth()

  useEffect(() => {
    const headers = new Headers()
    headers.append("Authorization", `Bearer ${jwtToken}`)

    const requestOptions = {
      headers: headers,
      method: "GET",
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/events`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data === null || data.error) {
          return
        }

        // @ts-ignore
        setEvents([...events, ...data])
      })
  }, [])

  return (
    <div className="mt-10 min-h-screen w-full max-w-screen-xl">
      <Link href="/user/edit-event/new">
        <Button>Create new event</Button>
      </Link>
      <div className={"mt-4 h-full w-full"}>
        {events.length > 0 ? (
          events.map((event, i) => {
            return (
              <Link
                href={`/user/edit-event/${event.url_title}`}
                draggable={false}
                key={i}
              >
                <EventCard event={event} />
              </Link>
            )
          })
        ) : (
          <div>No events</div>
        )}
      </div>
    </div>
  )
}
