import { State } from "@/store/models/job"
import { BingoAction } from 'simsalabim-design'

export type ActionsForState = {
  [key in State]: BingoAction[] | null
}

export interface JobCardProps {
  elevated?: boolean
  description?: string
  personNote?: {
    pictureUrl?: URL,
    text: string,
  }
}