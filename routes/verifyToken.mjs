import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const user = jwt.verify(token, process.env.JWT_SEC);
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({ error: "Token inválido" });
        }
    } else {
        return res.status(401).json({ error: "No estás autorizado" });
    }
};

export const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.userid || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("No estás autorizado a realizar esa acción");
        }
    });
};

export const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("No estás autorizado a realizar esa acción");
        }
    });
};

export const obtenerUserIdDesdeToken = (accessToken) => {
    try {
        // Decodifica el token de acceso para obtener los datos del usuario
        const decodedToken = jwt.decode(accessToken);

        // Verifica si el token es válido y contiene el campo 'id' con el userId
        if (decodedToken && decodedToken.id) {
            // Devuelve el userId extraído del token
            return decodedToken.id;
        } else {
            // Si el token no es válido o no contiene el campo 'id', devuelve null
            return null;
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante el proceso de decodificación
        console.error('Error al decodificar el token:', error);
        return null;
    }
};
