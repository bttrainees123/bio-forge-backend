const express = require('express');
const router = express.Router();
const paymentController = require('../../controller/admin/payment.controller');
const authMiddleware = require('../../middleware/user.middleware');
const { handleStripeWebhook } = require('../../webhooks/stripe.webhook');

// Protected routes
router.post('/create-checkout-session', authMiddleware, paymentController.createCheckoutSession);
router.post('/verify-payment', authMiddleware, paymentController.verifyPayment);
router.get('/subscription', authMiddleware, paymentController.getUserSubscription);
router.post('/cancel-subscription', authMiddleware, paymentController.cancelSubscription);
router.get('/history', authMiddleware, paymentController.getPaymentHistory);

// Webhook route (no auth required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;