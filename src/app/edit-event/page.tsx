"use client"

import { Input } from "@/components/ui/input"
import { Event } from "@/types"
import { ChangeEvent, useState } from "react"
import { DateTimePicker } from "@/components/ui/time-picker/DateTimePicker"
import MDEditor from "@uiw/react-md-editor"
import { Label } from "@/components/ui/label"

export default function CreateEvent() {
  const [event, setEvent] = useState<Event>({
    beginning_time: new Date(new Date().getTime()),
    capacity: 0,
    creator_id: 0,
    description: "",
    end_time: new Date(new Date().getTime()),
    id: 0,
    is_free: false,
    is_public: false,
    location: "",
    minimal_age: 0,
    preview_image: "",
    title: "",
    url_title: "",
    utc_offset: 0,
  })

  const [image, setImage] = useState<Blob>()

  const onChange = (e: ChangeEvent<any>) => {
    setEvent({ ...event, [e.target.title]: e.target.value })
  }

  return (
    <div
      className={"rounded bg-white/30 backdrop-blur md:h-[95vh] md:w-[95vw]"}
    >
      <form className={"m-3 h-full w-full"}>
        <div className={"w-full p-3 md:flex md:h-1/2"}>
          <div className={"h-full md:w-1/2"}>
            <div className={"mr-5 h-full bg-purple-200/30 backdrop-blur"}>
              <img
                src={image === undefined ? "" : URL.createObjectURL(image)}
                className={"h-full w-full object-cover"}
              />
              <div className={"absolute bottom-0 right-0"}>
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
          <div className={"h-full md:w-1/2"}>
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
            <div className={"px-2"}>
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
                {/*<div className={"ml-1"}>*/}
                {/*  <Input*/}
                {/*    className={"h-[84px] w-16"}*/}
                {/*    type={"number"}*/}
                {/*    placeholder={"UTC offset"}*/}
                {/*    title={"utc_offset"}*/}
                {/*    value={event.utc_offset}*/}
                {/*    onChange={onChange}*/}
                {/*  />*/}
                {/*</div>*/}
              </div>
              <div className={"mt-1 w-full"}>
                <Input
                  className={"w-full"}
                  title={"location"}
                  value={event.location}
                  onChange={onChange}
                  placeholder={"Event location"}
                />
                <div className={"mt-1 flex h-10"}>
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
          </div>
        </div>
        <div className={"md:h-1/2"}>
          <div className={"mb-3 text-2xl"}>Event description</div>
          <MDEditor
            className={"mr-6"}
            value={event.description}
            onChange={(value) => {
              setEvent({ ...event, description: value! })
            }}
          />
        </div>
      </form>
    </div>
  )
}
