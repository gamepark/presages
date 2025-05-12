/** @jsxImportSource @emotion/react */
import { Memory } from '@gamepark/presages/Memory'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'

export const TheAbsoluteHeader = () => {
  const playerId = usePlayerId<PlayerId>()
  const rules = useRules<PresagesRules>()!
  const activePlayer = rules.getActivePlayer()
  const effectPlayer = rules.remind(Memory.EffectPlayer)
  const imTheEffectPlayer = playerId && effectPlayer === playerId
  const itsMe = playerId && activePlayer === playerId
  const name = usePlayerName(activePlayer)
  const effectPlayerName = usePlayerName(effectPlayer)

  if (imTheEffectPlayer && !itsMe) {
    return <Trans defaults="header.the-absolute.player-must-give-me" values={{ player: name }} components={TransComponents} />
  }

  if (itsMe && imTheEffectPlayer) {
    return <Trans defaults="header.the-absolute.me" components={TransComponents} />
  }

  if (itsMe && !imTheEffectPlayer) {
    return <Trans defaults="header.the-absolute.i-must-give" components={TransComponents} values={{ effectPlayer: effectPlayerName }} />
  }

  if (!itsMe && !imTheEffectPlayer && effectPlayer === activePlayer) {
    return <Trans defaults="header.the-absolute.player" components={TransComponents} values={{ player: name }} />
  }

  return <Trans defaults="header.the-absolute.player-must-give" components={TransComponents} values={{ player: name, effectPlayer: effectPlayerName }} />
}
