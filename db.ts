import mongoose, { Mongoose } from 'mongoose'

export default async function connectToDatabase(db: Mongoose): Promise<Mongoose | void> {
  if (db) {
    return Promise.resolve()
  }
  try {
    db = await mongoose.connect(process.env.MONGO_DB)
    return db
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
