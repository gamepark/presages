/** @jsxImportSource @emotion/react */
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerId, useRules, usePlayerName } from '@gamepark/react-game'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'

export const TheBetrayalHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const activePlayer = rules.getActivePlayer()
  const itsMe = playerId && activePlayer === playerId
  const name = usePlayerName(activePlayer)

  if (itsMe) {
    return <Trans defaults="header.the-betrayal.me" components={TransComponents} />
  }
  return <Trans defaults="header.the-betrayal.player" values={{ player: name }} components={TransComponents} />
}
