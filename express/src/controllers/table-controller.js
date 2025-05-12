const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTables = async (req, res) => {
    if (!req.user.isAdmin){
        return res.status(403).json({ error: 'Accès interdit (admin requis)' });
    };

    try {
        const tables = await prisma.table.findMany();
        res.status(200).json(tables);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTable = async (req, res) => {
    if (!req.user.isAdmin){
        return res.status(403).json({ error: 'Accès interdit (admin requis)' });
    };

    try {
        const { seats } = req.body;
        const table = await prisma.table.create({ data: { seats } });
        res.status(201).json(table);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTable = async (req, res) => {
    if (!req.user.isAdmin){
        return res.status(403).json({ error: 'Accès interdit (admin requis)' });
    };

    try {
        const { id } = req.params;
        const updated = await prisma.table.update({
            where: { id: Number.parseInt(id) },
            data: req.body,
        });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTable = async (req, res) => {
    if (!req.user.isAdmin){
        return res.status(403).json({ error: 'Accès interdit (admin requis)' });
    };

    try {
        const { id } = req.params;
        await prisma.table.delete({ where: { id: Number.parseInt(id) } });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
