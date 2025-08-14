const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    email: String,
    phone: String,
    countryCode: String,
    stripeSessionId: String,
    stripePaymentIntentId: String,
    amount: Number,
    currency: String,
    presentmentCurrency: String,
    presentmentAmount: Number,
    paymentMethodType: String,
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "requires_payment_method", "failed"],
      default: "unpaid",
    },
    status: String,
    customerDetails: {
      name: String,
      email: String,
      phone: String,
      address: {
        city: String,
        country: String,
        line1: String,
        line2: String,
        postal_code: String,
        state: String,
      },
      tax_exempt: String,
      tax_ids: [mongoose.Schema.Types.Mixed],
    },
    errorMessage: String,
    errorCode: String,
    declineCode: String,
    errorType: String,
    errorDocUrl: String,
    subscription: String,
    livemode: Boolean,
    metadata: mongoose.Schema.Types.Mixed,
    stripeCreatedAt: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports =  PaymentSchema
