import { model, Schema, Document } from 'mongoose'

type Gender = 'M' | 'F' | 'U'

export interface IVictimData extends Document {
  name: string
  doc: string
  age: number
  gender: Gender
  address: string
  number: string
  neighborhood: string
  city: string
  phone: string
  companion: string
  companionDoc: string
  companionProximityLevel: string
  companionPhone: string
}

const VictimDataSchema = new Schema({
  name: String,
  doc: String,
  age: Number,
  gender: String,
  address: String,
  number: String,
  neighborhood: String,
  city: String,
  phone: String,
  companion: String,
  companionDoc: String,
  companionProximityLevel: String,
  companionPhone: String,
})

export const VictimData = model<IVictimData>('VictimData', VictimDataSchema)
