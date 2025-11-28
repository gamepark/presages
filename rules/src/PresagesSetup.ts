import { MaterialGameSetup, MaterialItem } from '@gamepark/rules-api'
import { partition, range, shuffle } from 'es-toolkit'
import { max, min } from 'es-toolkit/compat'
import { absolutes, ArcaneCard, arcanes } from './material/ArcaneCard'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Memory } from './Memory'
import { PlayerId } from './PlayerId'
import { PresagesOptions } from './PresagesOptions'
import { PresagesRules } from './PresagesRules'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class PresagesSetup extends MaterialGameSetup<PlayerId, MaterialType, LocationType, PresagesOptions> {
  Rules = PresagesRules

  setupMaterial(options: PresagesOptions) {
    this.setupTeamsWithAbsolutes(options)
    this.setupCards()
  }

  setupCards() {
    const other = shuffle(arcanes.filter((a) => a < 30))

    this.material(MaterialType.Arcane).createItems(
      other.map((a) => ({
        id: a,
        location: {
          type: LocationType.Deck
        }
      }))
    )
  }

  setupTeamsWithAbsolutes(options: PresagesOptions) {
    const players = options.players < 4 ? options.players * 2 : options.players
    let absolutesInGame = shuffle(absolutes).slice(0, players)
    if (options.players < 4) {
      // Make sure real players are not in the same team
      while (!this.firstHalfMakesDifferentTeams(absolutesInGame)) {
        absolutesInGame = shuffle(absolutes).slice(0, players)
      }
      this.game.players = range(1, options.players * 2 + 1)
      for (let i = this.game.players.length / 2; i < this.game.players.length; i++) {
        this.memorize(Memory.Bot, true, this.game.players[i])
      }
    }
    this.material(MaterialType.Arcane).createItems(
      this.players.map((player, i) => ({ id: absolutesInGame[i], location: { type: LocationType.Table, player } }))
    )
    const minAbsolute = min(absolutesInGame)
    const maxAbsolute = max(absolutesInGame)
    const [team1, others] = partition(this.players, (id) => absolutesInGame[id - 1] === minAbsolute || absolutesInGame[id - 1] === maxAbsolute)
    for (const player of team1) {
      this.markInTeam(player, 1)
    }
    if (others.length < 4) {
      for (const player of others) {
        this.markInTeam(player, 2)
      }
    } else {
      const [team2, team3] = partition(others, (id) => absolutesInGame[id - 1] === 31 || absolutesInGame[id - 1] === 34)
      for (const player of team2) {
        this.markInTeam(player, 2)
      }
      for (const player of team3) {
        this.markInTeam(player, 3)
      }
    }
    if (options.players < 4) {
      // Randomize position of players and bots
      this.game.players = shuffle(this.game.players)
    }
  }

  firstHalfMakesDifferentTeams(cards: number[]) {
    if (cards.length === 4) {
      return cards.indexOf(max(cards)!) < 2 !== cards.indexOf(min(cards)!) < 2
    } else {
      return cards.indexOf(30) < 3 !== cards.indexOf(35) < 3 && cards.indexOf(31) < 3 !== cards.indexOf(34) < 3
    }
  }

  markInTeam(player: PlayerId, team: number) {
    this.material(MaterialType.Help).createItem({ id: team, location: { type: LocationType.Help, player: player } })
    this.memorize(Memory.Team, team, player)
  }

  get playerWithMaxAbsolute(): PlayerId {
    return this.material(MaterialType.Arcane)
      .location(LocationType.Table)
      .maxBy((i: MaterialItem) => i.id as ArcaneCard)
      .getItem()!.location.player!
  }

  start() {
    const firstPlayer = this.playerWithMaxAbsolute
    this.memorize(Memory.FirstPlayer, firstPlayer)
    this.startRule(RuleId.Deal)
  }
}
