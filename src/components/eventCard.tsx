import { Event } from "@/types"
import Link from "next/link"

type EventCardProps = {
  className?: string
  event: Event
}

export default function EventCard(props: EventCardProps) {
  return (
    <Link
      className={props.className}
      href={`/events/${props.event.url_title}`}
      draggable={false}
    >
      <div className="backdrop-blu bg-white/ mt-8 h-[30vh]">
        <img
          className={"h-4/6 w-full object-cover"}
          src={`${process.env.NEXT_PUBLIC_BACKEND}/static/${props.event.preview_image}`}
        />
        <div>
          <h2 className={"text-2xl"}>{props.event.title}</h2>
          <p>{props.event.location}</p>
        </div>
      </div>
    </Link>
  )
}
