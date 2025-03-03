import { Schema, model } from "mongoose"

const invoiceSchema = new Schema(
    {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User", required: true 
        },
        userName: { 
            type: String, 
            required: true 
        },
        NIT: { 
            type: String, 
            required: true 
        },
        cardNumber: { 
            type: String, 
            required: true 
        },
        date: { 
            type: Date, 
            default: Date.now 
        },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                productName:{type: String},
                price: { type: Number, required: true },
                quantity: { type: Number, required: true }
            }
        ],
        total: { type: Number, required: true }
    }, 
    { timestamps: true }
)

export default model("Invoice", invoiceSchema)