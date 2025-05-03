import { css } from '@emotion/react'
import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { Picture, PlayMoveButton } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC } from 'react'
import { arcaneDescription } from '../../material/ArcaneDescription'
import { pictureCss } from './styles'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const CardImageLink: FC<{ id: ArcaneCard }> = ({ id }) => {
  return (
    <PlayMoveButton move={displayMaterialHelp(MaterialType.Arcane, { id: id })} transient={true} css={buttonCss}>
      <Picture src={arcaneDescription.images[id]} css={pictureCss} />
    </PlayMoveButton>
  )
}

const buttonCss = css`
  margin-right: 1em;
`
