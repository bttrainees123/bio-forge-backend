const checkoutSessionModel = require("../../model/CheckoutSession.model")
const { FrontendUrl } = require("../../config/stripe");
const subscriptionService = {};
subscriptionService.getInfo = async (request) => {
    const { _id, subscriptionExpiry, subscriptionType } = request.auth || {};
    const checkoutSession = await checkoutSessionModel.findOne({
        userId: _id,
        status: "complete"
    });
    const now = new Date();
    const expiryDate = new Date(subscriptionExpiry);
    const response = (message, isSubscription) => ({
        message,
        data: { isSubsciption: isSubscription, Url: FrontendUrl }
    });
    if (subscriptionType === 'free') {
        const msg = checkoutSession
            ? "Your subscription has expired Please renew your subscription"
            : "Access denied This feature is available to subscribed users only Please upgrade your plan to access it";
        return response(msg, false);
    }
    const diffMs = expiryDate - now;
    if (diffMs > 0) {
        const totalHours = diffMs / 36e5;
        let message = "You all set Enjoy your exclusive access and updates"
        if (totalHours >= 24) {
            message = message + " " + "Your subscription ends in";
            const days = Math.ceil(totalHours / 24) - 1;
            message += ` ${days} ${days === 1 ? "day" : "days"}.`;
        } else {
            message += "Just a moment left on your subscription";
        }
        return response(message, false);
    }
    return response("Your subscription has expired Please renew your subscription", false);
};
module.exports = subscriptionService;
