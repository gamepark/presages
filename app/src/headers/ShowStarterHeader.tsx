/** @jsxImportSource @emotion/react */
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { PlayMoveButton, useLegalMove, usePlayerId, useRules } from '@gamepark/react-game'
import { isEndPlayerTurn } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'

export const ShowStarterHeader = () => {
  const playerId = usePlayerId()
  const confirm = useLegalMove(isEndPlayerTurn)
  const rules = useRules<PresagesRules>()!
  const itsMe = playerId && rules.isTurnToPlay(playerId)

  if (itsMe) {
    return (
      <Trans
        defaults="header.show-starter.me"
        components={{
          ...TransComponents,
          'confirm': <PlayMoveButton move={confirm} auto={2 * rules.game.players.length}/>
        }}
      />
    )
  }
  return (
    <Trans
      defaults="header.show-starter.players"
      components={TransComponents}
    />
  )
}
