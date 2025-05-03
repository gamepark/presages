import { ArcaneCard, getColors } from '@gamepark/presages/material/ArcaneCard'
import { Color } from '@gamepark/presages/material/Color'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { Memory } from '@gamepark/presages/Memory'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { CustomMoveType } from '@gamepark/presages/rules/CustomMoveType'
import { RoundResolutionRule } from '@gamepark/presages/rules/RoundResolutionRule'
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { Visibility } from '@gamepark/presages/rules/Visibility'
import { LogDescription } from '@gamepark/react-game'
import { MoveComponentContext } from '@gamepark/react-game/dist/components/History'
import { isCustomMoveType, isEndGame, isMoveItemType, isStartPlayerTurn, isStartRule, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { GameEndLog } from './components/GameEndLog'
import { PlaceCardLog } from './components/PlaceCardLog'
import { RoundEndLog } from './components/RoundEndLog'
import { RoundResolutionLog } from './components/RoundResolutionLog'
import { ShowStarterLog } from './components/ShowStarterLog'
import { StartRoundLog } from './components/StartRoundLog'
import { allColorBorderedCss, coloredLogCss, depthCss, logCss, simpleLogCss, spaceBeforeLogCss } from './components/styles'
import { TheAbsoluteLog } from './components/TheAbsoluteLog'
import { TheAngerLog } from './components/TheAngerLog'
import { TheBetrayalLog } from './components/TheBetrayalLog'
import { TheJalousieLog } from './components/TheJalousieLog'
import { TheLawLog } from './components/TheLawLog'
import { TheLuck } from './components/TheLuckLog'
import { TheSecretForOtherLog } from './components/TheSecretForOtherLog'
import { TheSecretShowLog } from './components/TheSecretShowLog'

export class PresagesLogs implements LogDescription {
  getMovePlayedLogDescription(move: MaterialMove, context: MoveComponentContext<MaterialMove, PlayerId, MaterialGame>) {
    if (
      (context.game.rule?.id === RuleId.TheSecretForMe || context.game.rule?.id === RuleId.TheSecretForOther) &&
      isMoveItemType(MaterialType.Arcane)(move) &&
      move.location.type === LocationType.Hand &&
      move.location.rotation === Visibility.TEMPORARY_VISIBLE_FOR_ME
    ) {
      return {
        Component: TheSecretShowLog,
        depth: 1,
        css: [coloredLogCss(Color.Red), depthCss]
      }
    }
    if (context.game.rule?.id === RuleId.TheSecretForMe && isStartRule(move) && move.id === RuleId.TheSecretForOther) {
      return {
        Component: TheSecretForOtherLog,
        depth: 1,
        css: [coloredLogCss(Color.Red), depthCss]
      }
    }

    if (context.game.rule?.id === RuleId.TheAnger && isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Hand) {
      return {
        Component: TheAngerLog,
        depth: 1,
        css: [coloredLogCss(Color.Blue), depthCss]
      }
    }

    if (context.game.rule?.id === RuleId.TheLaw && isCustomMoveType(CustomMoveType.TheLaw)(move)) {
      return {
        Component: TheLawLog,
        depth: 1,
        css: [coloredLogCss(Color.Yellow), depthCss]
      }
    }

    if (
      context.game.rule?.id === RuleId.TheJalousie &&
      isMoveItemType(MaterialType.Arcane)(move) &&
      move.location.type === LocationType.Table &&
      move.location.player !== context.game.rule.player
    ) {
      return {
        Component: TheJalousieLog,
        depth: 1,
        css: [coloredLogCss(Color.Red), depthCss]
      }
    }

    const isStartOfTurn =
      context.game.rule?.id === RuleId.RoundResolution || context.game.rule?.id === RuleId.ShowStarter || context.game.rule?.id === RuleId.TheLuck
    if ((isStartPlayerTurn(move) || isStartRule(move)) && move.id === RuleId.Place && isStartOfTurn) {
      return {
        Component: StartRoundLog,
        css: spaceBeforeLogCss
      }
    }

    if (isEndGame(move)) {
      return {
        Component: GameEndLog,
        depth: 1,
        css: simpleLogCss
      }
    }

    if (context.game.rule?.id === RuleId.RoundEnd) {
      const rules = new PresagesRules(context.game)
      const player = rules.remind<PlayerId>(Memory.RoundWinner)
      const team = rules.remind<number>(Memory.Team, player)
      const card = rules.material(MaterialType.Help).player(player).getItem()!
      if ((isMoveItemType(MaterialType.Help)(move) && move.location.player === player) || isCustomMoveType(CustomMoveType.TempoDiscard)(move)) {
        return {
          Component: RoundEndLog,
          player: player,
          css: logCss(team, card.location.rotation as boolean)
        }
      }
    }

    if (context.game.rule?.id === RuleId.TheBetrayal && isMoveItemType(MaterialType.Arcane)(move)) {
      if (move.location.type === LocationType.Hand) {
        return {
          Component: TheBetrayalLog,
          depth: 1,
          css: [coloredLogCss(Color.Blue), depthCss]
        }
      } else {
        return {
          Component: PlaceCardLog,
          player: context.game.rule.player,
          css: [coloredLogCss(Color.Blue), depthCss]
        }
      }
    }

    if (context.game.rule?.id === RuleId.TheLuck && isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Discard) {
      return {
        Component: TheLuck,
        player: context.game.rule.player,
        css: [coloredLogCss(Color.Yellow), depthCss]
      }
    }

    if (
      (context.game.rule?.id === RuleId.Place || context.game.rule?.id === RuleId.TheDream) &&
      isMoveItemType(MaterialType.Arcane)(move) &&
      move.location.type === LocationType.Table
    ) {
      const rule = new PresagesRules(JSON.parse(JSON.stringify(context.game)) as MaterialGame)
      const item = rule.material(MaterialType.Arcane).getItem<ArcaneCard>(move.itemIndex)
      const id: ArcaneCard = (move.reveal?.id ?? item.id) as ArcaneCard
      //if (rule.getActivePlayer() === move.location.player) {
      return {
        Component: PlaceCardLog,
        player: context.game.rule.player,
        css: id === ArcaneCard.TheMischief ? allColorBorderedCss : coloredLogCss(getColors(id)[0])
      }
    }

    if (
      context.game.rule?.id === RuleId.TheAbsolute &&
      isMoveItemType(MaterialType.Arcane)(move) &&
      move.location.type === LocationType.Hand &&
      move.location.rotation === Visibility.HIDDEN_FOR_EVERYONE
    ) {
      return {
        Component: TheAbsoluteLog,
        depth: 1,
        css: [coloredLogCss(Color.Blue), depthCss]
      }
    }

    if (context.game.rule?.id === RuleId.ShowStarter && isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Hand) {
      return {
        Component: ShowStarterLog,
        player: move.location.player,
        css: coloredLogCss(Color.Blue)
      }
    }

    if (context.game.rule?.id === RuleId.RoundResolution && isCustomMoveType(CustomMoveType.CardResolutionLog)(move)) {
      const rule = new RoundResolutionRule(context.game)
      const index = rule
        .material(MaterialType.Arcane)
        .location(LocationType.Table)
        .player(move.data as PlayerId)
        .getIndex()
      const isThenDiscarded = context.action.consequences.some(
        (move) => isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Discard && move.itemIndex === index
      )
      if (isThenDiscarded) {
        return {
          Component: RoundResolutionLog,
          player: move.data,
          css: simpleLogCss
        }
      }
    }

    return
  }
}
