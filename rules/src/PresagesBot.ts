import { isMoveItem, MaterialGame, MaterialItem, MaterialMove, MaterialRules, playAction, RulesCreator } from '@gamepark/rules-api'
import { cloneDeep, maxBy, minBy, orderBy, sample, sumBy, uniq } from 'es-toolkit'
import { ArcaneCard, getColors, hasColor } from './material/ArcaneCard'
import { Color } from './material/Color'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Memory } from './Memory'
import { PresagesRules } from './PresagesRules'
import { RuleId } from './rules/RuleId'

/**
 * AI used to play the bots of the 2 and 3 players games (they play the empty seats) and the tutorial opponents.
 *
 * It searches all the possible moves until the beginning of the next trick (see {@link PresagesNegamax.isStepEnd}), then evaluates the
 * resulting positions with a heuristic. When the hands are small enough, it searches up to {@link MAX_TRICKS} tricks ahead: a round is
 * decided by the players who have 2 or 3 cards left. It knows every card, including the ones hidden in the other players' hands.
 *
 * It only returns the best move: the bot is called again for each of its next moves, because a planned sequence of moves may become
 * invalid in between (hands are shuffled after each card exchange, so an item index no longer designates the same card).
 */
export const PresagesBot = (game: MaterialGame, player: number, maxNodes = MAX_NODES): MaterialMove[] => {
  const rules = new PresagesRules(cloneDeep(game))
  rules.forget(Memory.Bot) // Bots must be ignored when executing a bot to prevent infinite loops
  return [new PresagesNegamax(maxNodes, MAX_TRICKS).getBestMove(rules, player)]
}

/**
 * Maximum number of positions explored by a search. Each one costs about 1 ms, and a trick with 6 players can have tens of thousands of
 * positions, so the search is limited to keep the bots playing in a few seconds.
 */
const MAX_NODES = 3000

/**
 * Maximum number of tricks searched ahead. Measured over 392 games with 4 players, a team searching 3 tricks ahead won 64% of its games
 * against a team searching 1 trick ahead.
 */
const MAX_TRICKS = 3

type NegamaxResult = {
  /** Score of the position, from the point of view of the player who searched it */
  score: number
  /** Best move found, only defined when the position was not a leaf */
  move?: MaterialMove
}

class NodesBudgetExceeded extends Error {}

/** Much faster than a generic deep clone, and the search spends a quarter of its time copying the game */
const cloneGame = (game: MaterialGame): MaterialGame => {
  const items: MaterialGame['items'] = {}
  for (const type in game.items) {
    items[type] = game.items[type]!.map((item) => ({ ...item, location: { ...item.location } }))
  }
  return { ...game, items, memory: cloneDeep(game.memory), rule: cloneDeep(game.rule) }
}

/**
 * Negamax algorithm with alpha-beta pruning, adapted to team games: the score is negated only when the next player to act is not a
 * teammate. With more than 2 teams, all the other teams are considered as allied against the player ("paranoid" search).
 *
 * The search is split in steps (see {@link isStepEnd}). It first goes to the end of the current step, then, as long as the budget of
 * {@link maxNodes} positions is not exceeded, it starts again one step further, up to {@link maxSteps}. The best move of the deepest
 * complete search is played.
 *
 * Each search tries the moves of the player in the order of the scores they got in the previous, shallower search. As a move only replaces
 * the best one when it is strictly better, moves that are equal in the deepest search are decided by the shallower ones. It matters when
 * several moves look like a forced win: the search is not exhaustive (see {@link getMovesOfInterest}) and the teammates do not see the
 * hidden cards, so the move that is also the best in the short term is the most robust.
 *
 * When even the first step exceeds the budget, an iterative deepening search is done instead, with half the budget: the moves are
 * searched at depth 1, then 2, etc., until the budget is exceeded. In the worst case, 1.5 times {@link maxNodes} positions are explored.
 */
abstract class Negamax<R extends MaterialRules = MaterialRules> {
  abstract Rules: RulesCreator<MaterialGame>

  private nodes = 0
  private maxDepth = Infinity
  private steps = 1
  private limitReached = false
  /** Scores of the moves of the player in the last complete search */
  private rootScores = new Map<string, number>()

  constructor(
    private readonly maxNodes = Infinity,
    private readonly maxSteps = 1
  ) {}

  /** The search always stops on leaves, where the position is evaluated */
  abstract isLeaf(rules: R): boolean

  /** The search stops on the positions that end a step once it has gone through the number of steps it is looking ahead */
  abstract isStepEnd(rules: R): boolean

  /** Score of the position for the player: the higher, the better. Must be the opposite for the opponents. */
  abstract evaluate(rules: R, player: number): number

  /** The moves to explore: the legal moves by default, override to reduce the search tree */
  getMovesOfInterest(rules: R, player: number, _depth: number): MaterialMove[] {
    return rules.getLegalMoves(player)
  }

  areTeammates(_rules: R, player1: number, player2: number) {
    return player1 === player2
  }

  private negamax(rules: R, player: number, depth = 0, steps = 0, alpha = -Infinity, beta = Infinity): NegamaxResult {
    if (depth !== 0) {
      if (this.isLeaf(rules)) {
        return { score: this.evaluate(rules, player) }
      }
      if (this.isStepEnd(rules) && ++steps >= this.steps) {
        this.limitReached = true
        return { score: this.evaluate(rules, player) }
      }
    }
    if (depth >= this.maxDepth) {
      this.limitReached = true
      return { score: this.evaluate(rules, player) }
    }

    let moves = this.getMovesOfInterest(rules, player, depth)
    if (moves.length === 0) throw new Error('You must return at least on move of interest for the active player')
    if (depth === 0 && moves.length === 1) return { score: 0, move: moves[0] }
    const scores = depth === 0 ? new Map<string, number>() : undefined
    if (depth === 0) moves = orderBy(moves, [(move) => this.rootScores.get(JSON.stringify(move)) ?? -Infinity], ['desc'])

    let best: NegamaxResult = { score: -Infinity, move: moves[0] } // Default to the first move when they all lead to a lost game
    for (const move of moves) {
      const score = this.getScore(rules, player, depth, steps, alpha, beta, move)
      scores?.set(JSON.stringify(move), score)
      if (best.score < score) {
        best = { score, move }
        alpha = Math.max(alpha, score)
        if (alpha >= beta) {
          break
        }
      }
    }
    if (scores) this.rootScores = scores // Only reached when the search is complete: an exceeded budget throws
    return best
  }

  private getScore(rules: R, player: number, depth: number, steps: number, alpha: number, beta: number, move: MaterialMove): number {
    if (++this.nodes > this.maxNodes) throw new NodesBudgetExceeded()
    const childRules = new this.Rules(cloneGame(rules.game)) as R
    playAction(childRules, move, player)
    const nextPlayer = childRules.players.find((player) => childRules.isTurnToPlay(player))
    if (nextPlayer === undefined) {
      return this.evaluate(childRules, player) // Nobody has to play: the game is over
    }
    const teammates = this.areTeammates(childRules, player, nextPlayer)
    const score = this.negamax(childRules, nextPlayer, depth + 1, steps, teammates ? alpha : -beta, teammates ? beta : -alpha).score
    return teammates ? score : -score
  }

  getBestMove(rules: R, player: number): MaterialMove {
    let bestMove = this.search(rules, player, 1, Infinity)
    if (bestMove) {
      // The search continues one step further as long as there is something left to search and the budget is not exceeded
      for (let steps = 2; steps <= this.maxSteps && this.limitReached; steps++) {
        const move = this.search(rules, player, steps, Infinity)
        if (!move) break
        bestMove = move
      }
      return bestMove
    }

    this.nodes = this.maxNodes / 2 // The iterative deepening search shares half the budget between all its depths
    bestMove = this.getMovesOfInterest(rules, player, 0)[0]
    for (let maxDepth = 1; ; maxDepth++) {
      const move = this.search(rules, player, 1, maxDepth)
      if (!move) return bestMove
      bestMove = move
      if (!this.limitReached) return bestMove
    }
  }

  /**
   * @returns the best move found within the steps and depth limits, or undefined if the nodes budget is exceeded
   */
  private search(rules: R, player: number, steps: number, maxDepth: number): MaterialMove | undefined {
    this.steps = steps
    this.maxDepth = maxDepth
    this.limitReached = false
    try {
      return this.negamax(rules, player).move
    } catch (error) {
      if (error instanceof NodesBudgetExceeded) return undefined
      throw error
    }
  }
}

class PresagesNegamax extends Negamax {
  Rules = PresagesRules

  /** Number of rounds already won when the search started */
  private roundsWon = 0

  getBestMove(rules: PresagesRules, player: number): MaterialMove {
    this.roundsWon = this.countRoundsWon(rules)
    return super.getBestMove(rules, player)
  }

  countRoundsWon(rules: PresagesRules) {
    return rules.material(MaterialType.Help).location(LocationType.Help).rotation(true).length
  }

  /** The search never goes beyond the end of the round: the next hands are dealt at random */
  isLeaf(rules: PresagesRules): boolean {
    return this.countRoundsWon(rules) !== this.roundsWon
  }

  /** A step of the search is a trick */
  isStepEnd(rules: PresagesRules): boolean {
    return rules.game.rule?.id === RuleId.Place && rules.material(MaterialType.Arcane).location(LocationType.Table).length === 0
  }

  areTeammates(rules: PresagesRules, player1: number, player2: number) {
    return rules.remind(Memory.Team, player1) === rules.remind(Memory.Team, player2)
  }

  getMovesOfInterest(rules: PresagesRules, player: number, depth: number): MaterialMove[] {
    const legalMoves = super.getMovesOfInterest(rules, player, depth)
    const ruleId = rules.game.rule?.id
    // The Secret is not searched: show a random card to a random teammate, or let the other player show a random card
    if (ruleId === RuleId.TheSecretForMe) {
      const showToTeammate = legalMoves.filter((move) => isMoveItem(move) && this.areTeammates(rules, player, move.location.player!))
      return [sample(showToTeammate.length ? showToTeammate : legalMoves)!]
    }
    if (ruleId === RuleId.TheSecretForOther) {
      return [sample(legalMoves)!]
    }
    // The Absolute: deep in the search tree, a player gives a card to its partner when possible.
    // Otherwise, only its worst card is considered to be given to an opponent.
    if (ruleId === RuleId.TheAbsolute) {
      if (depth > 1) {
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

  /**
   * Weighted sum, from the most to the least important:
   * - rounds won by the teams (a team wins the game on its second round),
   * - hand sizes (the round ends when a player has 1 card or less, and is won by the player with the fewest cards),
   * - order of play in the next trick (playing last is better),
   * - quality of the cards in hand (see {@link getCardValue}).
   *
   * When the search is cut in the middle of a trick, the cards on the table are counted as if they were still in the hands of their
   * owners, so that the players who have already played are not favored.
   *
   * Once the round is over, only the rounds won count: the new hands are random, they say nothing about the moves that led there.
   */
  evaluate(rules: PresagesRules, player: number): number {
    if (rules.isOver()) {
      return rules.remind<number[]>(Memory.Winners).includes(player) ? Infinity : -Infinity
    }
    if (this.isLeaf(rules)) {
      return this.evaluateWinRounds(rules, player) * 1000
    }
    return (
      this.evaluateWinRounds(rules, player) * 1000 +
      this.evaluateRemainingCards(rules, player) * 100 +
      this.evaluateStartingPlayer(rules, player) * 10 +
      this.evaluateHandsQuality(rules, player)
    )
  }

  /** Cards in hands and on the table */
  getCards(rules: PresagesRules) {
    return rules.material(MaterialType.Arcane).location((location) => location.type === LocationType.Hand || location.type === LocationType.Table)
  }

  evaluateWinRounds(rules: PresagesRules, player: number) {
    const helpCards = rules.material(MaterialType.Help).location(LocationType.Help).rotation(true).getItems()
    return sumBy(helpCards, (card) => (this.areTeammates(rules, player, card.location.player!) ? 1 : -1))
  }

  evaluateRemainingCards(rules: PresagesRules, player: number) {
    return sumBy(rules.players, (otherPlayer) => {
      const hand = this.getCards(rules).player(otherPlayer).length
      const value = hand === 2 ? 6 : hand === 3 ? 3 : hand === 4 ? 1 : 0
      return this.areTeammates(rules, player, otherPlayer) ? value : -value
    })
  }

  evaluateStartingPlayer(rules: PresagesRules, player: number) {
    const startingPlayer = rules.remind<number>(Memory.FirstPlayer)
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
    const cards = this.getCards(rules)
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
