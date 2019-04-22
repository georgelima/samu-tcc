import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme, colors } from '@material-ui/core'

import { InsertMedicalRecord } from './views/InsertMedicalRecord'

import { Header } from './components/Header'

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
          <Header />
          <BrowserRouter>
            <Route exact path="/" component={InsertMedicalRecord} />
          </BrowserRouter>
        </>
      </MuiThemeProvider>
    )
  }
}

export default App
