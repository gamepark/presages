import { MaterialGameSetup } from '@gamepark/rules-api'
import { partition } from 'lodash'
import max from 'lodash/max'
import min from 'lodash/min'
import shuffle from 'lodash/shuffle'
import { absolutes, arcanes } from './material/ArcaneCard'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { Memory } from './Memory'
import { PlayerId } from './PlayerId'
import { PresagesOptions } from './PresagesOptions'
import { PresagesRules } from './PresagesRules'
import { RuleId } from './rules/RuleId'
import { Visibility } from './rules/Visibility'

/**
 * This class creates a new Game based on the game options
 */
export class PresageSetup extends MaterialGameSetup<PlayerId, MaterialType, LocationType, PresagesOptions> {
  Rules = PresagesRules

  setupMaterial(_options: PresagesOptions) {
    this.setupAbsolute()
    this.setupCards()
  }

  setupCards() {
    const other = shuffle(arcanes.filter((a) => a < 30))

    this.material(MaterialType.Arcane)
      .createItems(other.map((a) => ({
        id: a,
        location: {
          type: LocationType.Deck
        }
      })))
  }

  setupAbsolute() {
    if (this.players.length === 5) {
      this.setupFivePlayers()
    } else {
      this.setupFourAndSixPlayers()
    }
  }

  setupFourAndSixPlayers()  {
    const allAbsolutes = shuffle(absolutes).slice(0, this.players.length)

    this.material(MaterialType.Arcane)
      .createItems(this.players.map((p, i) => ({
        id: allAbsolutes[i],
        location: {
          type: LocationType.Hand,
          player: p,
          rotation: Visibility.VISIBLE_FOR_ME
        }
      })))

    let remainingAbsolutes = allAbsolutes
    for (let i = 1; i <= (this.players.length / 2); i++) {

      const minAbsolute = min(remainingAbsolutes)
      const maxAbsolute = max(remainingAbsolutes)
      remainingAbsolutes = remainingAbsolutes.filter((a) => a !== minAbsolute && a !== maxAbsolute)
      const firstPlayer: PlayerId = this.material(MaterialType.Arcane).id(minAbsolute).getItem()!.location.player!
      this.markInTeam(firstPlayer, i)

      const secondPlayer: PlayerId = this.material(MaterialType.Arcane).id(maxAbsolute).getItem()!.location.player!
      this.markInTeam(secondPlayer, i)
    }
  }

  setupFivePlayers() {
    const cards = shuffle(absolutes).slice(0, this.players.length)
    const minAbsolute = min(cards)
    const maxAbsolute = max(cards)

    const [extremePlayers, otherPlayers] = partition(this.players, (_: PlayerId, i: number) => {
      const absolute = cards[i]
      return absolute === minAbsolute || absolute === maxAbsolute
    })

    this.players.forEach((player, i) => {
      this.material(MaterialType.Arcane).createItem({
        id: cards[i],
        location: {
          type: LocationType.Hand,
          player,
          rotation: Visibility.VISIBLE_FOR_ME
        }
      })
    })

    extremePlayers.forEach((player) => this.markInTeam(player as PlayerId, 1))
    otherPlayers.forEach((player) => this.markInTeam(player as PlayerId, 2))
  }

  markInTeam(player: PlayerId, team: number) {
    this.material(MaterialType.Help).createItem({ id: team, location: { type: LocationType.Help, player: player as PlayerId } })
    this.memorize(Memory.Teams, team, player)
  }

  get playerWithMaxAbsolute() {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .maxBy((i) => i.id)!
      .getItem()!
      .location
      .player
  }

  start() {
    this.memorize(Memory.FirstPlayer, this.playerWithMaxAbsolute)
    this.startRule(RuleId.Deal)
  }
}
