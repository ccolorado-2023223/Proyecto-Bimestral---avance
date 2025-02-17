import { Schema, model } from 'mongoose'

const categorySchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: [true, 'Category already exists'],
            trim: true
        },
        description: {
            type: String,
            maxLength: [200, `Can't be overcome 200 characters`]
        }
    },
    { timestamps: true }
)

export default model('Category', categorySchema)
