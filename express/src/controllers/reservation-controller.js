const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');
const prisma = new PrismaClient();

exports.createReservation = async (req, res) => {
    try {
        const { numberOfPeople, date, time, note } = req.body;
        
        // Validate input
        if (!numberOfPeople || !date || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find available tables for the reservation
        const availableTables = await findAvailableTables(date, time);
        
        // Check if we have enough tables to accommodate the guests
        const tableAssignment = assignTables(availableTables, numberOfPeople);
        
        if (!tableAssignment.success) {
            return res.status(400).json({ 
                error: 'No tables available for the requested number of people at this time' 
            });
        }

        // Create reservation with transaction to ensure atomicity
        const reservation = await prisma.$transaction(async (tx) => {
            // Create the reservation
            const newReservation = await tx.reservation.create({
                data: {
                    userId: req.user.id,
                    numberOfPeople,
                    date: new Date(date),
                    time,
                    note,
                }
            });

            // Assign tables
            for (const tableId of tableAssignment.tableIds) {
                await tx.reservationTable.create({
                    data: {
                        reservationId: newReservation.id,
                        tableId
                    }
                });
            }

            return newReservation;
        });

        // Get the complete reservation with assigned tables
        const completeReservation = await prisma.reservation.findUnique({
            where: { id: reservation.id },
            include: {
                tables: {
                    include: {
                        table: true
                    }
                }
            }
        });

        // Log notification
        logger('info', `Réservation "pending" pour ${req.user.fname} ${req.user.lname} à ${time} le ${new Date(date).toLocaleDateString()}.`);

        res.status(201).json(completeReservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// Find available tables for a specific date and time
async function findAvailableTables(date, time) {
    const dateObj = new Date(date);
    
    // Get all reservations for this date and time
    const reservations = await prisma.reservation.findMany({
        where: {
            date: {
                equals: dateObj
            },
            time: time,
            status: {
                in: ['pending', 'confirmed']
            }
        },
        include: {
            tables: true
        }
    });
    
    // Get IDs of tables already reserved
    const reservedTableIds = new Set();
    for (const reservation of reservations) {
        for (const table of reservation.tables) {
            reservedTableIds.add(table.tableId);
        }
    }
    
    // Get all available tables
    const allTables = await prisma.table.findMany();
    return allTables.filter(table => !reservedTableIds.has(table.id));
}

// Assign tables based on number of people
function assignTables(availableTables, numberOfPeople) {
    // Sort tables by seat count (ascending)
    const sortedTables = [...availableTables].sort((a, b) => a.seats - b.seats);
    
    let remainingPeople = numberOfPeople;
    const assignedTables = [];
    
    // First pass: try to find an exact fit
    for (const table of sortedTables) {
        if (table.seats === remainingPeople) {
            assignedTables.push(table);
            remainingPeople = 0;
            break;
        }
    }
    
    // Second pass: if no exact fit, try to accommodate with multiple tables
    if (remainingPeople > 0) {
        // Reset
        remainingPeople = numberOfPeople;
        assignedTables.length = 0;
        
        // Sort tables by seat count (descending for best fit first)
        const tablesDesc = [...sortedTables].sort((a, b) => b.seats - a.seats);
        
        for (const table of tablesDesc) {
            if (table.seats <= remainingPeople) {
                assignedTables.push(table);
                remainingPeople -= table.seats;
            }
            
            if (remainingPeople <= 0) break;
        }
    }
    
    // Check if we could accommodate all people
    if (remainingPeople > 0) {
        return { success: false };
    }
    
    return { 
        success: true, 
        tableIds: assignedTables.map(table => table.id)
    };
}

exports.getAllReservations = async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { date, status, sort } = req.query;
        
        // Build where condition
        const whereCondition = {};
        
        if (date) {
            const dateObj = new Date(date);
            if (!Number.isNaN(dateObj.getTime())) {
                whereCondition.date = {
                    equals: dateObj
                };
            }
        }
        
        if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
            whereCondition.status = status;
        }
        
        // Build orderBy condition
        let orderBy = { date: 'asc' }; // Default sort
        
        if (sort) {
            const [field, order] = sort.split(':');
            if (field && ['date', 'time', 'numberOfPeople', 'status'].includes(field)) {
                orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' };
            }
        }
        
        // Get reservations with filters and sorting
        const reservations = await prisma.reservation.findMany({
            where: whereCondition,
            include: { 
                user: {
                    select: {
                        id: true,
                        fname: true,
                        lname: true,
                        email: true,
                        phone: true
                    }
                }, 
                tables: {
                    include: {
                        table: true
                    }
                } 
            },
            orderBy
        });
        
        res.status(200).json({
            filters: {
                date: date || 'all',
                status: status || 'all',
                sort: sort || 'date:asc'
            },
            count: reservations.length,
            reservations
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getMyReservations = async (req, res) => {
    try {
        const userId = req.user.id;
        const reservations = await prisma.reservation.findMany({
            where: { userId },
            include: {
                tables: {
                    include: {
                        table: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        });
        
        // Calculate total seats for each reservation
        const enhancedReservations = reservations.map(reservation => {
            const totalSeats = reservation.tables.reduce((sum, t) => sum + t.table.seats, 0);
            return {
                ...reservation,
                totalSeats,
                tableDetails: reservation.tables.map(t => ({
                    id: t.table.id,
                    seats: t.table.seats
                }))
            };
        });
        
        res.status(200).json(enhancedReservations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await prisma.reservation.findUnique({ where: { id: Number.parseInt(id) } });
        if (!reservation || (!req.user.isAdmin && reservation.userId !== req.user.id)) return res.sendStatus(403);
        if (reservation.status !== 'pending') return res.status(400).json({ error: 'Reservation not editable' });

        const { numberOfPeople, date, time, note } = req.body;
        const updated = await prisma.reservation.update({
            where: { id: Number.parseInt(id) },
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
        const reservationId = Number.parseInt(id);
        
        const reservation = await prisma.reservation.findUnique({ 
            where: { id: reservationId },
            include: { user: true }
        });
        
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        
        if (!req.user.isAdmin && reservation.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to cancel this reservation' });
        }
        
        // Instead of deleting, update status to cancelled
        const updated = await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: 'cancelled' },
        });
        
        // Log notification
        logger('info', `Réservation "annulée" pour ${reservation.user.fname} ${reservation.user.lname} à ${reservation.time} le ${reservation.date.toLocaleDateString()}.`);
        
        res.status(200).json(updated);
    } catch (err) {
        logger('error', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.validateReservation = async (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    try {
        const { id } = req.params;
        const reservationId = Number.parseInt(id);
        
        // Get the reservation with user details
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { user: true }
        });
        
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        
        const updated = await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: 'confirmed' },
        });
        
        // Log notification
        logger('info', `Réservation "confirmée" pour ${reservation.user.fname} ${reservation.user.lname} à ${reservation.time} le ${reservation.date.toLocaleDateString()}.`);
        
        res.status(200).json(updated);
    } catch (err) {
        logger('error', err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.checkAvailability = async (req, res) => {
    try {
        const { date, time, numberOfPeople } = req.query;
        
        if (!date || !time) {
            return res.status(400).json({ error: 'Date and time are required' });
        }
        
        // Find available tables
        const availableTables = await findAvailableTables(date, time);
        
        // If numberOfPeople is provided, check if we can accommodate them
        let canAccommodate = true;
        let requiredTables = [];
        let totalSeatsAvailable = 0;
        
        if (numberOfPeople) {
            const people = Number.parseInt(numberOfPeople, 10);
            if (!Number.isNaN(people)) {
                const tableAssignment = assignTables(availableTables, people);
                canAccommodate = tableAssignment.success;
                if (canAccommodate) {
                    requiredTables = tableAssignment.tableIds.map(id => 
                        availableTables.find(table => table.id === id)
                    );
                }
            }
        }
        
        // Calculate total available seats
        totalSeatsAvailable = availableTables.reduce((sum, table) => sum + table.seats, 0);
        
        res.status(200).json({
            date,
            time,
            availableTables,
            totalSeatsAvailable,
            maxPeopleAccommodable: totalSeatsAvailable,
            requestedPeople: numberOfPeople ? Number.parseInt(numberOfPeople, 10) : null,
            canAccommodate: numberOfPeople ? canAccommodate : null,
            requiredTables: numberOfPeople ? requiredTables : null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};