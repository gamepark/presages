import { ArcaneCard } from '../../../material/ArcaneCard'
import { Memory } from '../../../Memory'
import { ArcaneEffect } from '../ArcaneEffect'

export class ThePrideDescription extends ArcaneEffect {
  afterResolution(card: ArcaneCard) {
    this.memorize(Memory.FirstPlayer, this.leftPlayerFor(card))
  }

  leftPlayerFor(card: ArcaneCard) {
    const player = this.table.find((c) => c.id === card)!.location.player!
    return this.game.players[(this.game.players.indexOf(player) + 1) % this.game.players.length]
  }
}