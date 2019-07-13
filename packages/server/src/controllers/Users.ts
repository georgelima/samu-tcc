import { Context } from 'koa'

import { encryptPassword } from '../config/Auth'
import { User } from '../models/User'
import { ERRORS } from '../constants/Errors'

const normalizeCPF = (cpf: string) => cpf.replace(/\D/g, '')

export const Users = {
  currentUser(ctx: Context) {
    ctx.body = ctx.user
  },
  async createUser(ctx: Context) {
    if (!ctx.user.isAdmin) {
      ctx.status = 401
      ctx.body = { error: ERRORS.UNAUTHORIZED }
      return
    }

    const { name, cpf, password, isAdmin } = ctx.request.body

    const hasUser = await User.findOne({
      cpf: normalizeCPF(cpf),
    })

    if (hasUser) return

    const user = new User({
      name,
      cpf: normalizeCPF(cpf),
      password: await encryptPassword(password),
      isAdmin,
    })

    await user.save()

    ctx.body = { message: 'Usuário criado!' }
  },
  async listUsers(ctx: Context) {
    if (!ctx.user.isAdmin) {
      ctx.status = 401
      ctx.body = { error: ERRORS.UNAUTHORIZED }
      return
    }

    const users = await User.find().select('-password')

    ctx.body = { users }
  },
  async toggleAdminFlag(ctx: Context) {
    if (!ctx.user.isAdmin) {
      ctx.status = 401
      ctx.body = { error: ERRORS.UNAUTHORIZED }
      return
    }

    const { userId } = ctx.request.body

    const user = await User.findOne({ _id: userId })

    if (user) {
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            isAdmin: !user.isAdmin,
          },
        },
      )
      ctx.body = { message: 'Usuário Atualizado!' }
    } else {
      ctx.status = 404
      ctx.body = { error: 'Usuário não encontrado' }
    }
  },
  async deleteUser(ctx: Context) {
    if (!ctx.user.isAdmin) {
      ctx.status = 401
      ctx.body = { error: ERRORS.UNAUTHORIZED }
      return
    }

    try {
      // @ts-ignore
      await User.deleteOne({ _id: ctx.params.userId })
      ctx.body = { ok: true }
    } catch (err) {
      console.log(err)
      ctx.status = 500
      ctx.body = { ok: false }
    }
  },
}
