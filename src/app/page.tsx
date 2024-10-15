"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import EventCard from "@/components/eventCard"
import { Event } from "@/types"

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    }

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/events?page=${page}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((data) => {
        if (data === null) {
          return
        }

        // @ts-ignore
        setEvents([...events, ...data])
      })
  }, [])

  return (
    <div className="mt-5 min-h-screen w-full max-w-screen-xl px-5 md:mt-10 md:px-0">
      <Link href="/user/edit-event/new">
        <Button>Create your own event</Button>
      </Link>
      <div className={"h-full w-full md:mt-4"}>
        {events.length > 0 &&
          events.map((event, i) => {
            return (
              <Link
                href={`/events/${event.url_title}`}
                draggable={false}
                key={i}
              >
                <EventCard event={event} />
              </Link>
            )
          })}
      </div>
    </div>
  )
}
