import { isMoveItem, MaterialGame, MaterialItem, MaterialMove, MaterialRules, playAction, RulesCreator } from '@gamepark/rules-api'
import { maxBy, minBy, sample, sumBy, uniq } from 'lodash'
import { ArcaneCard, getColors, hasColor } from './material/ArcaneCard'
import { Color } from './material/Color'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Memory } from './Memory'
import { PresagesRules } from './PresagesRules'
import { RuleId } from './rules/RuleId'

export const PresagesBot = (game: MaterialGame, player: number): MaterialMove[] => {
  const rules = new PresagesRules(structuredClone(game))
  rules.forget(Memory.Bot) // Bots must be ignored when executing a bot to prevent infinite loops
  return new PresagesNegamax().getBestMoves(rules, player)
}

type NegamaxResult = {
  score: number
  moves: MaterialMove[]
  player: number
}

abstract class Negamax<R extends MaterialRules = MaterialRules> {
  abstract Rules: RulesCreator<MaterialGame>

  abstract isLeaf(rules: R, depth: number): boolean

  abstract evaluate(rules: R, player: number): number

  getMovesOfInterest(rules: R, player: number, _depth: number): MaterialMove[] {
    const legalMoves = rules.getLegalMoves(player)
    if (!legalMoves.length) {
      console.error(`Player ${player} is active but has no legal moves!`)
    }
    return legalMoves
  }

  areTeammates(_rules: R, player1: number, player2: number) {
    return player1 === player2
  }

  private negamax(rules: R, player: number, depth = 0, alpha = -Infinity, beta = Infinity): NegamaxResult {
    if (this.isLeaf(rules, depth)) {
      return { score: this.evaluate(rules, player), moves: [], player }
    }

    const moves = this.getMovesOfInterest(rules, player, depth)
    if (moves.length === 0) throw new Error('You must return at least on move of interest for the active player')
    if (depth === 0 && moves.length === 1) return { score: 0, moves, player }

    let best: NegamaxResult = { score: -Infinity, moves: [], player }
    for (const move of moves) {
      const result = this.getNegamaxResult(rules, player, depth, alpha, beta, move)
      if (best.score < result.score) {
        best = { score: result.score, moves: player === result.player ? [move, ...result.moves] : [move], player }
        alpha = Math.max(alpha, result.score)
        if (alpha >= beta) {
          break
        }
      }
    }
    return best
  }

  private getNegamaxResult(rules: R, player: number, depth: number, alpha: number, beta: number, move: MaterialMove): NegamaxResult {
    const childRules = new this.Rules(structuredClone(rules.game)) as R
    playAction(childRules, move, player)
    const nextPlayer = childRules.players.find((player) => childRules.isTurnToPlay(player))
    if (nextPlayer === undefined) {
      return { score: this.evaluate(rules, player), moves: [], player }
    }
    const teammates = this.areTeammates(childRules, player, nextPlayer)
    const result = this.negamax(childRules, nextPlayer, player === nextPlayer ? depth : depth + 1, teammates ? alpha : -beta, teammates ? beta : -alpha)
    if (!teammates) {
      result.score = -result.score
    }
    return result
  }

  getBestMoves(rules: R, player: number) {
    return this.negamax(rules, player).moves
  }
}

class PresagesNegamax extends Negamax {
  Rules = PresagesRules

  isLeaf(rules: PresagesRules, depth: number): boolean {
    return depth !== 0 && rules.game.rule?.id === RuleId.Place && rules.material(MaterialType.Arcane).location(LocationType.Table).length === 0
  }

  areTeammates(rules: PresagesRules, player1: number, player2: number) {
    return rules.remind(Memory.Team, player1) === rules.remind(Memory.Team, player2)
  }

  getMovesOfInterest(rules: PresagesRules, player: number, depth: number): MaterialMove[] {
    const legalMoves = super.getMovesOfInterest(rules, player, depth)
    const ruleId = rules.game.rule?.id
    if (ruleId === RuleId.TheSecretForMe) {
      return [sample(legalMoves.filter((move) => isMoveItem(move) && this.areTeammates(rules, player, move.location.player!)))!]
    }
    if (ruleId === RuleId.TheSecretForOther) {
      return [sample(legalMoves)!]
    }
    if (ruleId === RuleId.TheAbsolute) {
      if (depth !== 0) {
        const giveToPartner = legalMoves.find((move) => isMoveItem(move) && this.areTeammates(rules, player, move.location.player!))
        if (giveToPartner) return [giveToPartner]
      }
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

  evaluate(rules: PresagesRules, player: number): number {
    if (rules.isOver()) {
      return rules.remind<number[]>(Memory.Winners).includes(player) ? Infinity : -Infinity
    }
    return (
      this.evaluateWinRounds(rules, player) * 1000 +
      this.evaluateRemainingCards(rules, player) * 100 +
      this.evaluateStartingPlayer(rules, player) * 10 +
      this.evaluateHandsQuality(rules, player)
    )
  }

  evaluateWinRounds(rules: PresagesRules, player: number) {
    const helpCards = rules.material(MaterialType.Help).location(LocationType.Help).rotation(true).getItems()
    return sumBy(helpCards, (card) => (this.areTeammates(rules, player, card.location.player!) ? 1 : -1))
  }

  evaluateRemainingCards(rules: PresagesRules, player: number) {
    return sumBy(rules.players, (otherPlayer) => {
      const hand = rules.material(MaterialType.Arcane).location(LocationType.Hand).player(otherPlayer).length
      const value = hand === 2 ? 6 : hand === 3 ? 3 : hand === 4 ? 1 : 0
      return this.areTeammates(rules, player, otherPlayer) ? value : -value
    })
  }

  evaluateStartingPlayer(rules: PresagesRules, player: number) {
    const startingPlayer = rules.getActivePlayer()!
    const players = rules.players
    return sumBy(players, (otherPlayer) => {
      const position = (players.indexOf(otherPlayer) - players.indexOf(startingPlayer) + players.length) % players.length
      return this.areTeammates(rules, player, otherPlayer) ? position : -position
    })
  }

  evaluateHandsQuality(rules: PresagesRules, player: number) {
    return sumBy(rules.players, (handPlayer) => {
      const quality = this.evaluateHandQuality(rules, handPlayer)
      return this.areTeammates(rules, player, handPlayer) ? quality : -quality
    })
  }

  evaluateHandQuality(rules: PresagesRules, player: number) {
    const cards = rules.material(MaterialType.Arcane).location(LocationType.Hand)
    const myCards = cards.player(player).getItems<ArcaneCard>()
    return sumBy(myCards, (card) => this.getCardValue(card.id, player, rules, cards.getItems<ArcaneCard>()))
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
        return this.areTeammates(rules, owner, maxInColor.location.player!) ? 10 : 5
      }
      case ArcaneCard.TheDeath:
      case ArcaneCard.TheTruth:
      case ArcaneCard.TheNight: {
        const sameColorCards = cards.filter((card) => hasColor(card.id, getColors(arcane)[0]))
        const minInColor = minBy(sameColorCards, (card) => card.id)!
        return this.areTeammates(rules, owner, minInColor.location.player!) ? 10 : 5
      }
      case ArcaneCard.TheLove: {
        const greenCards = sumBy(cards, (card) => (hasColor(card.id, Color.Green) ? 1 : 0))
        return Math.min(10, greenCards * 4)
      }
      case ArcaneCard.TheFriendship: {
        const yellowCards = sumBy(cards, (card) => (hasColor(card.id, Color.Yellow) ? 1 : 0))
        return Math.min(10, yellowCards * 4)
      }
      case ArcaneCard.TheCalm: {
        const redCards = sumBy(cards, (card) => (hasColor(card.id, Color.Red) ? 1 : 0))
        return Math.min(10, redCards * 4)
      }
      case ArcaneCard.TheFeast: {
        const blueCards = sumBy(cards, (card) => (hasColor(card.id, Color.Blue) ? 1 : 0))
        return Math.min(10, blueCards * 4)
      }
      case ArcaneCard.TheHope: {
        const smallerCards = sumBy(cards, (card) => (card.id < arcane ? 1 : 0))
        return Math.max(10 - smallerCards * 2, 1)
      }
      case ArcaneCard.TheSpring: {
        const greenCards = sumBy(cards, (card) => (hasColor(card.id, Color.Green) ? 1 : 0)) - 1
        return Math.max(10 - greenCards * 2, 1)
      }
      case ArcaneCard.TheSummer: {
        const yellowCards = sumBy(cards, (card) => (hasColor(card.id, Color.Yellow) ? 1 : 0)) - 1
        return Math.max(10 - yellowCards * 2, 1)
      }
      case ArcaneCard.TheAutumn: {
        const redCards = sumBy(cards, (card) => (hasColor(card.id, Color.Red) ? 1 : 0)) - 1
        return Math.max(10 - redCards * 2, 1)
      }
      case ArcaneCard.TheEnigma: {
        const absoluteCards = sumBy(cards, (card) => (card.id >= 30 ? 1 : 0))
        return Math.min(10, absoluteCards * 4)
      }
      case ArcaneCard.TheFear:
        return 0
      case ArcaneCard.TheLuck: {
        const combo: Partial<Record<ArcaneCard, number>> = {
          [ArcaneCard.TheWinter]: 10,
          [ArcaneCard.TheLie]: 8,
          [ArcaneCard.TheTruth]: 8,
          [ArcaneCard.TheHarmony]: 3,
          [ArcaneCard.TheMirror]: 3
        }
        const comboCards = cards.filter((card) => combo[card.id] !== undefined)
        const potential = sumBy(comboCards, (card) => combo[card.id]! * (this.areTeammates(rules, owner, card.location.player!) ? 2 : 1))
        return Math.min(20, Math.max(3, potential))
      }
      case ArcaneCard.TheMirror: {
        const rightPlayer = rules.players[(rules.players.indexOf(owner) + rules.players.length - 1) % rules.players.length]
        return this.areTeammates(rules, owner, rightPlayer) ? 8 : 9
      }
      case ArcaneCard.TheLaw: {
        const leftPlayer = rules.players[(rules.players.indexOf(owner) + 1) % rules.players.length]
        return this.areTeammates(rules, owner, leftPlayer) ? 7 : 8
      }
      case ArcaneCard.TheMischief: {
        const combo = [ArcaneCard.TheLife, ArcaneCard.TheLie, ArcaneCard.TheNight, ArcaneCard.TheWinter]
        const helper = [ArcaneCard.TheLove, ArcaneCard.TheFriendship, ArcaneCard.TheCalm]
        const comboCount = sumBy(cards, (card) => (combo.includes(card.id) ? 1 : 0))
        const helperCount = sumBy(cards, (card) =>
          helper.includes(card.id) && owner !== card.location.player && this.areTeammates(rules, owner, card.location.player!) ? 1 : 0
        )
        return Math.min(10, Math.max(1, comboCount * 4 + helperCount * 2))
      }
      case ArcaneCard.TheHarmony: {
        const otherPlayerCards = cards.filter((card) => card.location.player !== owner)
        const minCard = minBy(otherPlayerCards, (card) => card.id)!
        return this.areTeammates(rules, owner, minCard.location.player!) ? 6 : 3
      }
      case ArcaneCard.TheDream: {
        const leftPlayer = rules.players[(rules.players.indexOf(owner) + 1) % rules.players.length]
        return this.areTeammates(rules, owner, leftPlayer) ? 4 : 7
      }
      case ArcaneCard.ThePride: {
        const leftPlayer = rules.players[(rules.players.indexOf(owner) + 1) % rules.players.length]
        return this.areTeammates(rules, owner, leftPlayer) ? 3 : 5
      }
      case ArcaneCard.TheJalousie: {
        const rightPlayer = rules.players[(rules.players.indexOf(owner) + rules.players.length - 1) % rules.players.length]
        return this.areTeammates(rules, owner, rightPlayer) ? 9 : 10
      }
      case ArcaneCard.TheSecret:
        return 2
      case ArcaneCard.TheSadness: {
        const rightPlayer = rules.players[(rules.players.indexOf(owner) + rules.players.length - 1) % rules.players.length]
        return this.areTeammates(rules, owner, rightPlayer) ? 6 : 7
      }
      case ArcaneCard.TheWinter: {
        const potential = sumBy(cards, (card) => {
          if (owner === card.location.player || !this.areTeammates(rules, owner, card.location.player!)) return 0
          if (!getColors(card.id).includes(Color.Yellow)) return 0
          return card.id === ArcaneCard.TheLuck ? 10 : 5
        })
        return Math.min(10, Math.max(2, potential))
      }
      case ArcaneCard.TheAnger: {
        const rightPlayer = rules.players[(rules.players.indexOf(owner) + rules.players.length - 1) % rules.players.length]
        return this.areTeammates(rules, owner, rightPlayer) ? 7 : 8
      }
      case ArcaneCard.TheBetrayal: {
        const rightPlayer = rules.players[(rules.players.indexOf(owner) + rules.players.length - 1) % rules.players.length]
        return this.areTeammates(rules, owner, rightPlayer) ? 11 : 12
      }
      case ArcaneCard.TheAbsolute30:
        return 8
      case ArcaneCard.TheAbsolute31:
        return 8
      case ArcaneCard.TheAbsolute32:
        return 8
      case ArcaneCard.TheAbsolute33:
        return 9
      case ArcaneCard.TheAbsolute34:
        return 9
      case ArcaneCard.TheAbsolute35:
        return 10
    }
  }
}
