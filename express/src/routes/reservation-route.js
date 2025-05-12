const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation-controller');
const authMiddleware = require("../middleware/auth-middleware");

router.get('/', authMiddleware, reservationController.getAllReservations); // Admin
router.get('/my-reservations', authMiddleware, reservationController.getMyReservations); // Client
router.get('/availability', reservationController.checkAvailability); // Public
router.post('/', authMiddleware, reservationController.createReservation); // Client
router.put('/:id', authMiddleware, reservationController.updateReservation); // Client/Admin
router.delete('/:id', authMiddleware, reservationController.deleteReservation); // Client/Admin
router.patch('/:id/validate', authMiddleware, reservationController.validateReservation); // Admin

module.exports = router;