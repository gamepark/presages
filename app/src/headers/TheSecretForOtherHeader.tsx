/** @jsxImportSource @emotion/react */
import { Memory } from '@gamepark/presages/Memory'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerId, useRules, usePlayerName } from '@gamepark/react-game'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'

export const TheSecretForOtherHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const activePlayer = rules.getActivePlayer()
  const effectPlayer = rules.remind(Memory.EffectPlayer)
  const itsMe = playerId && activePlayer === playerId
  const imTheEffectPlayer = playerId && effectPlayer === playerId
  const name = usePlayerName(activePlayer)
  const effectPlayerName = usePlayerName(effectPlayer)

  if (imTheEffectPlayer) {
    return (
      <Trans
        defaults="header.the-secret-other.for-me"
        values={{ player: name }}
        components={TransComponents}
      />
    )
  }

  if (itsMe) {
    return (
        <Trans
          defaults="header.the-secret-other.me"
               values={{ effectPlayer: effectPlayerName }}
               components={TransComponents}
        />
    )
  }

  return (
    <Trans
      defaults="header.the-secret-other.player"
      values={{ player: name, effectPlayer: effectPlayerName }}
      components={TransComponents}
    />
  )
}
