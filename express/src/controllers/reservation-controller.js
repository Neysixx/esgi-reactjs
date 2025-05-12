const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createReservation = async (req, res) => {
    try {
        const { numberOfPeople, date, time, note } = req.body;
        const reservation = await prisma.reservation.create({
            data: {
                userId: req.user.id,
                numberOfPeople,
                date: new Date(date),
                time,
                note,
            },
        });
        res.status(201).json(reservation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllReservations = async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const reservations = await prisma.reservation.findMany({
            include: { user: true, tables: true },
        });
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMyReservations = async (req, res) => {
    try {
        const userId = req.user.id;
        const reservations = await prisma.reservation.findMany({
            where: { userId },
        });
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await prisma.reservation.findUnique({ where: { id: parseInt(id) } });
        if (!reservation || (!req.user.isAdmin && reservation.userId !== req.user.id)) return res.sendStatus(403);
        if (reservation.status !== 'pending') return res.status(400).json({ error: 'Reservation not editable' });

        const { numberOfPeople, date, time, note } = req.body;
        const updated = await prisma.reservation.update({
            where: { id: parseInt(id) },
            data: { numberOfPeople, date: new Date(date), time, note },
        });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await prisma.reservation.findUnique({ where: { id: parseInt(id) } });
        if (!reservation || (!req.user.isAdmin && reservation.userId !== req.user.id)) return res.sendStatus(403);
        await prisma.reservation.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.validateReservation = async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { id } = req.params;
        const updated = await prisma.reservation.update({
            where: { id: parseInt(id) },
            data: { status: 'confirmed' },
        });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};