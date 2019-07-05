import React, { Component, lazy, Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme, colors, Typography } from '@material-ui/core'
import styled from 'styled-components'
import unfetch from 'unfetch'

import { PrivateRoute, AuthRoute } from './components/PrivateRoute'

const Startup = lazy(() => import('./views/Startup').then(module => ({ default: module.Startup })))
const Authorization = lazy(() => import('./views/Authorization').then(module => ({ default: module.Authorization })))
const Dashboard = lazy(() => import('./views/Dashboard').then(module => ({ default: module.Dashboard })))
const InsertMedicalRecord = lazy(() =>
  import('./views/InsertMedicalRecord').then(module => ({ default: module.InsertMedicalRecord })),
)
const ListRecords = lazy(() => import('./views/ListRecords').then(module => ({ default: module.ListRecords })))
const Reports = lazy(() => import('./views/Reports').then(module => ({ default: module.Reports })))

const Wrapper = styled.div`
  padding-left: 20px;
  padding-right: 20px;
`

const LoadingWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const App = () => {
  // Ping!!!
  useEffect(() => {
    unfetch(process.env.REACT_APP_ENDPOINT as string)
      .then(() => console.log('SERVER - PING OK!'))
      .catch(() => console.log('SERVER - PING ERROR!'))
  }, [])

  return (
    <MuiThemeProvider
      theme={createMuiTheme({
        palette: {
          primary: colors.red,
        },
      })}
    >
      <Suspense
        fallback={
          <LoadingWrapper>
            <Typography>Carregando...</Typography>
          </LoadingWrapper>
        }
      >
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
      </Suspense>
    </MuiThemeProvider>
  )
}

export default App
