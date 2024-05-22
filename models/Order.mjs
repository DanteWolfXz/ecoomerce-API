import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema(
    {
        userid : { type: String , required: true, unique: true  },
        products : [
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
        amount: { type: Number, required: true},
        address: { type: Object, required: true },
        status: { type: String, default: "pending" },
    },
    { timestamps: true }
);

export default model("Order", orderSchema);
