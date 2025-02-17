import { Schema, model } from 'mongoose'

const productSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true
        },
        description: {
            type: String,
            maxLength: [500, `Can't be overcome 500 characters`]
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be positive']
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative']
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        imageUrl: {
            type: String
        },
        soldCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)

export default model('Product', productSchema)
