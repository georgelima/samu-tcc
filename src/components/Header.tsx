import React from 'react'

import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

type Props = {
  toggleDrawer: Function
}

type State = {
  now: Date
}

export class Header extends React.PureComponent<Props, State> {
  interval: NodeJS.Timeout | null = null
  state = {
    now: new Date(),
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        now: new Date(),
      })
    }, 1000)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  render() {
    return (
      <div style={{ flexGrow: 1, marginBottom: '55px' }}>
        <AppBar position='fixed'>
          <Toolbar variant='dense' style={{ justifyContent: 'space-between' }}>
            <IconButton color='inherit' aria-label='Menu' onClick={() => this.props.toggleDrawer()}>
              <MenuIcon />
            </IconButton>
            <Link to='/' style={{ textDecoration: 'none', color: 'white', outline: 'none' }}>
              <Typography variant='h6' color='inherit'>
                WebSAMU
              </Typography>
            </Link>
            <Button color='primary' disabled style={{ color: 'white' }}>
              {format(this.state.now, 'HH:mm:ss DD/MM/YYYY')}
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
