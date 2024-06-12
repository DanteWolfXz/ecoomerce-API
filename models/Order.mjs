import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                title: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                price: {
                    type: Number,
                    required: true
                },
            },
        ], 
        totalAmount: { type: Number, required: true },
        payer: { 
            email: { type: String, required: true }
        },
        preferenceId: { type: String, required: true },
        merchantOrderId: { type: String, required: true },
        status: { type: String, default: "pendiente" },
    },
    { timestamps: true }
);

export default model("Order", orderSchema);


