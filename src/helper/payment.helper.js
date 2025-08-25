const paymentHelper = {
    getPlanLimits: (planType) => {
        const limits = {
            free: {
                subscriberLimit: 100,
                templates: 'basic',
                analytics: 'basic',
                customDomain: false,
                prioritySupport: false
            },
            pro: {
                subscriberLimit: 1000,
                templates: 'premium',
                analytics: 'advanced',
                customDomain: true,
                prioritySupport: true
            },
            premium: {
                subscriberLimit: -1, // Unlimited
                templates: 'premium_plus',
                analytics: 'advanced_export',
                customDomain: true,
                prioritySupport: '24/7'
            }
        };
        return limits[planType];
    },

    calculateNextBillingDate: (billingCycle, startDate = new Date()) => {
        const date = new Date(startDate);
        if (billingCycle === 'monthly') {
            date.setMonth(date.getMonth() + 1);
        } else if (billingCycle === 'annual') {
            date.setFullYear(date.getFullYear() + 1);
        }
        return date;
    },

    formatAmount: (amount, currency = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
};

module.exports = paymentHelper;