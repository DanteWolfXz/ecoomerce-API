import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartSchema = new Schema(
    {
        userId : { type: String , required: true, unique: true },
        items : [
            {
                productId:{
                    type:String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ], 
    },
    { timestamps: true }
);

export default model("Cart", cartSchema);

