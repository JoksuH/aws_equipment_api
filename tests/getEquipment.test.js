const mongoose = require('mongoose')
const LambdaTester = require('lambda-tester')
const getEquipmentHandler = require('../functions/getEquipment').handler
const dbHandler = require('./util/dbHandler')
const data = require('./util/testData')
const equipmentModel = require('./testModel/equipmentModel_test')

beforeAll(async () => {
  await dbHandler.connect()
  await data.testData.forEach(async (value) => {
    let equipment = new equipmentModel({
      number: value.number,
      address: value.address,
      contractStartDate: value.contractStartDate,
      contractEndDate: value.contractEndDate,
      status: value.status,
    })
    await equipment.save()
  })
})

afterAll(async () => {
  await dbHandler.clearDatabase()
  await dbHandler.closeDatabase()
})

describe('getProducts.handler ', () => {
  it('should not throw an error', async () => {
    expect(async () => await LambdaTester(getEquipmentHandler).event({})).not.toThrow()
  })
})
