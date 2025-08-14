// src/services/paymentService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3006/api';

class PaymentService {
  // Create checkout session
  static async createCheckoutSession(planData) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });

      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Get checkout session details
  static async getCheckoutSession(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/checkout-session/${sessionId}`);
      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.message || 'Failed to get checkout session');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting checkout session:', error);
      throw error;
    }
  }

  // Create customer portal session
  static async createPortalSession(customerId, returnUrl = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, returnUrl }),
      });

      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.message || 'Failed to create portal session');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }

  // Get subscription details
  static async getSubscription(subscriptionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/subscription/${subscriptionId}`);
      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.message || 'Failed to get subscription');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.message || 'Failed to cancel subscription');
      }

      return data.data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Get user subscription (you'll need to create this endpoint)
  static async getUserSubscription(userEmail) {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/user/subscription?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (!data.status) {
        throw new Error(data.message || 'Failed to get user subscription');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      throw error;
    }
  }
}

export default PaymentService;