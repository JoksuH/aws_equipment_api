import connectToDatabase from './db'
import { equipment } from './models/equipmentModel'
import { Mongoose } from 'mongoose'
import { APIGatewayProxyEvent, Context,  APIGatewayProxyResult  } from 'aws-lambda'

//The database is kept outside the handler to allow possible reuse
let db: Mongoose

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {

  // Sends response right away instead of waiting for Node's event loop to empty
  context.callbackWaitsForEmptyEventLoop = false

  const limit = parseInt(event.queryStringParameters?.limit) || 99999
  const idNumber = parseInt(event.pathParameters?.idNumber) || null
  await connectToDatabase(db)

  try {
        let results: any
        idNumber ? results = await equipment.find({ number: idNumber }).exec()
            :
            results = await equipment.find().limit(limit).sort("number").exec();
        return {
            statusCode: 200,
            body: JSON.stringify(results),
            };
    }
    catch (error) {
        return {
            statusCode: error.statusCode || 500,
            body: error,
        };
    }
}
