/** @jsxImportSource @emotion/react */
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerId, useRules, usePlayerName } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const TheSecretChoiceHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const activePlayer = rules.getActivePlayer()
  const itsMe = playerId && activePlayer === playerId
  const name = usePlayerName(activePlayer)

  if (itsMe) {
    return (
        <Trans defaults="header.the-secret-choice.me"/>
    )
  }
  return (
    <Trans
      defaults="header.the-secret-choice.player" values={{ player: name }}
    />
  )
}
