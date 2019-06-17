import * as Cookies from 'js-cookie'

const COOKIE_KEY = 'AUTHORIZATION_TOKEN'

export const Auth = {
  isAuthenticated: () => !!Cookies.get(COOKIE_KEY),
  authenticate: (token: string) => Cookies.set(COOKIE_KEY, token),
  signout: () => Cookies.remove(COOKIE_KEY),
  getAuthToken: () => Cookies.get(COOKIE_KEY) || '',
}
