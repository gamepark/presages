import { PresagesBot } from '@gamepark/presages/PresagesBot.ts'
import { PresagesOptionsSpec } from '@gamepark/presages/PresagesOptions.ts'
import { PresagesRules } from '@gamepark/presages/PresagesRules.ts'
import { PresagesSetup } from '@gamepark/presages/PresagesSetup.ts'
import { GameAI, GameProvider, setupTranslation } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { PresagesLogs } from './logs/PresagesLogs.ts'
import { Material } from './material/Material'
import translations from './translations.json'
import { Tutorial } from './tutorial/Tutorial.tsx'

setupTranslation(translations, { debug: false })

const TutorialBot: GameAI = (game: MaterialGame, player: number) => Promise.resolve(PresagesBot(game, player))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="presages"
      Rules={PresagesRules}
      optionsSpec={PresagesOptionsSpec}
      GameSetup={PresagesSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
      tutorial={new Tutorial()}
      logs={new PresagesLogs()}
      ai={TutorialBot}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
