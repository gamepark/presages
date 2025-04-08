import { getEnumValues } from '@gamepark/rules-api'
import { Color } from './Color'

export enum ArcaneCard {
  TheLife = 1,
  TheLove,
  TheFriendship,
  TheCalm,
  TheFeast,
  TheHope,
  TheSpring,
  TheDeath,
  TheLie,
  TheEnigma,
  TheSummer,
  TheFear,
  TheLuck,
  TheMirror,
  TheLaw,
  TheTruth,
  TheMischief,
  TheDay,
  TheAutumn,
  TheHarmony,
  TheDream,
  ThePride,
  TheJalousie,
  TheSecret,
  TheNight,
  TheSadness,
  TheWinter,
  TheAnger,
  TheBetrayal,
  TheAbsolute30,
  TheAbsolute31,
  TheAbsolute32,
  TheAbsolute33,
  TheAbsolute34,
  TheAbsolute35   ,
}

export const arcanes = getEnumValues(ArcaneCard)

export const absolutes = arcanes.filter((a) => a >= 30)

export const getColors = (card: ArcaneCard) => {
  if (card <= 8) return [Color.Green]
  if (card <= 16) return [Color.Yellow]
  if (card === 17) return [Color.Green, Color.Yellow, Color.Red, Color.Blue]
  if (card <= 25) return [Color.Red]
  if (card <= 35) return [Color.Blue]
  return []
}

export const hasColor = (card: ArcaneCard, color: Color) => getColors(card).includes(color)