import express from "express";
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from "./verifyToken.mjs";
import User from "../models/User.mjs"; // Asegúrate de especificar la extensión .mjs

const router = express.Router();

// ACTUALIZAR USUARIO
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
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

// BORRAR USUARIO
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("El Usuario fue borrado");
    } catch (err) {
        res.status(500).json(err);
    }
});

// OBTENER USUARIO INDIVIDUAL
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

// OBTENER TODOS LOS USUARIOS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
         ? await User.find().sort({ _id: -1 }).limit(5)
         : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// OBTENER ESTADISTICAS DE USUARIO
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1 ));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt"},
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: { $sum: 1},
                }
            }
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});

// OBTENER PERFIL DE USUARIO
router.get("/profile/:id", verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("ID del usuario:", userId); // Agrega un registro de consola para el ID del usuario
        const user = await User.findById(userId);
        console.log("Usuario encontrado:", user); // Agrega un registro de consola para el usuario encontrado
        if (!user) {
            console.error("Usuario no encontrado");
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;
