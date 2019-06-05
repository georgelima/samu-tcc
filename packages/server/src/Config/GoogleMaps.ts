import { createClient } from '@google/maps'

export const GoogleMaps = createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise,
})
