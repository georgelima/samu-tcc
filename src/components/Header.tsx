import React from 'react'

import { AppBar, Toolbar, Typography } from '@material-ui/core'

export const Header = () => (
  <div>
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit">
          WebSAMU
        </Typography>
      </Toolbar>
    </AppBar>
  </div>
)
