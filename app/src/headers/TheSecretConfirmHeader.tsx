/** @jsxImportSource @emotion/react */
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { CustomMoveType } from '@gamepark/presages/rules/CustomMoveType'
import { PlayMoveButton, useLegalMove, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'

export const TheSecretConfirmHeader = () => {
  const playerId = usePlayerId()
  const confirm = useLegalMove(isCustomMoveType(CustomMoveType.Confirm))
  const rules = useRules<PresagesRules>()!
  const activePlayer = rules.getActivePlayer()
  const itsMe = playerId && activePlayer === playerId
  const name = usePlayerName(activePlayer)

  if (itsMe) {
    return (
      <Trans
        defaults="header.the-secret-confirm.me"
        components={{
          ...TransComponents,
          'confirm': <PlayMoveButton move={confirm} auto={10}/>
        }}
      />
    )
  }

  return (
    <Trans
      defaults="header.the-secret-confirm.player"
      values={{ player: name }}
      components={{
        ...TransComponents
      }}
    />
  )
}
