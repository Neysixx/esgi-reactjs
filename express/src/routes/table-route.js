const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/', authMiddleware, tableController.getTables);
router.post('/', authMiddleware, tableController.createTable);
router.put('/:id', authMiddleware, tableController.updateTable);
router.delete('/:id', authMiddleware, tableController.deleteTable);

module.exports = router;