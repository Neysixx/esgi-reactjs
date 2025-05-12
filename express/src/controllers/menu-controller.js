const prisma = require('../lib/prisma');
const { logger } = require('../utils/logger');

exports.getMenu = async (req, res) => {
    try {
        const { category, max_price } = req.query;
        
        // Build where condition based on query parameters
        const whereCondition = {};
        
        if (category) {
            whereCondition.category = category;
        }
        
        if (max_price) {
            const maxPrice = Number.parseFloat(max_price);
            if (!Number.isNaN(maxPrice)) {
                whereCondition.price = {
                    lte: maxPrice
                };
            }
        }
        
        // Get menu items with filters
        const items = await prisma.menuItem.findMany({
            where: whereCondition,
            orderBy: {
                category: 'asc'
            }
        });
        
        // Group by category
        const groupedMenu = items.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});
        
        res.status(200).json({
            filters: {
                category: category || 'all',
                max_price: max_price ? Number.parseFloat(max_price) : 'all'
            },
            menu: groupedMenu
        });
    } catch (err) {
        logger('error', err.message);
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
        logger('error', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateMenuItem = async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { id } = req.params;
        const updated = await prisma.menuItem.update({
            where: { id: Number.parseInt(id) },
            data: req.body,
        });
        res.status(200).json(updated);
    } catch (err) {
        logger('error', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { id } = req.params;
        await prisma.menuItem.delete({ where: { id: Number.parseInt(id) } });
        res.status(204).send();
    } catch (err) {
        logger('error', err.message);
        res.status(500).json({ error: err.message });
    }
};