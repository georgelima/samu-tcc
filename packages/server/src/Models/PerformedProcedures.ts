import { model, Schema, Document } from 'mongoose'

export interface IPerformedProcedures extends Document {
  guedel: boolean
  guedelNumber: number
  aspiration: boolean
  iot: boolean
  iotNumber: number
  vm: boolean
  vmMode: string
  maskO2: boolean
  maskO2litersPerMinute: number
  catheterO2: boolean
  catheterO2litersPerMinute: number
  chestCompression: boolean
  DEA: boolean
  cardiacMonitoring: boolean
  defibrillation: boolean
  cardipacemakeracMonitoring: boolean
  neckBrace: boolean
  mmss: boolean
  mmii: boolean
  oximeter: boolean
  cardioversion: boolean
  bandAid: boolean
  rigidBoard: boolean
  quickTake: boolean
  heating: boolean
  venousAccess: boolean
  bleedingControl: boolean
  KED: boolean
  others: string
  ventilation: boolean
}

const PerformedProceduresSchema = new Schema({
  guedel: Boolean,
  guedelNumber: Number,
  aspiration: Boolean,
  iot: Boolean,
  iotNumber: Number,
  vm: Boolean,
  vmMode: String,
  maskO2: Boolean,
  maskO2litersPerMinute: Number,
  catheterO2: Boolean,
  catheterO2litersPerMinute: Number,
  chestCompression: Boolean,
  DEA: Boolean,
  cardiacMonitoring: Boolean,
  defibrillation: Boolean,
  cardipacemakeracMonitoring: Boolean,
  neckBrace: Boolean,
  mmss: Boolean,
  mmii: Boolean,
  oximeter: Boolean,
  cardioversion: Boolean,
  bandAid: Boolean,
  rigidBoard: Boolean,
  quickTake: Boolean,
  heating: Boolean,
  venousAccess: Boolean,
  bleedingControl: Boolean,
  KED: Boolean,
  others: String,
  ventilation: Boolean,
})

export const PerformedProcedures = model<IPerformedProcedures>(
  'PerfomedProcedures',
  PerformedProceduresSchema,
)
