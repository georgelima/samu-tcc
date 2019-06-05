import React from 'react'

import { Typography } from '@material-ui/core'

import { NoDataPicture } from './NoDataPicture'

export const NoData = () => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <NoDataPicture />
    <Typography
      variant='caption'
      color='primary'
      style={{ position: 'absolute', top: '50%', left: '30%' }}
    >
      Dados insuficientes
    </Typography>
  </div>
)
