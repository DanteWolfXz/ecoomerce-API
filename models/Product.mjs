import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema(
    {
        id: { type: Number, required: true },
        nombre: { type: String, required: true },
        descripcion: { type: String },
        imagen: { type: String, required: true },
        categoria: { type: String, required: true }, 
        precio: { type: Number, required: true },
        estrellas: { type: Number, required: true },
    },
    { timestamps: true }
);

export default model("Product", productSchema);
