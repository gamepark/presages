/** @jsxImportSource @emotion/react */
import { GameTemplateOptionsSpec } from '@gamepark/presages/PresagesOptions'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { PresagesSetup } from '@gamepark/presages/PresagesSetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { gameAnimations } from './animations/GameAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

ReactDOM.render(
  <StrictMode>
    <GameProvider
      game="presages"
      Rules={PresagesRules}
      optionsSpec={GameTemplateOptionsSpec}
      GameSetup={PresagesSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
    >
      <App />
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
