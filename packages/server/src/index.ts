import 'reflect-metadata'
import 'array-flat-polyfill'

import * as dotenv from 'dotenv'
import { startup } from './config/Startup'

dotenv.config()

import { createServer } from './lib/Server'
import * as Database from './config/Database'
;(async () => {
  await Database.connect()

  const app = await createServer()

  app.listen(process.env.PORT || 8001, () => {
    const env = process.env.NODE_ENV
    console.log('[Server] - Listening on', process.env.PORT, 'in', env, 'mode')
  })

  await startup()
})()
