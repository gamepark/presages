/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { CardDescription } from '@gamepark/react-game'
import MoonFront from '../images/team-marker/moon-front.jpg'
import MoonBack from '../images/team-marker/moon-back.jpg'
import DiamondFront from '../images/team-marker/diamand-front.jpg'
import DiamondBack from '../images/team-marker/diamand-back.jpg'
import StarFront from '../images/team-marker/star-front.jpg'
import StarBack from '../images/team-marker/star-back.jpg'
import Diamond from '../images/panel/diamond-panel.jpg'
import DiamondVictory from '../images/panel/diamond-victory-panel.jpg'
import Moon from '../images/panel/moon-panel.jpg'
import MoonVictory from '../images/panel/moon-victory-panel.jpg'
import Star from '../images/panel/star-panel.jpg'
import StarVictory from '../images/panel/star-victory-panel.jpg'

export class HelpDescription extends CardDescription {
  width = 7
  height = 12
  backImages = {
    1: MoonBack,
    2: DiamondBack,
    3: StarBack
  }

  images: Record<number, string> = {
    1: MoonFront,
    2: DiamondFront,
    3: StarFront
  }

  getItemExtraCss() {
    return css`
      display: none;
    `
  }

  getImages(): string[] {
    const images = super.getImages()
    images.push(Diamond)
    images.push(DiamondVictory)
    images.push(Moon)
    images.push(MoonVictory)
    images.push(Star)
    images.push(StarVictory)

    return images
  }
}

export const helpDescription = new HelpDescription()
