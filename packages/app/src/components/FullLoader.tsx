import React from 'react'
import styled from 'styled-components'

import { Loader } from './Loader'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);
`

export const FullLoader = () => (
  <Wrapper>
    <Loader />
  </Wrapper>
)
