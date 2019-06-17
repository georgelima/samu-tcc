import React, { useState } from 'react'
import styled from 'styled-components'
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Add, PieChart, Home, ListAlt } from '@material-ui/icons'
import { match } from 'react-router-dom'
import { History } from 'history'

import { Header } from './Header'

type Props = {
  history: History
  match: match
  children: React.ReactElement | React.ReactElement[]
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

const Wrapper = styled.div`
  width: 250px;
`

export const Layout = ({ history, match, children }: Props) => {
  const [showDrawer, setShowDrawer] = useState(false)

  return (
    <>
      <Drawer open={showDrawer} onClose={() => setShowDrawer(!showDrawer)}>
        <Wrapper>
          <List>
            {ROUTES.map(({ route, label, icon }) => (
              <ListItem
                selected={route === match.path}
                button
                onClick={() => history.push(route)}
                key={`layout-menu-item-${label}`}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItem>
            ))}
          </List>
        </Wrapper>
      </Drawer>
      <Header toggleDrawer={() => setShowDrawer(!showDrawer)} history={history} />
      {children}
    </>
  )
}
