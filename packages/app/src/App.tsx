import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme, colors } from '@material-ui/core'
import styled from 'styled-components'

import { PrivateRoute, AuthRoute } from './components/PrivateRoute'

import { Startup } from './views/Startup'
import { Authorization } from './views/Authorization'
import { Dashboard } from './views/Dashboard'
import { InsertMedicalRecord } from './views/InsertMedicalRecord'
import { ListRecords } from './views/ListRecords'
import { Reports } from './views/Reports'

import 'react-vis/dist/style.css'

const Wrapper = styled.div`
  padding-left: 20px;
  padding-right: 20px;
`

class App extends Component {
  render() {
    return (
      <MuiThemeProvider
        theme={createMuiTheme({
          palette: {
            primary: colors.red,
          },
        })}
      >
        <>
          <BrowserRouter>
            <>
              <AuthRoute exact path='/entrar' component={Authorization} />
              <Wrapper>
                <PrivateRoute exact path='/' component={Startup} />
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
                <PrivateRoute exact path='/novo' component={InsertMedicalRecord} />
                <PrivateRoute exact path='/consulta' component={ListRecords} />
                <PrivateRoute exact path='/relatorio' component={Reports} />
              </Wrapper>
            </>
          </BrowserRouter>
        </>
      </MuiThemeProvider>
    )
  }
}

export default App
