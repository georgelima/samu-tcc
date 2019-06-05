import * as jwt from 'koa-jwt'

export default jwt({
  secret: String(process.env.JWT_SECRET),
})
