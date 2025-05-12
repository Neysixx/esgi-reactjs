const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/', menuController.getMenu);
router.post('/', authMiddleware, menuController.createMenuItem);
router.put('/:id', authMiddleware, menuController.updateMenuItem);
router.delete('/:id', authMiddleware, menuController.deleteMenuItem);

module.exports = router;