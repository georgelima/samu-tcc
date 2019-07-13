import * as Router from 'koa-router'

import { Users } from '../controllers/Users'

const router = new Router()

router.prefix(`${process.env.BASE_API}/users`)

router.get('/', Users.listUsers)
router.post('/toggle-admin', Users.toggleAdminFlag)
router.post('/', Users.createUser)
router.delete('/:userId', Users.deleteUser)
router.get('/current', Users.currentUser)

export default router
