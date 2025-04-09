/** @jsxImportSource @emotion/react */
import { PresagesRules } from '@gamepark/game-template/PresagesRules'
import { usePlayerId, useRules, usePlayerName } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const TheAbsoluteHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const activePlayer = rules.getActivePlayer()
  const itsMe = playerId && activePlayer === playerId
  const name = usePlayerName(activePlayer)

  if (itsMe) {
    return (
        <Trans defaults="header.the-absolute.me"/>
    )
  }
  return (
    <Trans
      defaults="header.the-absolute.player" values={{ player: name }}
    />
  )
}
