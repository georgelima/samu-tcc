import { model, Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  cpf: string
  password: string
  isAdmin: boolean
}

const UserSchema = new Schema({
  name: String,
  cpf: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

export const User = model<IUser>('User', UserSchema)
