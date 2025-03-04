import {Schema,  model} from "mongoose"

const loginHistorySchema = Schema(
    {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User", required: true 
        },
        loginDate: { 
            type: Date, 
            default: Date.now 
        }
    }, { timestamps: true });

export default model("LoginHistory", loginHistorySchema);