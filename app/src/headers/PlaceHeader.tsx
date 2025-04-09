/** @jsxImportSource @emotion/react */
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const PlaceHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const activePlayer = rules.getActivePlayer()
  const itsMe = playerId && activePlayer === playerId
  const name = usePlayerName(activePlayer)
  
  if (itsMe) {
    return (
        <Trans defaults="header.place.me"/>
    )}
  
  return (
    <Trans defaults="header.place.player" values={{ player: name }}  />
  )
}
