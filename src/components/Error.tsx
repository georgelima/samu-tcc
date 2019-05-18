import React from 'react'

import { Typography } from '@material-ui/core'

import { ServerDownPicture } from './ServerDownPicture'

const style = {
  height: 'calc(100vh - 50px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}

export const ErrorComponent = ({ message }: { message: string }) => (
  // @ts-ignore
  <div style={style}>
    <ServerDownPicture />
    <Typography variant='h5' color='primary' style={{ marginTop: 30 }}>
      {message}
    </Typography>
  </div>
)
