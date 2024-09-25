"use client"

import * as React from "react"
import { add, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TimePickerDemo } from "./time-picker-demo"

type DateTimePickerProps = {
  date: Date
  setDate: (arg: any) => void
  className?: string
}

export function DateTimePicker(props: DateTimePickerProps) {
  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return
    if (!props.date) {
      props.setDate(newDay)
      return
    }

    const diff = newDay.getTime() - props.date.getTime()
    const diffInDays = diff / (1000 * 60 * 60 * 24)
    const newDateFull = add(props.date, { days: Math.ceil(diffInDays) })

    props.setDate(newDateFull)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !props.date && "text-muted-foreground",
            props.className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.date ? (
            format(props.date, "PPP HH:mm")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={props.date}
          onSelect={(d) => handleSelect(d)}
          initialFocus
        />
        <div className="border-t border-border p-3">
          <TimePickerDemo setDate={props.setDate} date={props.date} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
