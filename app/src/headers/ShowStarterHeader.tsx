import { PlayerId } from '@gamepark/presages/PlayerId'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { PlayMoveButton, useLegalMove, usePlayerId, useRules } from '@gamepark/react-game'
import { isEndPlayerTurn } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'

export const ShowStarterHeader = () => {
  const playerId = usePlayerId<PlayerId>()
  const confirm = useLegalMove(isEndPlayerTurn)
  const rules = useRules<PresagesRules>()!
  const itsMe = playerId && rules.game.rule?.players?.includes(playerId)

  if (itsMe) {
    return (
      <Trans
        i18nKey="header.show-starter.me"
        components={{
          ...TransComponents,
          confirm: <PlayMoveButton move={confirm} auto={rules.game.tutorial?.step !== 3 ? 2 * rules.game.players.length : undefined} />
        }}
      />
    )
  }
  return <Trans i18nKey="header.show-starter.players" components={TransComponents} />
}
