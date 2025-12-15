const express = require('express');
const router = express.Router();
const {
  addSweet, updateSweet, deleteSweet, restockSweet,
  getSweets, searchSweets, purchaseSweet
} = require('../controllers/sweetController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSweets).post(protect, admin, addSweet);
router.route('/search').get(protect, searchSweets);
router.route('/:id').put(protect, updateSweet).delete(protect, deleteSweet);
router.route('/restock/:id').put(protect, restockSweet);
router.route('/purchase/:id').put(protect, purchaseSweet);

module.exports = router;
