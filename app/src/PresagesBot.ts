import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { Memory } from '@gamepark/presages/Memory'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { GameAI, getRelativePlayerIndex, MaterialContext } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MaterialRules, playAction, RulesCreator } from '@gamepark/rules-api'
import { sumBy } from 'lodash'

export const PresagesBot = (game: MaterialGame, player: number): MaterialMove[] => {
  const rules = new PresagesRules(structuredClone(game))
  rules.forget(Memory.Bot) // Bots must be ignored when executing a bot to prevent infinite loops
  return new PresagesNegamax().getBestMoves(rules, player)
}

type NegamaxResult = {
  player?: number
  moves: MaterialMove[]
  score: number
}

abstract class Negamax<R extends MaterialRules = MaterialRules> {
  abstract Rules: RulesCreator<MaterialGame>
  player!: number

  abstract isLeaf(rules: R, depth: number): boolean

  abstract evaluate(rules: R): number

  getMovesOfInterest(rules: R, player: number): MaterialMove[] {
    return rules.getLegalMoves(player)
  }

  private negamax(rules: R, depth: number, player = rules.players.find((player) => rules.isTurnToPlay(player))): NegamaxResult {
    if (player === undefined || this.isLeaf(rules, depth)) {
      return { moves: [], score: this.evaluate(rules) }
    }
    const moves = this.getMovesOfInterest(rules, player)
    if (depth === 0 && moves.length === 1) return { moves, score: 0 }
    let best: NegamaxResult | undefined = undefined
    for (const move of moves) {
      const rulesAfter = new this.Rules(structuredClone(rules.game)) as R
      playAction(rulesAfter, move, player)
      const result = this.negamax(rulesAfter, depth + 1)
      if (!best || best.score < result.score || (best.score === result.score && Math.random() < 0.5)) {
        best = { player, moves: player === result.player ? [move, ...result.moves] : [move], score: result.score }
      }
    }
    return best!
  }

  getBestMoves(rules: R, player: number) {
    this.player = player
    return this.negamax(rules, 0, player).moves
  }
}

class PresagesNegamax extends Negamax {
  Rules = PresagesRules

  isLeaf(rules: PresagesRules, depth: number): boolean {
    return depth !== 0 && rules.game.rule?.id === RuleId.Place && rules.material(MaterialType.Arcane).location(LocationType.Table).length === 0
  }

  isTeammate(rules: PresagesRules, player: number) {
    return rules.remind(Memory.Team, player) === rules.remind(Memory.Team, this.player)
  }

  getMovesOfInterest(rules: MaterialRules, player: number): MaterialMove[] {
    const legalMoves = super.getMovesOfInterest(rules, player)
    const ruleId = rules.game.rule?.id
    if (ruleId === RuleId.TheSecretForMe || ruleId === RuleId.TheSecretForOther) {
      return legalMoves.slice(0, 1) // TODO: get the best move for The Secret
    }
    if (ruleId === RuleId.TheAbsolute) {
      return legalMoves.slice(0, 1) // TODO: evaluate quality of hand and optimize absolute
    }
    return legalMoves
  }

  evaluate(rules: PresagesRules): number {
    if (rules.isOver()) {
      return rules.remind<number[]>(Memory.Winners).includes(this.player) ? Infinity : -Infinity
    }
    return this.evaluateWinRounds(rules) + this.evaluateRemainingCards(rules) + this.evaluateStartingPlayer(rules)
  }

  evaluateWinRounds(rules: PresagesRules) {
    const helpCards = rules.material(MaterialType.Help).location(LocationType.Help).rotation(true).getItems()
    return sumBy(helpCards, (card) => (this.isTeammate(rules, card.location.player!) ? 100 : -100))
  }

  evaluateRemainingCards(rules: PresagesRules) {
    return sumBy(rules.players, (player) => {
      const hand = rules.material(MaterialType.Arcane).location(LocationType.Hand).player(player).length
      const value = hand === 2 ? 50 : hand === 3 ? 30 : hand === 4 ? 10 : 0
      return this.isTeammate(rules, player) ? value : -value
    })
  }

  evaluateStartingPlayer(rules: PresagesRules) {
    const startingPlayer = rules.getActivePlayer()!
    return sumBy(rules.players, (player) => {
      const position = getRelativePlayerIndex({ rules, player: startingPlayer } as unknown as MaterialContext, player)
      return this.isTeammate(rules, player) ? position : -position
    })
  }
}

export const TutorialBot: GameAI = (game: MaterialGame, player: number) => Promise.resolve(PresagesBot(game, player))
