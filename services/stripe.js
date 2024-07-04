const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
})

exports.createPaymentIntent = async function createPaymentIntent() {
  return await stripe.paymentIntents.create({
    amount: 10000,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    description: 'Purchase 100 OGC Crypto Tokens at $1.00 USD each',
  });
  // return paymentIntent.client_secret
  // NOTE: Amount is in cents, default being 100 cents for 1.00 USD
}

// this.createPaymentIntent().then(result => console.log(result.description))