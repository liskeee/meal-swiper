export interface Ingredient {
  name: string
  amount: string
  category: 'mięso' | 'warzywa' | 'nabiał' | 'suche'
}

export interface Meal {
  id: string
  nazwa: string
  opis: string
  photo_url: string
  prep_time: number
  kcal_baza: number
  kcal_z_miesem: number
  skladniki_baza: string
  skladniki_mieso: string
  tags: string[]
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri'

export type WeeklyPlan = {
  [K in DayKey]: Meal | null
} & {
  [K in `${DayKey}_free`]: boolean
}

export type ViewId = 'plan' | 'swipe' | 'shopping'

export interface Tab {
  id: ViewId
  label: string
  icon: string
}
