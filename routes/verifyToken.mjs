import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.verify(token, process.env.JWT_SEC);
            req.user = user;
            console.log('Token verificado, usuario:', user); // Añadido para depuración
            next();
        } catch (err) {
            console.error('Error al verificar el token:', err); // Añadido para depuración
            return res.status(401).json({ error: 'Token inválido' });
        }
    } else {
        console.error('No se encontró el encabezado de autorización'); // Añadido para depuración
        return res.status(401).json({ error: 'No estás autorizado' });
    }
};

export const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log('Verificación de token y autorización, usuario:', req.user); // Añadido para depuración
        console.log('User ID en la solicitud:', req.params.userId); // Añadido para depuración
        if (req.user.id === req.params.userId || req.user.isAdmin) {
            next();
        } else {
            console.error('Usuario no autorizado para esta acción'); // Añadido para depuración
            res.status(403).json('No estás autorizado a realizar esa acción');
        }
    });
};

export const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json('No estás autorizado a realizar esa acción');
        }
    });
};

export const obtenerUserIdDesdeToken = (accessToken) => {
    try {
        const decodedToken = jwt.decode(accessToken);
        if (decodedToken && decodedToken.id) {
            return decodedToken.id;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};

