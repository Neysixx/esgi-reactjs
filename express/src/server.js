const express = require('express');
const app = express();
const authRoutes = require('./routes/auth-route');

app.use(express.json());
app.use('/auth', authRoutes);

// Exemple route protégée
const authMiddleware = require('./middleware/auth-middleware');
app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Accès autorisé', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));
