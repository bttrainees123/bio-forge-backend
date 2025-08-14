const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const UserSubscription = require('../../model/userSubcription.model'); 

const PRICING_CONFIG = {
  pro: {
    monthly: {
      price: 99,
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID, 
      interval: 'month'
    },
    annual: {
      price: 995.17,
      priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID, 
      interval: 'year'
    }
  },
  premium: {
    monthly: {
      price: 399,
      priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID, 
      interval: 'month'
    },
    annual: {
      price: 1825.17,
      priceId: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID, 
      interval: 'year'
    }
  }
};

class PaymentController {
  static async createCheckoutSession(req, res) {
    try {
      const { plan, billingCycle, customerEmail, successUrl, cancelUrl } = req.body;

      if (!PRICING_CONFIG[plan] || !PRICING_CONFIG[plan][billingCycle]) {
        return res.status(400).json({ 
          status: false,
          message: 'Invalid plan or billing cycle' 
        });
      }

      const planConfig = PRICING_CONFIG[plan][billingCycle];
      const baseUrl = process.env.CLIENT_URL || 'http://192.168.0.158:5173/';

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: planConfig.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl || `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${baseUrl}/pricing?canceled=true`,
        customer_email: customerEmail,
        metadata: {
          plan: plan,
          billingCycle: billingCycle,
        },
        subscription_data: {
          metadata: {
            plan: plan,
            billingCycle: billingCycle,
          },
        },
        allow_promotion_codes: true,
      });

      res.status(200).json({
        status: true,
        message: 'Checkout session created successfully',
        data: {
          sessionId: session.id,
          url: session.url
        }
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ 
        status: false,
        message: 'Failed to create checkout session',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  static async getCheckoutSession(req, res) {
    try {
      const { sessionId } = req.params;
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      res.status(200).json({
        status: true,
        message: 'Session retrieved successfully',
        data: {
          paymentStatus: session.payment_status,
          customerEmail: session.customer_details?.email,
          plan: session.metadata?.plan,
          billingCycle: session.metadata?.billingCycle,
          customerId: session.customer,
          subscriptionId: session.subscription
        }
      });
    } catch (error) {
      console.error('Error retrieving session:', error);
      res.status(500).json({ 
        status: false,
        message: 'Failed to retrieve session',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Create Customer Portal Session
  static async createPortalSession(req, res) {
    try {
      const { customerId, returnUrl } = req.body;
      const baseUrl = process.env.CLIENT_URL || 'http://192.168.0.158:5173/';

      if (!customerId) {
        return res.status(400).json({
          status: false,
          message: 'Customer ID is required'
        });
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl || `${baseUrl}/dashboard`,
      });

      res.status(200).json({
        status: true,
        message: 'Portal session created successfully',
        data: {
          url: portalSession.url
        }
      });
    } catch (error) {
      console.error('Error creating portal session:', error);
      res.status(500).json({ 
        status: false,
        message: 'Failed to create portal session',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Get Subscription Details
  static async getSubscription(req, res) {
    try {
      const { subscriptionId } = req.params;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      res.status(200).json({
        status: true,
        message: 'Subscription retrieved successfully',
        data: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          plan: subscription.metadata?.plan,
          billingCycle: subscription.metadata?.billingCycle,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      });
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      res.status(500).json({ 
        status: false,
        message: 'Failed to retrieve subscription',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Cancel Subscription
  static async cancelSubscription(req, res) {
    try {
      const { subscriptionId } = req.body;
      
      if (!subscriptionId) {
        return res.status(400).json({
          status: false,
          message: 'Subscription ID is required'
        });
      }

      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      
      res.status(200).json({
        status: true,
        message: 'Subscription will be canceled at period end',
        data: {
          cancelAt: subscription.cancel_at,
          currentPeriodEnd: subscription.current_period_end
        }
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({ 
        status: false,
        message: 'Failed to cancel subscription',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  // Webhook Handler
  static async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log("webhook is calling here...............",req.body);

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await PaymentController.handleSuccessfulPayment(event.data.object);
          break;
        
        case 'customer.subscription.updated':
          await PaymentController.handleSubscriptionUpdate(event.data.object);
          break;
        
        case 'customer.subscription.deleted':
          await PaymentController.handleSubscriptionCancellation(event.data.object);
          break;
        
        case 'invoice.payment_failed':
          await PaymentController.handlePaymentFailed(event.data.object);
          break;

        case 'invoice.payment_succeeded':
          await PaymentController.handlePaymentSucceeded(event.data.object);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  // Helper method to handle successful payment
  static async handleSuccessfulPayment(session) {
    try {
      console.log('Processing successful payment for:', {
        customerId: session.customer,
        customerEmail: session.customer_details?.email,
        plan: session.metadata?.plan,
        billingCycle: session.metadata?.billingCycle,
        subscriptionId: session.subscription
      });

      // Update or create user subscription in database
      await UserSubscription.findOneAndUpdate(
        { email: session.customer_details?.email },
        {
          email: session.customer_details?.email,
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
          plan: session.metadata?.plan,
          billingCycle: session.metadata?.billingCycle,
          status: 'active',
          currentPeriodEnd: new Date(session.expires_at * 1000),
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );

      // Here you can add additional logic like:
      // - Send welcome email
      // - Update user permissions
      // - Log the transaction
      
    } catch (error) {
      console.error('Error handling successful payment:', error);
      throw error;
    }
  }


  static async handleSubscriptionUpdate(subscription) {
    try {
      console.log('Subscription updated:', subscription.id);
      
      await UserSubscription.findOneAndUpdate(
        { subscriptionId: subscription.id },
        {
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          updatedAt: new Date()
        }
      );
    } catch (error) {
      console.error('Error handling subscription update:', error);
      throw error;
    }
  }

  // Helper method to handle subscription cancellation
  static async handleSubscriptionCancellation(subscription) {
    try {
      console.log('Subscription canceled:', subscription.id);
      
      await UserSubscription.findOneAndUpdate(
        { subscriptionId: subscription.id },
        {
          status: 'canceled',
          canceledAt: new Date(),
          updatedAt: new Date()
        }
      );

      // Here you can add logic to:
      // - Revoke premium features
      // - Send cancellation email
      // - Log the cancellation
      
    } catch (error) {
      console.error('Error handling subscription cancellation:', error);
      throw error;
    }
  }

  // Helper method to handle failed payments
  static async handlePaymentFailed(invoice) {
    try {
      console.log('Payment failed for invoice:', invoice.id);
      
      // Find subscription by customer
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      
      await UserSubscription.findOneAndUpdate(
        { subscriptionId: subscription.id },
        {
          status: 'past_due',
          lastPaymentFailed: new Date(),
          updatedAt: new Date()
        }
      );

      // Here you can add logic to:
      // - Send payment failed email
      // - Restrict premium features
      // - Set up retry logic
      
    } catch (error) {
      console.error('Error handling payment failure:', error);
      throw error;
    }
  }

  // Helper method to handle successful recurring payments
  static async handlePaymentSucceeded(invoice) {
    try {
      console.log('Payment succeeded for invoice:', invoice.id);
      
      if (invoice.billing_reason === 'subscription_cycle') {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        
        await UserSubscription.findOneAndUpdate(
          { subscriptionId: subscription.id },
          {
            status: 'active',
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            lastPaymentSucceeded: new Date(),
            updatedAt: new Date()
          }
        );
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }
}

module.exports = PaymentController;