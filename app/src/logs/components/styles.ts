/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Color } from '@gamepark/presages/material/Color'
import { getBackgroundImage } from '../../panels/PresagesPlayerPanel'
import { getHtmlColor } from '../../utils/color'

export const pictureCss = css`
  height: 4em;
`

export const logCss = (team: number, rotated: boolean) => css`
  ${simpleLogCss};
  background: url(${getBackgroundImage(team, rotated)}) #1c2242 no-repeat;
  background-size: auto 90%;
  background-position: center right -5em;
`

export const simpleLogCss = css`
  > div:last-of-type {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100% !important;
  }

  background-color: #1c2242;
  width: 99.5%;
  padding: 0.5em;
  border-radius: 0.7em;
`

export const spaceBeforeLogCss = css`
  ${simpleLogCss};
  margin-top: 2em;
  border-radius: 0.7em;
`

export const coloredLogCss = (color: Color) => css`
  ${simpleLogCss};
  ${borderedCss(color)};
  background-color: white; //#1c224220;
  color: black;
`

export const borderedCss = (color: Color) => css`
  border: 0.2em solid ${getHtmlColor(color)};
  box-sizing: border-box;
`

export const underlineCss = css`
  text-decoration: underline;
`

export const centeredCss = css`
  text-align: center;
  width: 100%;
`

export const depthCss = css`
  padding-left: 0.8em;
  > div:first-of-type {
    margin-top: 0;
  }
`

export const greyCss = css`
  color: lightgray;
`

export const rainbowGradiant = `linear-gradient(90deg, rgba(77, 178, 119, 1) 0%, rgba(252, 190, 67, 1) 25%, rgba(192, 40, 68, 1) 50%, rgba(65, 174, 229, 1) 100%);`

export const allColorBorderedCss = css`
  ${simpleLogCss};
  border: 0.2em solid black;
  box-sizing: border-box;
  background-color: white; //#1c224220;
  color: black;
`
