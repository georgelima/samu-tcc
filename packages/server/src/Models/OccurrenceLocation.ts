import { model, Schema, Document } from 'mongoose'

type Location = 'STREET' | 'PUBLIC_PLACE' | 'RESIDENCE' | 'HIGHWAY' | 'OTHER'

export interface IOccurrenceLocation extends Document {
  location: Location
  locationText: string
  address: string
  number: string
  neighborhood: string
  city: string
  lat: number
  lng: number
}

const OccurrenceLocationSchema = new Schema({
  location: String,
  locationText: String,
  address: String,
  number: String,
  neighborhood: String,
  city: String,
  lat: Number,
  lng: Number,
})

export const OccurrenceLocation = model<IOccurrenceLocation>(
  'OccurrenceLocation',
  OccurrenceLocationSchema,
)
