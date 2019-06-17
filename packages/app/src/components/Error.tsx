import React from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'

import { ServerDownPicture } from './ServerDownPicture'

const Wrapper = styled.div`
  height: calc(100vh - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Error = styled(Typography)`
  && {
    margin-top: 30px;
  }
`

export const ErrorComponent = ({ message }: { message: string }) => (
  // @ts-ignore
  <Wrapper>
    <ServerDownPicture />
    <Error variant='h5' color='primary'>
      {message}
    </Error>
  </Wrapper>
)
