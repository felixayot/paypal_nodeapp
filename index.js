const express = require('express')
var cors = require('cors')
const paypal = require('./services/paypal')
const stripe = require('./services/stripe')

const app = express()

app.set('view engine', 'ejs')

var corsOptions = {
    origin: 'http://localhost:5173',
    // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/api/stripe/config', cors(corsOptions), (req, res, next) => {
    res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }); 

app.get('/api/stripe/create-payment-intent', cors(corsOptions), async (req, res, next) => {
    try {
        const paymentIntent = await stripe.createPaymentIntent()
        res.send({
            clientSecret: paymentIntent.client_secret,
            paymentDetails: paymentIntent.description,
        })
    } catch (error) {
        res.status(400).send({
            error: { message: error.message }
        })
    }
})
 

app.post('/buy', async (req, res) => {
    try {
        const approveOrderUrl = await paypal.createOrder()
        res.redirect(approveOrderUrl)
        } catch (error) {
        res.status(500).send('Error:' + error)
        }
})

app.get('/complete-order', async (req, res) => {
    try {
        await paypal.capturePayment(req.query.token)
        res.send('You have successfully purchased the OGC Crypto tokens')
    } catch (error) {
        res.status(500).send('Error:' + error)
    }
})

app.get('/cancel-order', (req, res) => {
    res.redirect('/')
})

app.listen(4242, () => {
    console.log('Server is running on port 4242')
})
