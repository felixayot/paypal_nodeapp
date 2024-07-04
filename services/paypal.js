const axios = require('axios')

async function generateAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    const response = await axios({
        url: `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: clientId,
            password: clientSecret
        },
    })

    return response.data.access_token
}

exports.createOrder = async function createOrder() {
    const accessToken = await generateAccessToken()

    const response = await axios({
        url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
        method: 'post',
        headers: {
            'content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: [
                        {
                            name: 'OGC Crypto tokens',
                            description: 'Buy 100 OGC Crypto tokens for $1(1.00 USDT) each',
                            unit_amount: {
                                currency_code: 'USD',
                                value: '1.00'
                            },
                            quantity: 100
                        }
                    ],

                    amount: {
                        currency_code: 'USD',
                        value: '100.00',
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: '100.00'
                            }
                        }
                    }
                }
            ],

            application_context: {
                brand_name: 'flexcotech.xyz',
                // landing_page: 'NO_PREFERENCE',
                user_action: 'PAY_NOW',
                return_url: `${process.env.BASE_URL}/complete-order`,
                cancel_url: `${process.env.BASE_URL}/cancel-order`,
                shipping_preference: 'NO_SHIPPING'
            }
        })
    })

    return response.data.links.find(link => link.rel === 'approve').href
}
// this.createOrder().then(result => console.log(result))

exports.capturePayment = async function capturePayment(orderId) {
    const accessToken = await generateAccessToken()

    const response = await axios({
        url: `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    })

    return response.data
}
