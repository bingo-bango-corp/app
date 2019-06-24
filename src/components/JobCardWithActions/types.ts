import { State } from "@/store/models/job"
import { BingoAction } from 'simsalabim-design'

export type ActionsForState = {
  [key in State]: BingoAction[] | null
}
