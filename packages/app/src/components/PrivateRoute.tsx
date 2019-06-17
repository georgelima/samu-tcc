import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { Auth } from '../services/auth'

type Props = {
  component: React.ElementType
  [x: string]: any
}

export const PrivateRoute = ({ component: Component, ...rest }: Props) => (
  <Route
    {...rest}
    component={(props: { [x: string]: any }) =>
      Auth.isAuthenticated() ? <Component {...props} /> : <Redirect to='/entrar' />
    }
  />
)

export const AuthRoute = ({ component: Component, ...rest }: Props) => (
  <Route
    {...rest}
    component={(props: { [x: string]: any }) =>
      !Auth.isAuthenticated() ? <Component {...props} /> : <Redirect to='/' />
    }
  />
)
