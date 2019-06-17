import * as Router from 'koa-router'

import { Auth } from '../controllers/Auth'

const router = new Router()

router.prefix(`${process.env.BASE_API}/auth`)

router.post('/login', Auth.login)

export default router
