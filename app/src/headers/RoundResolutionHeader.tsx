/** @jsxImportSource @emotion/react */
import { Memory } from '@gamepark/presages/Memory'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const RoundResolutionHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const winner = rules.remind(Memory.TrickWinner)
  const itsMe = playerId && winner === playerId
  const name = usePlayerName(winner)
  
  if (itsMe) {
    return (
        <Trans defaults="header.round-resolution.me"/>
    )}
  
  return (
    <Trans defaults="header.round-resolution.player" values={{ player: name }}  />
  )
}
