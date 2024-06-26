import express from "express";
import User from "../models/User.mjs"; // Asegúrate de especificar la extensión .mjs
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTRARSE
router.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword, dni, phone } = req.body;

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
        return res.status(400).json("Las contraseñas no coinciden");
    }

    const newUser = new User({
        username,
        email,
        password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
        dni,
        phone
    });

    try {
        const savedUser = await newUser.save();
        res.redirect(302, '/acceder');
    } catch (err) {
        console.error(err); // Registra el error en la consola del servidor
        res.status(400).json({ error: err.message }); // Devuelve el mensaje de error al frontend
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json("Usuario o contraseña incorrectos");
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        ).toString(CryptoJS.enc.Utf8);

        if (hashedPassword !== req.body.password) {
            return res.status(401).json("Contraseña incorrecta");
        }

        const accessToken = jwt.sign(
            {
                id: user._id, 
                isAdmin: user.isAdmin,
            }, 
            process.env.JWT_SEC
        );

        // Incluye el userId en la respuesta JSON junto con el accessToken
        res.status(200).json({ accessToken, userId: user._id });

    } catch (err) {
        console.error(err); // Registra el error en la consola del servidor
        res.status(500).json("Error interno del servidor");
    }
});

// LOGOUT
router.post("/logout", (req, res) => {
    try { 
        res.removeHeader('Authorization');
        res.status(200).json("Desconexión exitosa");
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
