// @ts-ignore
import { sha256 } from 'js-sha256'

import { User } from '../models/User'
import { encryptPassword } from '../config/Auth'

export const startup = async () => {
  const hasUser = await User.findOne()

  if (hasUser) return

  const user = new User({
    cpf: '12345678900',
    password: await encryptPassword(sha256('123456')),
  })

  await user.save()
}
