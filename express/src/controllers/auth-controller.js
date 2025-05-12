const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'votre_cle_secrete';

exports.signup = async (req, res) => {
    const { email, password, fname, lname, phone } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Utilisateur déjà existant' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fname,
                lname,
                phone,
            },
        });

        res.status(201).json({ message: 'Compte créé', userId: user.id });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Email incorrect' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
