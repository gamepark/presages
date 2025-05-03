/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MoveComponentProps } from '@gamepark/react-game/dist/components/History'
import { CustomMove } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const TheLawLog: FC<MoveComponentProps> = (props) => {
  const move: CustomMove = props.move

  return (
    <>
      <span css={textCss}>
        <Trans defaults={move.data > 0 ? 'log.the-law.more' : 'log.the-law.less'} components={{ bold: <strong /> }} />
      </span>
    </>
  )
}

const textCss = css`
  flex: 1;
`
