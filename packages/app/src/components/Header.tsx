import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'

import { AppBar, Toolbar as MuiToolbar, Typography, Button, IconButton } from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

import { Auth } from '../services/auth'

type Props = {
  toggleDrawer: Function
  history: RouteComponentProps['history']
}

type State = {
  now: Date
}

const Wrapper = styled.div`
  flex-grow: 1;
  margin-bottom: 55px;
`

const Toolbar = styled(MuiToolbar)`
  && {
    justify-content: space-between;
  }
`

export const Header = ({ toggleDrawer, history }: Props) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)

    return () => {
      clearInterval(interval)
    }
  })

  return (
    <Wrapper>
      <AppBar position='fixed'>
        <Toolbar variant='dense'>
          <IconButton color='inherit' aria-label='Menu' onClick={() => toggleDrawer()}>
            <MenuIcon />
          </IconButton>
          <Link to='/' style={{ textDecoration: 'none', color: 'white', outline: 'none' }}>
            <Typography variant='h6' color='inherit'>
              WebSAMU
            </Typography>
          </Link>
          <div>
            <Button color='primary' disabled style={{ color: 'white' }}>
              {format(now, 'HH:mm:ss DD/MM/YYYY')}
            </Button>
            <Button
              color='primary'
              style={{ color: 'white' }}
              onClick={() => {
                Auth.signout()
                history.push('/entrar')
              }}
            >
              SAIR
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </Wrapper>
  )
}
