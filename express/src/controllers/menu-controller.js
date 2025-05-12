const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMenu = async (req, res) => {
    try {
        const items = await prisma.menuItem.findMany();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createMenuItem = async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { name, description, price, category, image } = req.body;
        const item = await prisma.menuItem.create({
            data: { name, description, price, category, image },
        });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMenuItem = async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { id } = req.params;
        const updated = await prisma.menuItem.update({
            where: { id: parseInt(id) },
            data: req.body,
        });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { id } = req.params;
        await prisma.menuItem.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};