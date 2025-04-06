import { MaterialGameSetup } from '@gamepark/rules-api'
import { partition } from 'lodash'
import max from 'lodash/max'
import min from 'lodash/min'
import shuffle from 'lodash/shuffle'
import { arcanes } from './material/ArcaneCard'
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
export class PresageSetup extends MaterialGameSetup<PlayerId, MaterialType, LocationType, PresagesOptions> {
  Rules = PresagesRules

  setupMaterial(_options: PresagesOptions) {
    this.setupCards()
    this.setupAbsolute()
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
    const absolutes = shuffle(arcanes.filter((a) => a >= 30)).slice(0, this.players.length)
    const minAbsolute = min(absolutes)
    const maxAbsolute = max(absolutes)

// Répartition des joueurs avec lodash.partition
    const [extremePlayers, otherPlayers] = partition(this.players, (_: PlayerId, i: number) => {
      const absolute = absolutes[i]
      return absolute === minAbsolute || absolute === maxAbsolute
    })

// Création des items pour tous les joueurs
    this.players.forEach((player, i) => {
      this.material(MaterialType.Arcane).createItem({
        id: absolutes[i],
        location: {
          type: LocationType.Hand,
          player
        }
      })
    })

    extremePlayers.forEach((player) => this.memorize(Memory.Teams, 1, player as PlayerId))
    otherPlayers.forEach((player) => this.memorize(Memory.Teams, 2, player as PlayerId))
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
