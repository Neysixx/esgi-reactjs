const express = require('express');
const app = express();
const authRoutes = require('./routes/auth-route');
const reservationRoutes = require('./routes/reservation-route');
const menuRoutes = require('./routes/menu-route');
const tableRoutes = require('./routes/table-route');
const authMiddleware = require('./middleware/auth-middleware');

app.use(express.json());

// Routes publiques
app.use('/auth', authRoutes);
app.use('/menu', menuRoutes); // GET menu est public

// Routes protégées (via middleware dans les fichiers de route déjà)
app.use('/reservations', reservationRoutes);
app.use('/tables', tableRoutes);

app.get('/me', authMiddleware,(req, res) => {
    res.json({ message: `Hello ${JSON.stringify(req.user)}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));