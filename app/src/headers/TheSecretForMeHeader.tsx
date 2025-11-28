import { PlayerId } from '@gamepark/presages/PlayerId'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { CustomMoveType } from '@gamepark/presages/rules/CustomMoveType'
import { usePlayerId, useRules, usePlayerName, useLegalMoves, PlayMoveButton, fontSizeCss } from '@gamepark/react-game'
import { CustomMove, isCustomMoveType } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'

export const TheSecretForMeHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const activePlayer = rules.getActivePlayer()
  const itsMe = playerId && activePlayer === playerId
  const name = usePlayerName(activePlayer)
  const seeCards: CustomMove[] = useLegalMoves<CustomMove>(isCustomMoveType(CustomMoveType.SeeCard))

  if (itsMe) {
    return (
      <div css={fontSizeCss(0.8)}>
        <Trans i18nKey="header.the-secret-me.me" components={TransComponents} />
        {seeCards.length > 0 &&
          seeCards.map((c) => (
            <>
              <SecretPlayer playerId={c.data} move={c} />
              &nbsp;
            </>
          ))}
      </div>
    )
  }
  return (
    <>
      <Trans i18nKey="header.the-secret-me.player" values={{ player: name }} components={TransComponents} />
    </>
  )
}

const SecretPlayer: FC<{ playerId: PlayerId; move: CustomMove }> = ({ playerId, move }) => {
  const name = usePlayerName(playerId)
  return <PlayMoveButton move={move}>{name}</PlayMoveButton>
}
