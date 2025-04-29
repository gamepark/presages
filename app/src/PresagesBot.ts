import { ArcaneCard, getColors, hasColor } from '@gamepark/presages/material/ArcaneCard'
import { Color } from '@gamepark/presages/material/Color'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { Memory } from '@gamepark/presages/Memory'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { GameAI, getRelativePlayerIndex, MaterialContext } from '@gamepark/react-game'
import { isMoveItem, MaterialGame, MaterialItem, MaterialMove, MaterialRules, playAction, RulesCreator } from '@gamepark/rules-api'
import { maxBy, minBy, sample, sumBy, uniq } from 'lodash'

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
    if (moves.length === 0) {
      throw new Error('You must return at least on move of interest for the active player')
    }
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

  areTeammates(rules: PresagesRules, player1: number, player2 = this.player) {
    return rules.remind(Memory.Team, player1) === rules.remind(Memory.Team, player2)
  }

  getMovesOfInterest(rules: PresagesRules, player: number): MaterialMove[] {
    const legalMoves = super.getMovesOfInterest(rules, player)
    const ruleId = rules.game.rule?.id
    if (ruleId === RuleId.TheSecretForMe) {
      return [sample(legalMoves.filter((move) => isMoveItem(move) && this.areTeammates(rules, player, move.location.player)))!]
    }
    if (ruleId === RuleId.TheSecretForOther) {
      return [sample(legalMoves)!]
    }
    if (ruleId === RuleId.TheAbsolute) {
      let giveMoves = legalMoves.filter(isMoveItem)
      const playersToGiveTo = uniq(giveMoves.map((move) => move.location.player!))
      const cardsToGive = uniq(giveMoves.map((move) => move.itemIndex))
      const worstCard = rules
        .material(MaterialType.Arcane)
        .index(cardsToGive)
        .minBy((card) => this.getCardValue(card.id as ArcaneCard, player, rules))
        .getIndex()
      for (const otherPlayer of playersToGiveTo) {
        if (!this.areTeammates(rules, player, otherPlayer)) {
          giveMoves = giveMoves.filter((move) => move.location.player !== otherPlayer || move.itemIndex === worstCard)
        }
      }
      return giveMoves
    }
    return legalMoves
  }

  evaluate(rules: PresagesRules): number {
    if (rules.isOver()) {
      return rules.remind<number[]>(Memory.Winners).includes(this.player) ? Infinity : -Infinity
    }
    return this.evaluateWinRounds(rules) + this.evaluateRemainingCards(rules) + this.evaluateStartingPlayer(rules) + this.evaluateHandsQuality(rules)
  }

  evaluateWinRounds(rules: PresagesRules) {
    const helpCards = rules.material(MaterialType.Help).location(LocationType.Help).rotation(true).getItems()
    return sumBy(helpCards, (card) => (this.areTeammates(rules, card.location.player!) ? 100 : -100))
  }

  evaluateRemainingCards(rules: PresagesRules) {
    return sumBy(rules.players, (player) => {
      const hand = rules.material(MaterialType.Arcane).location(LocationType.Hand).player(player).length
      const value = hand === 2 ? 50 : hand === 3 ? 30 : hand === 4 ? 10 : 0
      return this.areTeammates(rules, player) ? value : -value
    })
  }

  evaluateStartingPlayer(rules: PresagesRules) {
    const startingPlayer = rules.getActivePlayer()!
    return sumBy(rules.players, (player) => {
      const position = getRelativePlayerIndex({ rules, player: startingPlayer } as unknown as MaterialContext, player)
      return this.areTeammates(rules, player) ? position : -position
    })
  }

  evaluateHandsQuality(rules: PresagesRules) {
    return sumBy(rules.players, (player) => {
      const quality = this.evaluateHandQuality(rules, player)
      return this.areTeammates(rules, player) ? quality : -quality
    })
  }

  evaluateHandQuality(rules: PresagesRules, player: number) {
    const cards = rules.material(MaterialType.Arcane).location(LocationType.Hand)
    const myCards = cards.player(player).getItems<ArcaneCard>()
    return sumBy(myCards, (card) => this.getCardValue(card.id, card.location.player!, rules, cards.getItems<ArcaneCard>()))
  }

  getCardValue(
    arcane: ArcaneCard,
    owner: number,
    rules: PresagesRules,
    cards: MaterialItem<number, LocationType, ArcaneCard>[] = rules.material(MaterialType.Arcane).location(LocationType.Hand).getItems<ArcaneCard>()
  ): number {
    switch (arcane) {
      case ArcaneCard.TheLife:
      case ArcaneCard.TheLie:
      case ArcaneCard.TheDay: {
        const sameColorCards = cards.filter((card) => hasColor(card.id, getColors(arcane)[0]))
        const maxInColor = maxBy(sameColorCards, (card) => card.id)!
        return this.areTeammates(rules, owner, maxInColor.location.player) ? 1 : 0.5
      }
      case ArcaneCard.TheDeath:
      case ArcaneCard.TheTruth:
      case ArcaneCard.TheNight: {
        const sameColorCards = cards.filter((card) => hasColor(card.id, getColors(arcane)[0]))
        const minInColor = minBy(sameColorCards, (card) => card.id)!
        return this.areTeammates(rules, owner, minInColor.location.player) ? 1 : 0.5
      }
      case ArcaneCard.TheLove: {
        const greenCards = sumBy(cards, (card) => (hasColor(card.id, Color.Green) ? 1 : 0))
        return Math.min(1, greenCards * 0.4)
      }
      case ArcaneCard.TheFriendship: {
        const yellowCards = sumBy(cards, (card) => (hasColor(card.id, Color.Yellow) ? 1 : 0))
        return Math.min(1, yellowCards * 0.4)
      }
      case ArcaneCard.TheCalm: {
        const redCards = sumBy(cards, (card) => (hasColor(card.id, Color.Red) ? 1 : 0))
        return Math.min(1, redCards * 0.4)
      }
      case ArcaneCard.TheFeast: {
        const blueCards = sumBy(cards, (card) => (hasColor(card.id, Color.Blue) ? 1 : 0))
        return Math.min(1, blueCards * 0.4)
      }
      case ArcaneCard.TheHope: {
        const smallerCards = sumBy(cards, (card) => (card.id < arcane ? 1 : 0))
        return Math.max(1 - smallerCards * 0.25, 0.1)
      }
      case ArcaneCard.TheSpring: {
        const greenCards = sumBy(cards, (card) => (hasColor(card.id, Color.Green) ? 1 : 0)) - 1
        return Math.max(1 - greenCards * 0.25, 0.1)
      }
      case ArcaneCard.TheSummer: {
        const yellowCards = sumBy(cards, (card) => (hasColor(card.id, Color.Yellow) ? 1 : 0)) - 1
        return Math.max(1 - yellowCards * 0.25, 0.1)
      }
      case ArcaneCard.TheAutumn: {
        const redCards = sumBy(cards, (card) => (hasColor(card.id, Color.Red) ? 1 : 0)) - 1
        return Math.max(1 - redCards * 0.25, 0.1)
      }
      case ArcaneCard.TheEnigma: {
        const absoluteCards = sumBy(cards, (card) => (card.id >= 30 ? 1 : 0))
        return Math.min(1, absoluteCards * 0.4)
      }
      case ArcaneCard.TheFear:
        return 0
      case ArcaneCard.TheLuck: {
        const combo: Partial<Record<ArcaneCard, number>> = {
          [ArcaneCard.TheWinter]: 1,
          [ArcaneCard.TheLie]: 0.8,
          [ArcaneCard.TheTruth]: 0.8,
          [ArcaneCard.TheHarmony]: 0.3,
          [ArcaneCard.TheMirror]: 0.3
        }
        const comboCards = cards.filter((card) => combo[card.id] !== undefined)
        const potential = sumBy(comboCards, (card) => combo[card.id]! * (this.areTeammates(rules, owner, card.location.player) ? 2 : 1))
        return Math.min(2, Math.max(0.3, potential))
      }
      case ArcaneCard.TheMirror:
        return 0.9
      case ArcaneCard.TheLaw:
        return 0.8
      case ArcaneCard.TheMischief: {
        const combo = [ArcaneCard.TheLife, ArcaneCard.TheLie, ArcaneCard.TheNight, ArcaneCard.TheWinter]
        const helper = [ArcaneCard.TheLove, ArcaneCard.TheFriendship, ArcaneCard.TheCalm]
        const comboCount = sumBy(cards, (card) => (combo.includes(card.id) ? 1 : 0))
        const helperCount = sumBy(cards, (card) =>
          helper.includes(card.id) && owner !== card.location.player && this.areTeammates(rules, owner, card.location.player) ? 1 : 0
        )
        return Math.min(1, Math.max(0.1, comboCount * 0.4 + helperCount * 0.2))
      }
      case ArcaneCard.TheHarmony: {
        const otherPlayerCards = cards.filter((card) => card.location.player !== owner)
        const minCard = minBy(otherPlayerCards, (card) => card.id)!
        return this.areTeammates(rules, owner, minCard.location.player) ? 0.6 : 0.3
      }
      case ArcaneCard.TheDream: {
        const leftPlayer = rules.players[(rules.players.indexOf(owner) + 1) % rules.players.length]
        return this.areTeammates(rules, owner, leftPlayer) ? 0.4 : 0.7
      }
      case ArcaneCard.ThePride: {
        const leftPlayer = rules.players[(rules.players.indexOf(owner) + 1) % rules.players.length]
        return this.areTeammates(rules, owner, leftPlayer) ? 0.3 : 0.5
      }
      case ArcaneCard.TheJalousie:
        return 1
      case ArcaneCard.TheSecret:
        return 0.2
      case ArcaneCard.TheSadness:
        return 0.7
      case ArcaneCard.TheWinter: {
        const potential = sumBy(cards, (card) => {
          if (owner === card.location.player || !this.areTeammates(rules, owner, card.location.player)) return 0
          if (!getColors(card.id).includes(Color.Yellow)) return 0
          return card.id === ArcaneCard.TheLuck ? 1 : 0.5
        })
        return Math.min(1, Math.max(0.2, potential))
      }
      case ArcaneCard.TheAnger:
        return 0.8
      case ArcaneCard.TheBetrayal:
        return 1.2
      case ArcaneCard.TheAbsolute30:
      case ArcaneCard.TheAbsolute31:
      case ArcaneCard.TheAbsolute32:
      case ArcaneCard.TheAbsolute33:
      case ArcaneCard.TheAbsolute34:
      case ArcaneCard.TheAbsolute35:
        return arcane / 35
    }
  }
}

export const TutorialBot: GameAI = (game: MaterialGame, player: number) => Promise.resolve(PresagesBot(game, player))
