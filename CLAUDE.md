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
| Game options | `features/game-options.md` |
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
  ├── PresagesOptions.ts      # OptionsSpecV2: option structure, no text
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

### Filter the Material, never loop over indexes
Keep selections as `Material` (`filter((item, index) => …)`, `id(predicate)`…) and call `moveItems` on
the result; never `getIndexes().map(i => this.material(X).index(i)…)`. Helpers return `Material`, not
`number[]`. See `features/item-moves.md#filter-items`.

## Lint

After changing code, run `yarn lint` at the root alongside the `tsc` check — once per batch of
changes. It runs **oxlint** (config in `.oxlintrc.json`) and catches what `tsc` cannot, chiefly the
React hooks rules in `app/` (`rules-of-hooks`, `exhaustive-deps`). Fix its warnings rather than
silencing them; a disable comment needs a reason.

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

:bulb: The same native-language rule applies to `app/public/options/*.json`.

### Where translations are used
- `app/public/translation/*.json` — UI texts (headers, dialogs, tooltips, logs, tutorial)
- `headers/*.tsx` — `<Trans i18nKey="..." />` to display in-game messages
- `utils/trans.components.tsx` — shared components injected in `<Trans>` (icons, colors…)

## Commands

```bash
yarn dev     # Start the game on http://localhost:3000
yarn build   # tsc -b && vite build (app)
yarn lint    # oxlint on rules + app
yarn test    # vitest on rules + app
yarn deploy  # build + push to the S3 bucket
```

## Game Options

Options are declared in `rules/src/PresagesOptions.ts` with `OptionsSpecV2` — **plain JSON, no functions
and no text**. The platform snapshots it when the bundle is prepared and reads it from its database.

Three things do **not** belong in it:

- **Texts** go to `app/public/options/{locale}.json`, keyed by convention: `option.<option>`,
  `option.<option>.<value>`, `identities.<value>`, plus optional `.help` and `.warn` variants. Values
  are addressed by value, so `PlayerColor.Blue = 1` gives `identities.1`.
- **`subscriberRequired`, `competitiveDisabled`, `competitivePlayers`** belong to the platform database.
- **`validate`** no longer exists. Express constraints as `playerCount` (on an option or a value),
  `requires` on a value, or a `forbidden-combination` rule whose `message` is a key in the options
  document.

Read `features/game-options.md` before changing this file — the shape is precise and the platform
depends on it. Never reintroduce a v1 `OptionsSpec`.

## Backward Compatibility

The game is in production (`rules/package.json` version ≥ 1.0.0) and saved games store enum values as
numbers (`MaterialType`, `LocationType`, `RuleId`, `Memory`, ids…): backward compatibility wins. Never
shift existing values: append new ones at the end, and keep every game already started playable.

## When Helping

1. **Always read existing code first** before suggesting changes
2. **Follow established patterns** in the codebase
3. **Test incrementally** - suggest testing after each major change
4. **Reference documentation** when explaining concepts
