import React, { useState } from 'react'
import styled from 'styled-components'
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { Add, PieChart, Home, ListAlt, SupervisedUserCircleOutlined } from '@material-ui/icons'
import { match } from 'react-router-dom'
import { History } from 'history'

import { Header } from './Header'

import { useQuery } from '../hooks/useQuery'
import { currentUser } from '../services/api'

type Props = {
  history: History
  match: match
  children: React.ReactElement | React.ReactElement[]
}

type State = {
  showDrawer: boolean
}

const ROUTES = isAdmin => [
  { route: '/', label: 'Início', icon: <Home /> },
  { route: '/novo', label: 'Novo Atendimento', icon: <Add /> },
  { route: '/consulta', label: 'Listar Atendimentos', icon: <ListAlt /> },
  { route: '/relatorio', label: 'Relatórios', icon: <PieChart /> },
  ...(isAdmin ? [{ route: '/usuarios', label: 'Usuários', icon: <SupervisedUserCircleOutlined /> }] : []),
]

const Wrapper = styled.div`
  width: 250px;
`

export const Layout = React.memo(({ history, match, children }: Props) => {
  const [showDrawer, setShowDrawer] = useState(false)
  const { isLoading, response: user } = useQuery(currentUser)

  return (
    <>
      <Drawer open={showDrawer} onClose={() => setShowDrawer(!showDrawer)}>
        <Wrapper>
          {isLoading ? (
            'Carregando...'
          ) : (
            <List>
              {ROUTES(user && user.isAdmin).map(({ route, label, icon }) => (
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
          )}
        </Wrapper>
      </Drawer>
      <Header toggleDrawer={() => setShowDrawer(!showDrawer)} history={history} />
      {children}
    </>
  )
})
