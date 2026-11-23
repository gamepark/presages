import { playAction } from '@gamepark/rules-api'
import { isEqual } from 'es-toolkit'
import { describe, expect, it } from 'vitest'
import { Memory } from './Memory'
import { PresagesBot } from './PresagesBot'
import { PresagesRules } from './PresagesRules'
import { PresagesSetup } from './PresagesSetup'

describe('PresagesBot', () => {
  // A small budget keeps the test fast and goes through every kind of search: several tricks ahead, one trick, and iterative deepening
  it.each([4, 5, 6])('plays a whole game with %i players, only with legal moves', { timeout: 60000 }, (players) => {
    const rules = new PresagesRules(new PresagesSetup().setup({ players }))
    for (let moves = 0; !rules.isOver(); moves++) {
      expect(moves).toBeLessThan(1000)
      const player = rules.players.find((player) => rules.isTurnToPlay(player))!
      const [move] = PresagesBot(rules.game, player, 50)
      expect(rules.getLegalMoves(player).some((legalMove) => isEqual(legalMove, move))).toBe(true)
      playAction(rules, move, player)
    }
    expect(rules.remind(Memory.Winners)).toBeDefined()
  })
})
