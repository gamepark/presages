/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Memory } from '@gamepark/presages/Memory'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { Picture, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'
import { helpDescription } from '../material/HelpDescription'
import { TransComponents } from '../utils/trans.components'

export const RoundEndHeader = () => {
  const rule = useRules<PresagesRules>()!
  const roundWinner = rule.remind(Memory.RoundWinner)
  const team = rule.remind<number>(Memory.Team, roundWinner)
  const image = helpDescription.images[team]
  const name = usePlayerName(roundWinner)
  return (
    <Trans
      defaults="header.round.end"
      values={{ player: name}}
      components={{
        ...TransComponents,
        'team': <Picture src={image} css={iconCss} />
    }}
    />
  )
}




export const iconCss = css`
  height: 1em;
  position: relative;
  border-radius: 0.2em;
  top: 0.1em;
  
  img, picture {
    vertical-align: center;
  }
`
