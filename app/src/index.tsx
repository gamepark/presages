/** @jsxImportSource @emotion/react */
import { PresagesOptionsSpec } from '@gamepark/presages/PresagesOptions'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { PresagesSetup } from '@gamepark/presages/PresagesSetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { gameAnimations } from './animations/GameAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import { TutorialBot } from '@gamepark/presages/PresagesBot'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

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
