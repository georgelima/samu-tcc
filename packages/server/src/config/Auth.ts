import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'

import { User, IUser } from '../models/User'

type Token = {
  sub: string
  iat: number
}

const TOKEN_EXPIRATION_AGE = 2592000000
const SALT_SIZE = 10

export const generateAuthToken = (user: IUser) =>
  jwt.sign(
    {
      sub: user._id,
      iat: Date.now(),
    },
    process.env.JWT_SECRET,
  )

export const getUserByJWT = async (token: string) => {
  if (!token) return null

  try {
    // @ts-ignore
    const decodedJWT: Token = jwt.verify(token.substring(4), process.env.JWT_SECRET)

    if (!decodedJWT.sub) {
      return null
    }

    if (decodedJWT.iat > Date.now() + TOKEN_EXPIRATION_AGE) {
      return null
    }

    return await User.findOne({ _id: decodedJWT.sub }).select('-password')
  } catch (err) {
    console.log(err)
    return null
  }
}

export const encryptPassword = (pass: string) =>
  new Promise((resolve, reject) =>
    bcrypt.hash(pass, SALT_SIZE, (err, encrypted) => {
      if (err) return reject(err)

      resolve(encrypted)
    }),
  )

export const comparePassword = (guess: string, hash: string) =>
  new Promise(resolve => bcrypt.compare(guess, hash, (err, isSame) => resolve(isSame)))
