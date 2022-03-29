import connectToDatabase from './db.js'
import {equipment, equipmentData} from './models/equipmentModel.js'
import { Mongoose } from 'mongoose'
import { APIGatewayProxyEvent, APIGatewayProxyResult  } from 'aws-lambda'


let db: Mongoose | null

export const handler = async (event: APIGatewayProxyEvent, context): Promise<APIGatewayProxyResult> => {

  // Sends response right away instead of waiting for Node's event loop to empty
  context.callbackWaitsForEmptyEventLoop = false

  let newEquipment: equipmentData
  try {
      const parsedJSON: equipmentData = JSON.parse(event.body)
      newEquipment = new equipment({
      number: parsedJSON.number,
      address: parsedJSON.address,
      contractStartDate: parsedJSON.contractStartDate,
      contractEndDate: parsedJSON.contractEndDate,
      status: parsedJSON.status,
    })
  } catch (error) {
    return {
      statusCode: 422,
      body: JSON.stringify('Error while parsing JSON'),
    }
  }
  await connectToDatabase(db)
  try {
    await newEquipment.save()
    return {
      statusCode: 200,
      body: JSON.stringify(`Equipment with number ${newEquipment.number} has been saved to database`),
    }
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error),
    }
  }
}
