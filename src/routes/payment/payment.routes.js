const express = require('express');
const router = express.Router();
const paymentController = require('../../controller/app/payment.controller');

// Create checkout session
router.post('/create-checkout-session', paymentController.createCheckoutSession);

// Get checkout session details
router.get('/checkout-session/:sessionId', paymentController.getCheckoutSession);

// Create customer portal session
router.post('/create-portal-session', paymentController.createPortalSession);

// Get subscription details
router.get('/subscription/:subscriptionId', paymentController.getSubscription);

// Cancel subscription
router.post('/cancel-subscription', paymentController.cancelSubscription);

// Webhook endpoint
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;