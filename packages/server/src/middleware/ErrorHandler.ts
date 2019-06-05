import { Middleware } from 'koa'

export const errorHandler: () => Middleware = () => async (context, next) => {
  try {
    await next()
  } catch (err) {
    context.status = err.status || 500
    context.body = err.toJSON ? err.toJSON() : { message: err.message, ...err }
    delete context.body.stack
  }
}
