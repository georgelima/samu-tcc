import { model, Schema, Document } from 'mongoose'

export interface IPhysicalExaminationFindings extends Document {
  head: string
  neck: string
  chest: string
  abdomen: string
  pelvis: string
  extremities: string
}

const PhysicalExaminationFindingsSchema = new Schema({
  head: String,
  neck: String,
  chest: String,
  abdomen: String,
  pelvis: String,
  extremities: String,
})

export const PhysicalExaminationFindings = model<IPhysicalExaminationFindings>(
  'PhysicalExaminationFindings',
  PhysicalExaminationFindingsSchema,
)
