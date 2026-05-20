const express = require('express');
const router = express.Router();
const { 
  getAllUsers,
  getPendingVerifications, 
  verifyUser, 
  suspendUser, 
  getReports, 
  resolveReport, 
  getAnalytics 
} = require('../controllers/adminController');

router.get('/users', getAllUsers);
router.get('/users/pending-verification', getPendingVerifications);
router.patch('/users/:id/verify', verifyUser);
router.patch('/users/:id/suspend', suspendUser);

router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);

router.get('/analytics', getAnalytics);

module.exports = router;
