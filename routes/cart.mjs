import express from "express";
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from "./verifyToken.mjs";
import Cart from "../models/Cart.mjs";

const router = express.Router();

// ACTUALIZAR CARRITO
router.put("/:id", verifyToken, async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password, 
                process.env.PASS_SEC
            ).toString();
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// CREAR CARRITO
router.post("/", verifyToken, async (req, res) => {
    try {
        // Obtener el userId del token de acceso
        const userId = req.user.id;

        // Buscar si el usuario ya tiene un carrito
        let cart = await Cart.findOne({ userId });

        // Si el usuario no tiene un carrito, crear uno nuevo
        if (!cart) {
            console.log("Creando un nuevo carrito para el usuario:", userId);
            cart = new Cart({ userId });
            
            // Guardar el carrito en la base de datos
            const savedCart = await cart.save();
            
            console.log("Carrito creado con éxito:", savedCart);
            res.status(200).json(savedCart);
        } else {
            // Si el usuario ya tiene un carrito, responder con un mensaje indicando que ya tiene uno
            console.log("El usuario ya tiene un carrito existente:", userId);
            res.status(200).json({ message: "El usuario ya tiene un carrito existente" });
        }
    } catch (err) {
        console.error("Error al crear el carrito:", err);
        res.status(500).json(err);
    }
});



// ACTUALIZAR CARRITO
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// AGREGAR ITEM A CARRITO
router.put("/:cartId/add", verifyToken, async (req, res) => {
    try {
        const { id, cantidad } = req.body;
        
        // Verificar si el producto ya está en el carrito
        const cart = await Cart.findById(req.params.cartId);
        const existingProductIndex = cart.items.findIndex(item => item.productId === id);
        
        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            cart.items[existingProductIndex].cantidad += cantidad;
        } else {
            // Si el producto no está en el carrito, agregarlo
            cart.items.push({ productId: id, cantidad });
        }

        // Guardar el carrito actualizado en la base de datos
        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// BORRAR CARRITO
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("El Carrito fue eliminado");
    } catch (err) {
        res.status(500).json(err);
    }
});

// OBTENER CARRITO DE USUARIO
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userid });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// OBTENER TODOS LOS CARRITOS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
