import React from 'react'
import styled from 'styled-components'

// @ts-ignore
import ReactSpinnerLoader from 'react-loader-spinner'

type Props = {
  type?:
    | 'Audio'
    | 'Ball-Triangle'
    | 'Bars'
    | 'Circles'
    | 'Grid'
    | 'Hearts'
    | 'Oval'
    | 'Puff'
    | 'Rings'
    | 'TailSpin'
    | 'ThreeDots'
    | 'CradleLoader'
    | 'Triangle'
  height?: number
  width?: number
}

const Wrapper = styled.div`
  display: flex;
  alignitems: center;
  justifycontent: center;
`

export const Loader = ({ type = 'Triangle', height = 50, width = 50 }: Props) => (
  <Wrapper>
    <ReactSpinnerLoader type={type} height={height} width={width} color='#FF0000' />
  </Wrapper>
)
