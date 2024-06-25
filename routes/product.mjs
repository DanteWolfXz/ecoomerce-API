import express from "express";
import { verifyToken, verifyTokenAndAdmin } from "./verifyToken.mjs";
import Product from "../models/Product.mjs"; // Asegúrate de especificar la extensión .mjs

const router = express.Router();

// ACTUALIZAR PRODUCTO
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// CREAR PRODUCTO
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// BORRAR PRODUCTO
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("El Producto fue borrado");
    } catch (err) {
        res.status(500).json(err);
    }
});

// OBTENER UN PRODUCTO
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});


// OBTENER TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});


// BUSCAR PRODUCTOS
router.get("/buscar", async (req, res) => {
    const criterioBusqueda = req.query.query ? req.query.query.toLowerCase() : '';
    const categoriaSeleccionada = req.query.category ? req.query.category.toLowerCase() : '';

    try {
        let productos;

        // Comprobar si el criterio de búsqueda es un número válido
        const idBusqueda = parseInt(criterioBusqueda);
        const esNumeroValido = !isNaN(idBusqueda);

        // Realizar la consulta para buscar productos según el término de búsqueda, categoría seleccionada e ID
        if (categoriaSeleccionada === '' || categoriaSeleccionada === 'todas las categorías') {
            productos = await Product.find({ 
                $or: [
                    { nombre: { $regex: criterioBusqueda, $options: 'i' } },
                    { categoria: { $regex: criterioBusqueda, $options: 'i' } },
                    esNumeroValido ? { id: idBusqueda } : {}
                ]
            });
        } else {
            productos = await Product.find({ 
                $and: [
                    { 
                        $or: [
                            { nombre: { $regex: criterioBusqueda, $options: 'i' } },
                            { categoria: { $regex: criterioBusqueda, $options: 'i' } },
                            esNumeroValido ? { id: idBusqueda } : {}
                        ]
                    },
                    { categoria: categoriaSeleccionada }
                ]
            });
        }

        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar productos', error: error.message });
    }
});



export default router;
