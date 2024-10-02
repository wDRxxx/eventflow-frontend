export type Event = {
  id?: number
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
  utc_offset?: number
  minimal_age: number
  prices?: Array<Price>
}

export type Price = {
  id?: number
  price: number
  currency: string

  not_visible?: boolean
}

export type User = {
  email: string
  tg_username?: string
  yookassa_settings: YookassaSettings
}

type YookassaSettings = {
  shop_id: string
  shop_key: string
}

export type Ticket = {
  id?: string
  is_used: boolean
  first_name: string
  last_name: string
  event?: Event
}
