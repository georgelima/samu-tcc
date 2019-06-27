import * as mongoose from 'mongoose'

export const connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })

    mongoose.connection.on('connected', () => {
      console.log('[Mongoose] - Connected')
      resolve()
    })

    mongoose.connection.on('error', err => {
      console.log('[Mongoose] - Err:', err)
      reject()
    })

    mongoose.connection.on('disconnected', () => console.log('[Mongoose] - Disconnected'))
  })
}
