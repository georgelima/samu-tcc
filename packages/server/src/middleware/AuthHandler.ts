import { Middleware } from 'koa'

import { ERRORS } from '../constants/Errors'
import { getUserByJWT } from '../config/Auth'

export const authHandler: () => Middleware = () => async (context, next) => {
  const token: string = context.headers['authorization']

  const user = await getUserByJWT(token)

  if (!user) {
    context.status = 401
    context.body = { error: ERRORS.MUST_BE_LOGGED_IN }
  } else {
    context.user = user
    await next()
  }
}
