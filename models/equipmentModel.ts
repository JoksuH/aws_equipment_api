import mongoose from 'mongoose'

export interface equipmentData extends mongoose.Document {
  number: number
  address: address
  contractStartDate?: Date
  contractEndDate?: Date
  status?: boolean
}

interface address {
  street: string
  city: string
  zip: string
  country: string
}

interface equipmentDataModel extends mongoose.Model<equipmentData> {}

export const equipment = mongoose.model<equipmentData, equipmentDataModel>(
  'equipment',
  new mongoose.Schema<equipmentData>({
    number: { type: Number, required: [true, 'Equipment number is required'], unique: true },
    address: {
      street: { type: String, required: [true, 'Address is missing street'] },
      city: { type: String, required: [true, 'Address is missing city'] },
      zip: { type: String, required: [true, 'Address is missing zip'] },
      country: { type: String, required: [true, 'Address is missing country'] },
    },
    contractStartDate: { type: Date },
    contractEndDate: { type: Date },
    status: { type: Boolean },
  })
)
