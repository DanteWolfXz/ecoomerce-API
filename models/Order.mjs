import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema(
    {
        userid : { type: String , required: true },
        products : [
            {
                productId: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ], 
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: "pendiente" },
        delivered: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default model("Order", orderSchema);

