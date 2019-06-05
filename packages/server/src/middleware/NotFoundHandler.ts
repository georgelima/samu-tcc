import { Middleware } from 'koa'

export const notFoundHandler: () => Middleware = () => context => {
  const msg = `${context.request.method} ${context.request.path}`
  context.status = 404
  context.body = {
    message: `No endpoint matched your request: ${msg}`,
  }
}
