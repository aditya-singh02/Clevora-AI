export const plans = [
    {
        id: 'starter', name: 'Starter', inr: 0, usd: 0, credits: 100,
        desc: 'Perfect to get started', popular: false, cta: 'Claim Free Credits',
        features: ['5 AI Interview ', 'Resume analysis', 'Voice + text mode', 'Basic score report', 'Email support'],
    },
    {
        id: 'pro', name: 'Pro', inr: 199, usd: 3, credits: 500,
        desc: 'For serious job seekers', popular: true, cta: 'Get Pro',
        features: ['25 AI Interviews', 'Resume analysis', 'Voice + text mode', 'Detailed score report', 'Integrity monitoring', 'Priority support', 'Interview history'],
    },
    {
        id: 'expert', name: 'Expert', inr: 349, usd: 5, credits: 1200,
        desc: 'For campus placements', popular: false, cta: 'Go Expert',
        features: ['60 AI Interviews', 'Resume analysis', 'Voice + text mode', 'Full analytics report', 'Integrity monitoring', 'Dedicated support', 'Performance trends', 'Interview history'],
    },
]

export const paymentMethods = [
    { label: 'Razorpay' }, { label: 'Visa' }, { label: 'Mastercard' },
    { label: 'UPI' }, { label: 'RuPay' }, { label: 'Net Banking' }, { label: 'Wallets' },
]