import { Memory } from '@gamepark/presages/Memory'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerId, useRules, usePlayerName } from '@gamepark/react-game'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'

export const TheDreamHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const activePlayer = rules.getActivePlayer()
  const effectPlayer = rules.remind(Memory.EffectPlayer)
  const imTheEffectPlayer = playerId && effectPlayer === playerId
  const itsMe = playerId && activePlayer === playerId
  const name = usePlayerName(activePlayer)
  const effectPlayerName = usePlayerName(effectPlayer)

  if (itsMe && !imTheEffectPlayer) {
    return <Trans i18nKey="header.the-dream.me" values={{ effectPlayer: effectPlayerName }} components={TransComponents} />
  }

  if (imTheEffectPlayer && !itsMe) {
    return <Trans i18nKey="header.the-dream.in-front-me" values={{ player: name }} components={TransComponents} />
  }
  return <Trans i18nKey="header.the-dream.player" values={{ player: name, effectPlayer: effectPlayerName }} components={TransComponents} />
}
