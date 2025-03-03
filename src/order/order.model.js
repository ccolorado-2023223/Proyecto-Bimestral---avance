import {Schema, model} from "mongoose";

const orderSchema = Schema(
    {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User", required: true },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                productName: {type: String},
                quantity: { type: Number, required: true }
            }
        ],
        total: { 
            type: Number, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ["pending", "completed", "cancelled"], 
            default: "pending" }
    },
    { timestamps: true }
)

export default model("Order", orderSchema);
