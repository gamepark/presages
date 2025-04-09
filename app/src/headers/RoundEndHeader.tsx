/** @jsxImportSource @emotion/react */
import { Memory } from '@gamepark/game-template/Memory'
import { PresagesRules } from '@gamepark/game-template/PresagesRules'
import { useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const RoundEndHeader = () => {
  const rule = useRules<PresagesRules>()!
  const roundWinner = rule.remind(Memory.RoundWinner)

  return (
    <Trans
      defaults="header.round.end" values={{ team: roundWinner }}
    />
  )
}
