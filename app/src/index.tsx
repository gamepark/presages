/** @jsxImportSource @emotion/react */
import { PresagesBot } from '@gamepark/presages/PresagesBot'
import { PresagesOptionsSpec } from '@gamepark/presages/PresagesOptions'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { PresagesSetup } from '@gamepark/presages/PresagesSetup'
import { GameAI, GameProvider, setupTranslation } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { gameAnimations } from './animations/GameAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

const TutorialBot: GameAI = (game: MaterialGame, player: number) => Promise.resolve(PresagesBot(game, player))

ReactDOM.render(
  <StrictMode>
    <GameProvider
      game="presages"
      Rules={PresagesRules}
      optionsSpec={PresagesOptionsSpec}
      GameSetup={PresagesSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
      ai={TutorialBot}
    >
      <App />
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
