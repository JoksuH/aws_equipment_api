import connectToDatabase from './db.js'
import { equipment } from './models/equipmentModel.js'
import { Mongoose } from 'mongoose'
import { APIGatewayProxyEvent, APIGatewayProxyResult  } from 'aws-lambda'

let db: Mongoose | null

export const handler = async (event: APIGatewayProxyEvent, context): Promise<APIGatewayProxyResult> => {

  // Sends response right away instead of waiting for Node's event loop to empty
  context.callbackWaitsForEmptyEventLoop = false

  const limit = parseInt(event.queryStringParameters?.limit) || 99999
  const idNumber = parseInt(event.pathParameters?.idNumber) || null
  await connectToDatabase(db)

  try {
        let results : any
        idNumber ?
            (results = await equipment
                .find({ number: idNumber })
                .exec()) :
            results = await equipment.find().limit(limit).sort("number").exec();
        return {
            statusCode: 200,
            body: JSON.stringify(results),
            headers: { 'Access-Control-Allow-Origin': '*'},
            };
    }
    catch (error) {
        return {
            statusCode: error.statusCode || 500,
            headers: { 'Access-Control-Allow-Origin': '*'},
            body: error,
        };
    }
}
