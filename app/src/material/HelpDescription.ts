/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { CardDescription } from '@gamepark/react-game'
import MoonFront from '../images/team-marker/moon-front.jpg'
import MoonBack from '../images/team-marker/moon-back.jpg'
import DiamondFront from '../images/team-marker/diamand-front.jpg'
import DiamondBack from '../images/team-marker/diamand-back.jpg'
import StarFront from '../images/team-marker/star-front.jpg'
import StarBack from '../images/team-marker/star-back.jpg'

export class HelpDescription extends CardDescription {
  width = 7
  height = 12
  backImages = {
    1: MoonBack,
    2: DiamondBack,
    3: StarBack,
  }

  images = {
    1: MoonFront,
    2: DiamondFront,
    3: StarFront,
  }

  getItemExtraCss() {
    return css`
      display: none;
    `
  }
}

export const helpDescription = new HelpDescription()