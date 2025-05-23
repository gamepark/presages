/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ArcaneCard, getColors, isAbsolute } from '@gamepark/presages/material/ArcaneCard'
import { Color } from '@gamepark/presages/material/Color'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { MaterialHelpProps, Picture, PlayMoveButton, useLegalMoves, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { isMoveItemType, MaterialRules, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Help from '../../images/icons/help.jpg'
import Important from '../../images/icons/important.png'
import { rainbowGradiant } from '../../logs/components/styles'
import { getHtmlColor } from '../../utils/color'
import { TransComponents } from '../../utils/trans.components'

export const ArcaneHelp: FC<MaterialHelpProps> = (props) => {
  const { item, itemIndex, closeDialog } = props
  const { t } = useTranslation()
  const playerId = usePlayerId()
  const rules = useRules<MaterialRules>()!
  const legalMoves = useLegalMoves<MoveItem>((move) => itemIndex !== undefined && isMoveItemType(MaterialType.Arcane)(move))
  const place = legalMoves.filter((move) => move.location.type === LocationType.Table && rules.game.rule?.id === RuleId.Place && itemIndex === move.itemIndex)
  const anger = legalMoves.find((move) => move.location.type === LocationType.Hand && rules.game.rule?.id === RuleId.TheAnger && itemIndex === move.itemIndex)
  const jalousie = legalMoves.find(
    (move) =>
      move.location.type === LocationType.Table &&
      rules.game.rule?.id === RuleId.TheJalousie &&
      itemIndex === rules.material(MaterialType.Arcane).location(LocationType.Table).player(move.location.player).getIndex()
  )
  if (!item.id) return null
  const id = item.id as ArcaneCard
  return (
    <>
      <h2>{t(isAbsolute(id) ? `card.absolute` : `card.${id}`)}</h2>
      {place.length > 0 && place.map((p) => <PlaceInFrontOfMove playerId={playerId} move={p} closeDialog={closeDialog} target={p.location.player!} />)}
      {anger && <AngerMove move={anger} closeDialog={closeDialog} target={anger.location.player!} />}
      {jalousie && <JalousieMove move={jalousie} closeDialog={closeDialog} />}
      <div css={minSizeCss}>
        <div css={specificPartCss}>
          <div css={item.id !== ArcaneCard.TheMischief ? getTitleBackground(id) : mischiefTitleBackgroundCss}>{t('help.arcane.effect')}</div>
          <p css={[littleCss, effectCss, item.id !== ArcaneCard.TheMischief ? borderedCss(getColors(id)[0]) : allColorBorderedCss]}>
            <span>
              <Trans defaults={isAbsolute(id) ? `card.absolute.desc` : `card.${item.id}.desc`} components={ArcaneComponents} />
            </span>
          </p>
        </div>

        <div css={[commonPartCss, littleCss]}>
          <div
            css={css`
              width: 100%;
              display: flex;
              align-items: flex-end;
            `}
          >
            <span css={blueCss}>
              <Trans defaults="help.arcane.precision" components={TransComponents} />
            </span>
            <Picture src={Help} css={helpImageCss} />
          </div>
          <ul css={listCss}>
            <li>
              <Trans defaults="help.arcane.precision.1" components={TransComponents} />
            </li>
            <li>
              <Trans defaults="help.arcane.precision.2" components={TransComponents} />
            </li>
            <li>
              <Trans defaults="help.arcane.precision.3" components={TransComponents} />
            </li>
            <li>
              <Trans defaults="help.arcane.precision.4" components={TransComponents} />
            </li>
            <li>
              <Trans defaults="help.arcane.precision.5" components={TransComponents} />
            </li>
          </ul>
          <div css={importantCss}>
            <span>
              <Picture src={Important} css={importantImageCss} />
            </span>
            <div>
              <Trans defaults="help.arcane.important" components={TransComponents} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const PlaceInFrontOfMove: FC<{ move: MoveItem; playerId?: PlayerId; target: PlayerId; closeDialog: () => void }> = (props) => {
  const { move, playerId, target, closeDialog } = props
  const name = usePlayerName(target)
  return (
    <PlayMoveButton move={move} onPlay={closeDialog} css={marginCss}>
      <Trans defaults={playerId === target ? 'move.place' : 'move.place.other'} values={{ player: name }} />
    </PlayMoveButton>
  )
}

const AngerMove: FC<{ move: MoveItem; target: PlayerId; closeDialog: () => void }> = (props) => {
  const { move, target, closeDialog } = props
  const name = usePlayerName(target)
  return (
    <PlayMoveButton move={move} onPlay={closeDialog} css={marginCss}>
      <Trans defaults="move.betrayal" values={{ player: name }} />
    </PlayMoveButton>
  )
}

const JalousieMove: FC<{ move: MoveItem; closeDialog: () => void }> = (props) => {
  const { move, closeDialog } = props
  return (
    <PlayMoveButton move={move} onPlay={closeDialog} css={marginCss}>
      <Trans defaults="move.jalousie" />
    </PlayMoveButton>
  )
}

const borderedCss = (color: Color) => css`
  border: 0.2em solid ${getHtmlColor(color)};
  border-radius: 0 0 0.5em 0.5em;
  padding: 0.5em;
`

const marginCss = css`
  margin-top: 0.5em;
  margin-right: 0.5em;
`

const allColorBorderedCss = css`
  background-image: ${rainbowGradiant};
  border-image-slice: 1;
  border-image-source: ${rainbowGradiant};
  border-radius: 0 0 0.5em 0.5em;
  padding: 0.2em;
  padding-top: 0.2em;

  > span {
    padding: 0.5em;
    border-radius: 0 0 0.3em 0.3em;
  }
`

const importantCss = css`
  display: flex;
  flex-direction: row;
  border: 0.2em solid #cf3745;
  padding: 0.5em;
  border-radius: 0.5em;
  white-space: pre-wrap;
`

const importantImageCss = css`
  height: 3em;
  padding-right: 1em;
`

const helpImageCss = css`
  height: 2.7em;
  border-radius: 0.5em;
  transform: translateY(25%);
`

const commonPartCss = css`
  flex: 1;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
`
const specificPartCss = css`
  flex: 1;
`

const littleCss = css`
  font-size: 0.8em;
`

const listCss = css`
  margin-top: 0.5em;
  margin-bottom: 1.5em;

  li {
    margin-bottom: 0.05em;
  }

  li::marker {
    color: #43ade2;
  }
`

const blueCss = css`
  font-weight: bold;
  color: #43ade2;
  width: 100%;
`

const effectCss = css`
  margin-top: 0;
  margin-bottom: 0;

  > span {
    display: block;
    height: 100%;
    width: 100%;
    background-color: #f0fbfc;
    white-space: pre-wrap;
  }
`

const getTitleBackground = (id: ArcaneCard) => css`
  padding: 0.3em 0.5em 0.1em;
  margin-top: 1em;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
  background-color: ${getHtmlColor(getColors(id)[0])};
`

const mischiefTitleBackgroundCss = css`
  ${getTitleBackground(ArcaneCard.TheMischief)};
  background-image: ${rainbowGradiant};
`

const minSizeCss = css`
  display: flex;
  flex-direction: column;
  min-height: 70vh;
  min-height: 70dvh;
  min-width: 48.5vw;
  min-width: 48.5dvw;
`

const cardPrecisionCss = css`
  font-style: italic;
  font-size: 0.8em;
  color: gray;
`
const ArcaneComponents = {
  ...TransComponents,
  precision: <span css={cardPrecisionCss}></span>
}
