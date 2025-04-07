/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/game-template/rules/RuleId'
import { ComponentType } from 'react'
import { TheFirstStepHeader } from './TheFirstStepHeader'
import { TheLawHeader } from './TheLawHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.Deal]: TheFirstStepHeader,
  [RuleId.TheLaw]: TheLawHeader
}
