import { Context } from 'koa'
import * as eres from 'eres'

import { comparePassword, generateAuthToken } from '../config/Auth'
import { User } from '../models/User'
import { ERRORS } from '../constants/Errors'

const normalizeCPF = (cpf: string) => cpf.replace(/\D/g, '')

export const Auth = {
  async login(ctx: Context) {
    const { cpf, password } = ctx.request.body

    const user = await User.findOne({ cpf: normalizeCPF(cpf) })

    if (!user) {
      ctx.body = { error: ERRORS.INVALID_CREDENTIALS }
      return
    }

    const [err, isSame] = await eres(comparePassword(password, user.password))

    if (err || !isSame) {
      ctx.body = { error: ERRORS.INVALID_CREDENTIALS }
      return
    }

    ctx.status = 200
    ctx.body = { token: `JWT ${generateAuthToken(user)}` }
  },
}
