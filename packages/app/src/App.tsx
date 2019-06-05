import React, { Component } from 'react'
import { BrowserRouter, Route, withRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme, colors } from '@material-ui/core'

import { Dashboard } from './views/Dashboard'
import { InsertMedicalRecord } from './views/InsertMedicalRecord'
import { ListRecords } from './views/ListRecords'
import { Reports } from './views/Reports'

import 'react-vis/dist/style.css'

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
            <div style={{ paddingLeft: 20, paddingRight: 20 }}>
              <Route exact path='/' component={Dashboard} />
              <Route exact path='/novo' component={InsertMedicalRecord} />
              <Route exact path='/consulta' component={ListRecords} />
              <Route exact path='/relatorios' component={Reports} />
            </div>
          </BrowserRouter>
        </>
      </MuiThemeProvider>
    )
  }
}

export default App
