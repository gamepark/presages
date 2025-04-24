/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Color } from '@gamepark/presages/material/Color'
import { Picture } from '@gamepark/react-game'
import Blue from '../images/icons/blue.png'
import Book from '../images/icons/book.png'
import Green from '../images/icons/green.png'
import Hourglass from '../images/icons/hourglass.png'
import Important from '../images/icons/important.png'
import Lightning from '../images/icons/lightning.png'
import Red from '../images/icons/red.png'
import Yellow from '../images/icons/yellow.png'
import { getHtmlColor } from './color'

const pictureCss = css`
  height: 1em;
  position: relative;
  top: 0.1em;
  picture,
  img {
    padding: 0;
    margin: 0;
    vertical-align: middle;
  }
`

const colorCss = (color: Color) => css`
  color: ${getHtmlColor(color)};
  font-weight: bold;
`

export const TransComponents: Record<string, any> = {
  bold: <strong />,
  u: <u />,
  greenColor: <span css={colorCss(Color.Green)}></span>,
  redColor: <span css={colorCss(Color.Red)}></span>,
  yellowColor: <span css={colorCss(Color.Yellow)}></span>,
  blueColor: <span css={colorCss(Color.Blue)}></span>,
  greenIcon: <Picture src={Green} css={pictureCss} />,
  yellowIcon: <Picture src={Yellow} css={pictureCss} />,
  redIcon: <Picture src={Red} css={pictureCss} />,
  blueIcon: <Picture src={Blue} css={pictureCss} />,
  lightning: <Picture src={Lightning} css={pictureCss} />,
  book: <Picture src={Book} css={pictureCss} />,
  important: <Picture src={Important} css={pictureCss} />,
  hourglass: <Picture src={Hourglass} css={pictureCss} />
}
