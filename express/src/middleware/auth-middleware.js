const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'votre_cle_secrete';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, SECRET_KEY);
        req.user = {
            id: payload.userId,
            role: payload.role,
            isAdmin: payload.isAdmin || false
        };
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token invalide ou expiré' });
    }
};

module.exports = authMiddleware;