import React from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Add, PieChart, Home, ListAlt } from '@material-ui/icons'
import { match } from 'react-router-dom'
import { History } from 'history'

import { Header } from './Header'

type Props = {
  history: History
  match: match
}

type State = {
  showDrawer: boolean
}

const ROUTES = [
  { route: '/', label: 'Início', icon: <Home /> },
  { route: '/novo', label: 'Novo Atendimento', icon: <Add /> },
  { route: '/consulta', label: 'Listar Atendimentos', icon: <ListAlt /> },
  { route: '/relatorios', label: 'Relatórios', icon: <PieChart /> },
]

export class Layout extends React.PureComponent<Props, State> {
  state = {
    showDrawer: false,
  }

  toggleDrawer = () => this.setState(state => ({ showDrawer: !state.showDrawer }))

  render() {
    return (
      <>
        <Drawer open={this.state.showDrawer} onClose={() => this.toggleDrawer()}>
          <div style={{ width: 250 }}>
            <List>
              {ROUTES.map(({ route, label, icon }) => (
                <ListItem
                  selected={route === this.props.match.path}
                  button
                  onClick={() => this.props.history.push(route)}
                  key={`layout-menu-item-${label}`}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
        <Header toggleDrawer={this.toggleDrawer} />
        {this.props.children}
      </>
    )
  }
}
