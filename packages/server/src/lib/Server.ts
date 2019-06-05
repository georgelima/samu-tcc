import * as http from 'http'
import * as Koa from 'koa'
import * as koaCompress from 'koa-compress'
// @ts-ignore
import * as koaCors from '@koa/cors'
import * as koaBodyParser from 'koa-bodyparser'
import * as koaHelmet from 'koa-helmet'

import { errorHandler } from '../middleware/ErrorHandler'
import { notFoundHandler } from '../middleware/NotFoundHandler'

import router from '../routes/MedicalRecord'

export const createServer = async () => {
  console.log('[Server] - Starting')

  const app = new Koa()

  app
    .use(koaHelmet())
    .use(errorHandler())
    .use(koaCompress())
    .use(koaCors())
    .use(koaBodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(notFoundHandler())

  const server = http.createServer(app.callback())

  server.on('close', () => console.log('[Server] - Closing'))

  return server
}
