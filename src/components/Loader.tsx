import React from 'react'

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

export const Loader = ({ type = 'Triangle', height = 50, width = 50 }: Props) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <ReactSpinnerLoader type={type} height={height} width={width} color='#FF0000' />
  </div>
)
