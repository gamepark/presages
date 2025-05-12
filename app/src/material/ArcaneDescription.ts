import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { CardDescription, MaterialContext } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import Back from '../images/arcane/back.jpg'
import TheAbsolute30 from '../images/arcane/the-absolute-30.jpg'
import TheAbsolute31 from '../images/arcane/the-absolute-31.jpg'
import TheAbsolute32 from '../images/arcane/the-absolute-32.jpg'
import TheAbsolute33 from '../images/arcane/the-absolute-33.jpg'
import TheAbsolute34 from '../images/arcane/the-absolute-34.jpg'
import TheAbsolute35 from '../images/arcane/the-absolute-35.jpg'
import TheAnger from '../images/arcane/the-anger.jpg'
import TheAutumn from '../images/arcane/the-autumn.jpg'
import TheBetrayal from '../images/arcane/the-betrayal.jpg'
import TheCalm from '../images/arcane/the-calm.jpg'
import TheDay from '../images/arcane/the-day.jpg'
import TheDeath from '../images/arcane/the-death.jpg'
import TheDream from '../images/arcane/the-dream.jpg'
import TheEnigma from '../images/arcane/the-enigma.jpg'
import TheFear from '../images/arcane/the-fear.jpg'
import TheFeast from '../images/arcane/the-feast.jpg'
import TheFriendship from '../images/arcane/the-friendship.jpg'
import TheHarmony from '../images/arcane/the-harmony.jpg'
import TheHope from '../images/arcane/the-hope.jpg'
import TheJalousie from '../images/arcane/the-jalousie.jpg'
import TheLaw from '../images/arcane/the-law.jpg'
import TheLie from '../images/arcane/the-lie.jpg'
import TheLife from '../images/arcane/the-life.jpg'
import TheLove from '../images/arcane/the-love.jpg'
import TheLuck from '../images/arcane/the-luck.jpg'
import TheMirror from '../images/arcane/the-mirror.jpg'
import TheMischief from '../images/arcane/the-mischief.jpg'
import TheNight from '../images/arcane/the-night.jpg'
import ThePride from '../images/arcane/the-pride.jpg'
import TheSadness from '../images/arcane/the-sadness.jpg'
import TheSecret from '../images/arcane/the-secret.jpg'
import TheSpring from '../images/arcane/the-spring.jpg'
import TheSummer from '../images/arcane/the-summer.jpg'
import TheTruth from '../images/arcane/the-truth.jpg'
import TheWinter from '../images/arcane/the-winter.jpg'
import Blue from '../images/icons/blue.png'
import Book from '../images/icons/book.png'
import Green from '../images/icons/green.png'
import Help from '../images/icons/help.jpg'
import Hourglass from '../images/icons/hourglass.png'
import Important from '../images/icons/important.png'
import Lightning from '../images/icons/lightning.png'
import Red from '../images/icons/red.png'
import Yellow from '../images/icons/yellow.png'
import Moon from '../images/icons/moon.jpg'
import Star from '../images/icons/star.jpg'
import { ArcaneHelp } from './help/ArcaneHelp'

export class ArcaneDescription extends CardDescription {
  width = 7
  height = 12
  backImage = Back

  images = {
    [ArcaneCard.TheLife]: TheLife,
    [ArcaneCard.TheLove]: TheLove,
    [ArcaneCard.TheFriendship]: TheFriendship,
    [ArcaneCard.TheCalm]: TheCalm,
    [ArcaneCard.TheFeast]: TheFeast,
    [ArcaneCard.TheHope]: TheHope,
    [ArcaneCard.TheSpring]: TheSpring,
    [ArcaneCard.TheDeath]: TheDeath,
    [ArcaneCard.TheLie]: TheLie,
    [ArcaneCard.TheEnigma]: TheEnigma,
    [ArcaneCard.TheSummer]: TheSummer,
    [ArcaneCard.TheFear]: TheFear,
    [ArcaneCard.TheLuck]: TheLuck,
    [ArcaneCard.TheMirror]: TheMirror,
    [ArcaneCard.TheLaw]: TheLaw,
    [ArcaneCard.TheTruth]: TheTruth,
    [ArcaneCard.TheMischief]: TheMischief,
    [ArcaneCard.TheDay]: TheDay,
    [ArcaneCard.TheAutumn]: TheAutumn,
    [ArcaneCard.TheHarmony]: TheHarmony,
    [ArcaneCard.TheDream]: TheDream,
    [ArcaneCard.ThePride]: ThePride,
    [ArcaneCard.TheJalousie]: TheJalousie,
    [ArcaneCard.TheSecret]: TheSecret,
    [ArcaneCard.TheNight]: TheNight,
    [ArcaneCard.TheSadness]: TheSadness,
    [ArcaneCard.TheWinter]: TheWinter,
    [ArcaneCard.TheAnger]: TheAnger,
    [ArcaneCard.TheBetrayal]: TheBetrayal,
    [ArcaneCard.TheAbsolute30]: TheAbsolute30,
    [ArcaneCard.TheAbsolute31]: TheAbsolute31,
    [ArcaneCard.TheAbsolute32]: TheAbsolute32,
    [ArcaneCard.TheAbsolute33]: TheAbsolute33,
    [ArcaneCard.TheAbsolute34]: TheAbsolute34,
    [ArcaneCard.TheAbsolute35]: TheAbsolute35
  }

  getImages() {
    const images = super.getImages()
    images.push(Green)
    images.push(Red)
    images.push(Yellow)
    images.push(Blue)
    images.push(Lightning)
    images.push(Book)
    images.push(Important)
    images.push(Hourglass)
    images.push(Help)
    images.push(Star)
    images.push(Moon)

    return images
  }

  isFlippedOnTable(item: Partial<MaterialItem>, context: MaterialContext): boolean {
    if (item.location?.type === LocationType.Deck) return true
    return super.isFlippedOnTable(item, context)
  }

  help = ArcaneHelp
}

export const arcaneDescription = new ArcaneDescription()
