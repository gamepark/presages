/** @jsxImportSource @emotion/react */
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { CustomMoveType } from '@gamepark/presages/rules/CustomMoveType'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'

export const TheLawHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const activePlayer = rules.getActivePlayer()
  const itsMe = playerId && activePlayer === playerId
  const name = usePlayerName(activePlayer)
  const minus15 = useLegalMove((move) => isCustomMoveType(CustomMoveType.TheLaw)(move) && move.data === -15)
  const plus15 = useLegalMove((move) => isCustomMoveType(CustomMoveType.TheLaw)(move) && move.data === 15)

  if (itsMe) {
    return (
      <Trans
        defaults="header.the-law.me"
        components={{
          ...TransComponents,
          'less': <PlayMoveButton move={minus15}/>,
          'more': <PlayMoveButton move={plus15}/>
        }}
      />
    )
  }
  return (
    <Trans
      defaults="header.the-law.player"
      components={TransComponents}
      values={{ player: name }}
    />
  )
}
