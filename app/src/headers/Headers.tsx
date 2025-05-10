/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { ComponentType } from 'react'
import { DealHeader } from './DealHeader'
import { PlaceHeader } from './PlaceHeader'
import { RoundEndHeader } from './RoundEndHeader'
import { RoundResolutionHeader } from './RoundResolutionHeader'
import { ShowStarterHeader } from './ShowStarterHeader'
import { TheAbsoluteHeader } from './TheAbsoluteHeader'
import { TheAngerHeader } from './TheAngerHeader'
import { TheBetrayalHeader } from './TheBetrayalHeader'
import { TheDreamHeader } from './TheDreamHeader'
import { TheJalousieHeader } from './TheJalousieHeader'
import { TheLawHeader } from './TheLawHeader'
import { TheLuckHeader } from './TheLuckHeader'
import { TheSecretConfirmHeader } from './TheSecretConfirmHeader'
import { TheSecretForMeHeader } from './TheSecretForMeHeader'
import { TheSecretForOtherHeader } from './TheSecretForOtherHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.Deal]: DealHeader,
  [RuleId.Place]: PlaceHeader,
  [RuleId.RoundResolution]: RoundResolutionHeader,
  [RuleId.RoundEnd]: RoundEndHeader,

  [RuleId.TheLaw]: TheLawHeader,
  [RuleId.TheLuck]: TheLuckHeader,
  [RuleId.TheDream]: TheDreamHeader,
  [RuleId.TheJalousie]: TheJalousieHeader,
  [RuleId.TheSecretForMe]: TheSecretForMeHeader,
  [RuleId.TheSecretForOther]: TheSecretForOtherHeader,
  [RuleId.TheSecretConfirm]: TheSecretConfirmHeader,
  [RuleId.TheAnger]: TheAngerHeader,
  [RuleId.TheBetrayal]: TheBetrayalHeader,
  [RuleId.TheAbsolute]: TheAbsoluteHeader,
  [RuleId.ShowStarter]: ShowStarterHeader
}
