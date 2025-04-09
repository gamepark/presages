/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { ComponentType } from 'react'
import { DealHeader } from './DealHeader'
import { PlaceHeader } from './PlaceHeader'
import { RoundEndHeader } from './RoundEndHeader'
import { RoundResolutionHeader } from './RoundResolutionHeader'
import { TheAbsoluteHeader } from './TheAbsoluteHeader'
import { TheAngerHeader } from './TheAngerHeader'
import { TheBetrayalHeader } from './TheBetrayalHeader'
import { TheDreamHeader } from './TheDreamHeader'
import { TheJalousieHeader } from './TheJalousieHeader'
import { TheLawHeader } from './TheLawHeader'
import { TheLuckHeader } from './TheLuckHeader'
import { TheSecretChoiceHeader } from './TheSecretChoiceHeader'
import { TheSecretHeader } from './TheSecretHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.Deal]: DealHeader,
  [RuleId.Place]: PlaceHeader,
  [RuleId.RoundResolution]: RoundResolutionHeader,
  [RuleId.RoundEnd]: RoundEndHeader,

  [RuleId.TheLaw]: TheLawHeader,
  [RuleId.TheLuck]: TheLuckHeader,
  [RuleId.TheDream]: TheDreamHeader,
  [RuleId.TheJalousie]: TheJalousieHeader,
  [RuleId.TheSecretChoice]: TheSecretChoiceHeader,
  [RuleId.TheSecret]: TheSecretHeader,
  [RuleId.TheAnger]: TheAngerHeader,
  [RuleId.TheBetrayal]: TheBetrayalHeader,
  [RuleId.TheAbsolute]: TheAbsoluteHeader,
}