/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ArcaneCard, getColors, isAbsolute } from '@gamepark/presages/material/ArcaneCard'
import { Color } from '@gamepark/presages/material/Color'
import { MaterialHelpProps, Picture } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Important from '../../images/icons/important.png'
import Help from '../../images/icons/help.jpg'
import { getHtmlColor } from '../../utils/color'
import { TransComponents } from '../../utils/trans.components'

export const ArcaneHelp: FC<MaterialHelpProps> = (props) => {
  const { item } = props
  const { t } = useTranslation()
  if (!item.id) return null
  return (
    <>
      <h2>{t(isAbsolute(item.id) ? `card.absolute` : `card.${item.id}`)}</h2>
      <div css={minWidthCss}>
        <div css={getTitleBackground(item)}>{t('help.arcane.effect')}</div>
        <p css={[littleCss, effectCss, item.id !== ArcaneCard.TheMischief && borderedCss(getColors(item.id)[0])]}>
          <Trans
            defaults={isAbsolute(item.id) ? `card.absolute.desc` : `card.${item.id}.desc`}
            components={TransComponents}
          />
        </p>

        <div css={[precisionsCss, littleCss]}>
          <div css={css`width: 100%; display: flex; align-items: flex-end`}>
            <span css={blueCss}>
              <Trans defaults="help.arcane.precision" components={TransComponents}/>
            </span>
            <Picture src={Help} css={helpImageCss} />
          </div>
          <ul css={listCss}>
            <li><Trans defaults="help.arcane.precision.1" components={TransComponents}/></li>
            <li><Trans defaults="help.arcane.precision.2" components={TransComponents}/></li>
            <li><Trans defaults="help.arcane.precision.3" components={TransComponents}/></li>
            <li><Trans defaults="help.arcane.precision.4" components={TransComponents}/></li>
            <li><Trans defaults="help.arcane.precision.5" components={TransComponents}/></li>
          </ul>
          <div css={importantCss}>
          <span>
            <Picture src={Important} css={importantImageCss}/>
          </span>
            <div>
              <Trans defaults="help.arcane.important" components={TransComponents}/>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const borderedCss = (color: Color) => css`
  border: 0.2em solid ${getHtmlColor(color)};
  border-radius: 0 0 0.5em 0.5em;
  padding: 0.5em;
`

const importantCss = css`
  display: flex;
  flex-direction: row;
  border: 0.2em solid #CF3745;
  padding: 0.5em;
  margin-right: 1.5em;
  border-radius: 0.5em;
  white-space: pre-wrap;
`

const importantImageCss = css`
  height: 3em;
  padding-right: 1em;
`

const helpImageCss = css`
  height: 2.7em;
  border-radius: 0.5em;
  margin-right: 1.7em;
  transform: translateY(25%);
`

const precisionsCss = css`
  position: absolute;
  bottom: 1.5em;
`

const littleCss = css`
  font-size: 0.8em;
`

const listCss = css`
  margin-top: 0.5em;
  margin-bottom: 1.5em;

  li {
    margin-bottom: 0.05em;
  }

  li::marker {
    color: #43ade2;
  }
`

const blueCss = css`
  font-weight: bold;
  color: #43ade2;
  width: 100%;
`

const effectCss = css`
  margin-top: 0;
`

const getTitleBackground = (item: Partial<MaterialItem>) => css`

  padding: 0.3em 0.5em 0.1em;
  margin-top: 1em;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  border-top-left-radius: 0.5em;
  border-top-right-radius: 0.5em;
  background-color: ${getHtmlColor(getColors(item.id)[0])}
`

const minWidthCss = css`
  min-width: 52dvw;
  min-width: 52vw;
`