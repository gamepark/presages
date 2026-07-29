# Game Park Framework - Instructions for Claude

This project adapts **Présages** (Maxime Rambourg / Spiral Editions) using the **Game Park framework**.

## Documentation

Official documentation: https://gamepark.github.io

For Claude to read the documentation, use raw GitHub URLs:
```
https://raw.githubusercontent.com/gamepark/gamepark.github.io/main/docs/[path]
```

### Key documentation files
| Topic | Path |
|-------|------|
| Core concepts | `concepts/core-concepts.md` |
| Items & Locations | `concepts/items-and-locations.md` |
| Hiding data | `concepts/hiding-data.md` |
| Item moves | `features/item-moves.md` |
| Rule moves | `features/rule-moves.md` |
| Custom moves | `features/custom-moves.md` |
| Location strategies | `features/location-strategies.md` |
| Hand of cards | `features/hand-of-cards.md` |
| Piles of items | `features/piles-of-items.md` |
| Tutorial AI | `features/tutorial-ai.md` |
| Final scoring | `features/final-scoring.md` |
| Upgrade the framework | `tips/upgrade-the-framework.md` |

### Release notes & migration guides
`release-notes/v7.0.md` … `release-notes/v7.7.md`, and
`troubleshooting/v7-migration-guide.md`, `troubleshooting/v7.3-migration-guide.md`, `troubleshooting/v7.7-migration-guide.md`

### Checklist
Full checklist: `step-by-step-example/checklist.md`

## Project Structure

```
rules/src/                    # Server-side game logic
  ├── material/
  │   ├── MaterialType.ts     # Game components enum (Arcane, Help)
  │   ├── LocationType.ts     # Possible locations enum
  │   ├── ArcaneCard.ts       # Card ids
  │   └── Color.ts
  ├── rules/
  │   ├── RuleId.ts           # Game phases enum
  │   ├── *Rule.ts            # Rule implementations
  │   ├── immediate-effect/   # One rule per Arcane immediate effect
  │   └── arcane/description/ # One description per Arcane card effect
  ├── PresagesRules.ts        # Main rules class
  ├── PresagesSetup.ts        # Initial game setup
  ├── PresagesOptions.ts      # Game configuration
  └── PresagesBot.ts          # AI used for the tutorial & automatic moves

app/src/                      # Client-side React UI
  ├── material/               # Visual descriptions (sizes, images, help)
  ├── locators/               # Positioning on screen
  ├── headers/                # In-game text display, one per RuleId
  ├── logs/                   # Journal / live log components
  ├── panels/                 # Player panels
  ├── tutorial/               # Tutorial script & setup
  └── images/                 # Game assets
```

## Core Concepts

### MaterialItem
Every game element is an item with a location:
```typescript
{ id: ArcaneCard.TheLife, location: { type: LocationType.Hand, player: 1 } }
```

### Location properties
- `type`: LocationType (required)
- `player`: Owner player
- `id`: Location variant
- `x`, `y`: Grid coordinates
- `parent`: Index of parent item
- `rotation`: used here to carry the card `Visibility`

### Rules
- Extend `PlayerTurnRule` (one player acts) or `SimultaneousRule` (all players act)
- Implement `getPlayerMoves()` to define legal moves
- Use `afterItemMove()` or `onRuleStart()` for consequences
- Transition with `this.startRule(RuleId.Next)` or `this.endGame()`

## Console Commands (browser)

```javascript
game.new(playerCount)      // Start new game
game.view                  // Current game state
game.legalMoves            // Available moves
game.undo()                // Undo last move
game.monkeyOpponents(true) // Auto-play opponents
```

## Translations

Since framework v7.7, translations live in the repository: `app/public/translation/{locale}.json`
(one flat JSON file per language: `en.json`, `fr.json`, `de.json`, `es.json`, `it.json`, `ru.json`).

:warning: Do **not** add framework keys (`common`, `credits` namespaces) to those files — they are served by
game-park.com. If a game component needs one, specify the namespace: `t('Close', { ns: 'common' })`.

### Translation workflow

**During development**: only write translations in the **developer's native language** file (`fr.json`).
Do not touch other language files — this saves tokens. Add `?locale=fr` to the dev URL to test.

**Before production release**: when asked, translate all texts into every other supported language in a dedicated pass.

### Where translations are used
- `app/public/translation/*.json` — UI texts (headers, dialogs, tooltips, logs, tutorial)
- `headers/*.tsx` — `<Trans i18nKey="..." />` to display in-game messages
- `utils/trans.components.tsx` — shared components injected in `<Trans>` (icons, colors…)

## Commands

```bash
yarn dev     # Start the game on http://localhost:3000
yarn build   # tsc -b && vite build (app)
yarn lint    # eslint on rules + app
yarn test    # vitest on rules + app
yarn deploy  # build + push to the S3 bucket
```

## When Helping

1. **Always read existing code first** before suggesting changes
2. **Follow established patterns** in the codebase
3. **Test incrementally** - suggest testing after each major change
4. **Reference documentation** when explaining concepts
