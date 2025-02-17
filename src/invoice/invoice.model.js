import { Schema, model } from 'mongoose'

const invoiceSchema = Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true }
            }
        ],
        total: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

export default model('Invoice', invoiceSchema)
