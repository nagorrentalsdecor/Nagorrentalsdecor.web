const express = require('express');
const router = express.Router();
const { getPackages, createPackage, deletePackage } = require('../controllers/packageController');

router.route('/').get(getPackages).post(createPackage);
router.route('/:id').delete(deletePackage);

module.exports = router;
