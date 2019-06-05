import React from 'react'

import { Loader } from './Loader'

export const FullLoader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 'calc(100vh - 100px)',
    }}
  >
    <Loader />
  </div>
)
