import { css } from '@emotion/react'
import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { Memory } from '@gamepark/presages/Memory'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { RoundEffects } from '@gamepark/presages/rules/arcane/RoundEffects'
import { MoveComponentContext, MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { CustomMove, MaterialGame, MaterialItem, MaterialMove } from '@gamepark/rules-api'
import { FC, Fragment } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { CardNameLink } from './CardNameLink'
import { greyCss } from './styles'

export const RoundResolutionLog: FC<MoveComponentProps> = (props) => {
  const move = props.move as CustomMove
  const player: PlayerId = move.data
  const { t } = useTranslation()
  const context: MoveComponentContext<MaterialMove, PlayerId, MaterialGame> = props.context
  const name = usePlayerName(player)
  const rule = new PresagesRules(JSON.parse(JSON.stringify(context.game)) as MaterialGame)
  const winner = rule.remind<{ player: number }>(Memory.WinningCard).player
  const arcane = rule.material(MaterialType.Arcane).location(LocationType.Table).player(player).getItem<ArcaneCard>()!
  const table = rule.remind<MaterialItem<PlayerId, LocationType, ArcaneCard>[] | undefined>(Memory.Table as number) ?? []

  const discardedBy = isDiscardedBy(arcane, table, context.game)
  const changeTrickItem = isChangingWinTurnCondition(table, context.game)
  const changeTrickPlayer = usePlayerName(changeTrickItem?.location.player)

  if (winner === move.data) {
    return (
      <>
        <span css={textCss}>
          <Trans
            i18nKey="log.win.turn"
            values={{ player: name, cardName: t(`arcane.${arcane.id}`) }}
            components={{
              arcane: <CardNameLink id={arcane.id} />
            }}
          />
          {changeTrickItem !== undefined && (
            <>
              <br />
              <br />
              <span css={greyCss}>
                <Trans
                  i18nKey="log.change-win-trick"
                  values={{ player: changeTrickPlayer }}
                  components={{
                    italic: <i />,
                    arcane: <CardNameLink id={changeTrickItem.id} />
                  }}
                />
              </span>
            </>
          )}
        </span>
      </>
    )
  }
  return (
    <>
      <span css={textCss}>
        <Trans
          i18nKey="log.discard"
          values={{ player: name, cardName: t(`arcane.${arcane.id}`) }}
          components={{
            arcane: <CardNameLink id={arcane.id} />
          }}
        />
        <br />
        {discardedBy.map((id, index: number) => {
          return (
            <Fragment key={id}>
              {index > 0 ? ', ' : ''}
              <CardNameLink key={id} id={id} />
            </Fragment>
          )
        })}
      </span>
    </>
  )
}

const isChangingWinTurnCondition = (table: MaterialItem<PlayerId, LocationType, ArcaneCard>[], game: MaterialGame): MaterialItem | undefined => {
  return table.find((item) => new RoundEffects[item.id](game).winTheTrickCondition)
}

const isDiscardedBy = (
  arcane: MaterialItem<PlayerId, LocationType, ArcaneCard>,
  table: MaterialItem<PlayerId, LocationType, ArcaneCard>[],
  game: MaterialGame
): ArcaneCard[] => {
  const effects = table.map((item) => new RoundEffects[item.id](game))
  const discardedBy: ArcaneCard[] = []
  for (let i = 0; i < table.length; i++) {
    const id = table[i].id
    const thisEffect = effects[i]
    const isDiscardedByThisOne = thisEffect.canDiscard(arcane.id)
    if (isDiscardedByThisOne) discardedBy.push(id)
  }

  return discardedBy
}

const textCss = css`
  flex: 1;
`
