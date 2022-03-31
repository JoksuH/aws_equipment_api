const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
require('dotenv').config()

let mongoServer

module.exports.connect = async () => {
  mongoServer = await MongoMemoryServer.create()
  process.env.MONGO_DB = mongoServer.getUri()
  await mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true })
}

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
}

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }
}
