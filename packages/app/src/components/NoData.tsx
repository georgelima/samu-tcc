import React from 'react'
import styled from 'styled-components'
import { Typography } from '@material-ui/core'

import { NoDataPicture } from './NoDataPicture'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Text = styled(Typography)`
  && {
    position: absolute;
    top: 50%;
    left: 30%;
  }
`

export const NoData = () => (
  <Wrapper>
    <NoDataPicture />
    <Text variant='caption' color='primary'>
      Dados insuficientes
    </Text>
  </Wrapper>
)
