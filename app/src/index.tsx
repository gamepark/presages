/** @jsxImportSource @emotion/react */
import { GameTemplateOptionsSpec } from '@gamepark/game-template/PresagesOptions'
import { PresagesRules } from '@gamepark/game-template/PresagesRules'
import { PresagesSetup } from '@gamepark/game-template/PresagesSetup'
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
      game="game-template"
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
