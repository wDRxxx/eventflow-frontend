export type Event = {
  id: number
  title: string
  url_title?: string
  capacity: number
  description: string
  beginning_time: Date
  end_time: Date
  creator_id?: number
  is_public: boolean
  location: string
  is_free: boolean
  preview_image?: string
  utc_offset: number
  minimal_age: number
}
