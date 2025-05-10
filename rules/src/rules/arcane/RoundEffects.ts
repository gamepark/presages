import { MaterialGame } from '@gamepark/rules-api'
import { ArcaneCard } from '../../material/ArcaneCard'
import { ArcaneEffect } from './ArcaneEffect'
import { TheAbsoluteDescription } from './description/TheAbsoluteDescription'
import { TheAngerDescription } from './description/TheAngerDescription'
import { TheAutumnDescription } from './description/TheAutumnDescription'
import { TheBetrayalDescription } from './description/TheBetrayalDescription'
import { TheCalmDescription } from './description/TheCalmDescription'
import { TheDayDescription } from './description/TheDayDescription'
import { TheDeathDescription } from './description/TheDeathDescription'
import { TheDreamDescription } from './description/TheDreamDescription'
import { TheEnigmaDescription } from './description/TheEnigmaDescription'
import { TheFearDescription } from './description/TheFearDescription'
import { TheFeastDescription } from './description/TheFeastDescription'
import { TheFriendshipDescription } from './description/TheFriendshipDescription'
import { TheHarmonyDescription } from './description/TheHarmonyDescription'
import { TheHopeDescription } from './description/TheHopeDescription'
import { TheJalousieDescription } from './description/TheJalousieDescription'
import { TheLawDescription } from './description/TheLawDescription'
import { TheLieDescription } from './description/TheLieDescription'
import { TheLifeDescription } from './description/TheLifeDescription'
import { TheLoveDescription } from './description/TheLoveDescription'
import { TheLuckDescription } from './description/TheLuckDescription'
import { TheMirrorDescription } from './description/TheMirrorDescription'
import { TheMischiefDescription } from './description/TheMischiefDescription'
import { TheNightDescription } from './description/TheNightDescription'
import { ThePrideDescription } from './description/ThePrideDescription'
import { TheSadnessDescription } from './description/TheSadnessDescription'
import { TheSecretDescription } from './description/TheSecretDescription'
import { TheSpringDescription } from './description/TheSpringDescription'
import { TheSummerDescription } from './description/TheSummerDescription'
import { TheTruthDescription } from './description/TheTruthDescription'
import { TheWinterDescription } from './description/TheWinterDescription'

type ArcaneEffectCreator = new (game: MaterialGame) => ArcaneEffect
export const RoundEffects: Record<ArcaneCard, ArcaneEffectCreator> = {
  [ArcaneCard.TheLife]: TheLifeDescription,
  [ArcaneCard.TheLove]: TheLoveDescription,
  [ArcaneCard.TheFriendship]: TheFriendshipDescription,
  [ArcaneCard.TheCalm]: TheCalmDescription,
  [ArcaneCard.TheFeast]: TheFeastDescription,
  [ArcaneCard.TheHope]: TheHopeDescription,
  [ArcaneCard.TheSpring]: TheSpringDescription,
  [ArcaneCard.TheDeath]: TheDeathDescription,
  [ArcaneCard.TheLie]: TheLieDescription,
  [ArcaneCard.TheEnigma]: TheEnigmaDescription,
  [ArcaneCard.TheSummer]: TheSummerDescription,
  [ArcaneCard.TheFear]: TheFearDescription,
  [ArcaneCard.TheLuck]: TheLuckDescription,
  [ArcaneCard.TheMirror]: TheMirrorDescription,
  [ArcaneCard.TheLaw]: TheLawDescription,
  [ArcaneCard.TheTruth]: TheTruthDescription,
  [ArcaneCard.TheMischief]: TheMischiefDescription,
  [ArcaneCard.TheDay]: TheDayDescription,
  [ArcaneCard.TheAutumn]: TheAutumnDescription,
  [ArcaneCard.TheHarmony]: TheHarmonyDescription,
  [ArcaneCard.TheDream]: TheDreamDescription,
  [ArcaneCard.ThePride]: ThePrideDescription,
  [ArcaneCard.TheJalousie]: TheJalousieDescription,
  [ArcaneCard.TheSecret]: TheSecretDescription,
  [ArcaneCard.TheNight]: TheNightDescription,
  [ArcaneCard.TheSadness]: TheSadnessDescription,
  [ArcaneCard.TheWinter]: TheWinterDescription,
  [ArcaneCard.TheAnger]: TheAngerDescription,
  [ArcaneCard.TheBetrayal]: TheBetrayalDescription,
  [ArcaneCard.TheAbsolute30]: TheAbsoluteDescription,
  [ArcaneCard.TheAbsolute31]: TheAbsoluteDescription,
  [ArcaneCard.TheAbsolute32]: TheAbsoluteDescription,
  [ArcaneCard.TheAbsolute33]: TheAbsoluteDescription,
  [ArcaneCard.TheAbsolute34]: TheAbsoluteDescription,
  [ArcaneCard.TheAbsolute35]: TheAbsoluteDescription
}
