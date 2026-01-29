const express = require('express');
const router = express.Router();
const { getItems, createItem, deleteItem } = require('../controllers/itemController');

router.route('/').get(getItems).post(createItem);
router.route('/:id').delete(deleteItem);

module.exports = router;
