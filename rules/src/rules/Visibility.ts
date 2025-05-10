import { MaterialItem } from '@gamepark/rules-api'
import { PlayerId } from '../PlayerId'

export enum Visibility {
  VISIBLE_FOR_ME = 0,
  HIDDEN_FOR_EVERYONE,
  VISIBLE_FOR_EVERYONE,
  TEMPORARY_VISIBLE_FOR_ME
}

export const isVisibleForMe = (item: MaterialItem, player?: PlayerId) =>
  item.location.player === player && (item.location.rotation === Visibility.VISIBLE_FOR_ME || item.location.rotation === Visibility.TEMPORARY_VISIBLE_FOR_ME)
