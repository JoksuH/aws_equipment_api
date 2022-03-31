const mongoose = require('mongoose')
const LambdaTester = require('lambda-tester')
const addEquipmentHandler = require('../addEquipment').handler
const dbHandler = require('./util/dbHandler')
const data = require('./util/testData')
const equipmentModel = require('./testModel/equipmentModel_test')

beforeAll(async () => {
  await dbHandler.connect()
  await data.testData.forEach(async (value) => {
    equipment = new equipmentModel({
      number: value.number,
      address: value.address,
      contractStartDate: value.contractStartDate,
      contractEndDate: value.contractEndDate,
      status: value.status,
    })
    await equipment.save()
  })
  mongoose.models = {}
})

afterAll(async () => {
  await dbHandler.clearDatabase()
  await dbHandler.closeDatabase()
})

describe('addProducts.handler ', () => {
  it('accepts an unique equipment and saves it to db correctly', async () => {
    return LambdaTester(addEquipmentHandler)
      .event({
        body: JSON.stringify({
          number: 17,
          address: {
            street: 'Kauppiaankatu 12',
            city: 'Vantaa',
            zip: '00160',
            country: 'Finland',
          },
          contractStartDate: '2017-02-28',
          contractEndDate: '2019-04-12',
          status: 'true',
        }),
      })
      .expectResolve((result) => {
        expect(result.statusCode).toBe(200)
      })
  })
  it('Should return an error JSON parsing error when JSON is not valid', async () => {
    return LambdaTester(addEquipmentHandler)
      .event({
        body: {
          address: {
            street: 'Kauppiaankatu 12',
            city: 'Vantaa',
            zip: '00160',
            country: 'Finland',
          },
          contractStartDate: '2017-02-28',
          contractEndDate: '2019-04-12',
          status: 'true',
        },
      })
      .expectResolve((result) => {
        expect(result.statusCode).toBe(422)
      })
  })
  it('Should return an error when equipment number is not unique', async () => {
    return LambdaTester(addEquipmentHandler)
      .event({
        body: JSON.stringify({
          number: 17,
          address: {
            street: 'Kauppiaankatu 12',
            city: 'Vantaa',
            zip: '00160',
            country: 'Finland',
          },
          contractStartDate: '2017-02-28',
          contractEndDate: '2019-04-12',
          status: 'true',
        }),
      })
      .expectResolve((result) => {
        expect(result.statusCode).toBe(500)
      })
  })
  it('Should return an error when equipment number is missing', async () => {
    return LambdaTester(addEquipmentHandler)
      .event({
        body: JSON.stringify({
          address: {
            street: 'Kauppiaankatu 12',
            city: 'Vantaa',
            zip: '00160',
            country: 'Finland',
          },
          contractStartDate: '2017-02-28',
          contractEndDate: '2019-04-12',
          status: 'true',
        }),
      })
      .expectResolve((result) => {
        expect(result.statusCode).toBe(500)
      })
  })
  it('Should not return an error when not required fields are missing', async () => {
    return LambdaTester(addEquipmentHandler)
      .event({
        body: JSON.stringify({
          address: {
            street: 'Kauppiaankatu 12',
            city: 'Vantaa',
            zip: '00160',
            country: 'Finland',
          },
        }),
      })
      .expectResolve((result) => {
        expect(result.statusCode).toBe(500)
      })
  })
  it('Should return an error when a wrong data type is being used', async () => {
    return LambdaTester(addEquipmentHandler)
      .event({
        body: JSON.stringify({
          number: 22,
          address: {
            street: 'Kauppiaankatu 12',
            city: 'Vantaa',
            zip: '00160',
            country: 'Finland',
          },
          contractStartDate: '24 joulukuuta',
          contractEndDate: '2019-04-12',
          status: 'true',
        }),
      })
      .expectResolve((result) => {
        expect(result.statusCode).toBe(500)
      })
  })
  it('Should return an error when the address field missing a variable', async () => {
    return LambdaTester(addEquipmentHandler)
      .event({
        body: JSON.stringify({
          number: 23,
          address: {
            street: 'Kauppiaankatu 12',
            city: 'Vantaa',
            country: 'Finland',
          },
          contractStartDate: '2017-02-28',
          contractEndDate: '2019-04-12',
          status: 'true',
        }),
      })
      .expectResolve((result) => {
        expect(result.statusCode).toBe(500)
      })
  })
  it('Should return an error when the address field is not an object', async () => {
    return LambdaTester(addEquipmentHandler)
      .event({
        body: JSON.stringify({
          number: 24,
          address: 'Lehtikallio',
          contractStartDate: '2017-02-28',
          contractEndDate: '2019-04-12',
          status: 'true',
        }),
      })
      .expectResolve((result) => {
        expect(result.statusCode).toBe(500)
      })
  })
})
