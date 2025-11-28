import { useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { createPortal } from 'react-dom'
import { PresagesPlayerPanel } from './PresagesPlayerPanel'

export const PlayerPanels = () => {
  const rules = useRules<MaterialRules>()!
  const players = rules.game.players
  const root = document.getElementById('root')
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player) => (
        <PresagesPlayerPanel key={player} playerId={player} />
      ))}
    </>,
    root
  )
}
