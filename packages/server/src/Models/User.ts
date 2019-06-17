import { model, Schema, Document } from 'mongoose'

export interface IUser extends Document {
  cpf: string
  password: string
}

const UserSchema = new Schema({
  cpf: String,
  password: String,
})

export const User = model<IUser>('User', UserSchema)
