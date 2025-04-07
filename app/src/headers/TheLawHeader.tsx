/** @jsxImportSource @emotion/react */
import { CustomMoveType } from '@gamepark/game-template/rules/CustomMoveType'
import { PlayMoveButton, useLegalMove } from '@gamepark/react-game'
import { isCustomMoveType } from '@gamepark/rules-api'

export const TheLawHeader = () => {
  const minus15 = useLegalMove((move) => isCustomMoveType(CustomMoveType.TheLaw)(move) && move.data === -15)
  const plus15 = useLegalMove((move) => isCustomMoveType(CustomMoveType.TheLaw)(move) && move.data === 15)

  return (
    <>
      <PlayMoveButton move={minus15}>
        Less than 15
      </PlayMoveButton>

      <PlayMoveButton move={plus15}>
        More than 15
      </PlayMoveButton>
    </>
  )
}
