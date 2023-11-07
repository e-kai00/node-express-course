const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const stripeController = async (req, res) => {
    const {purchase, total_amount, shipping_fee} = req.body;

    //1- communicate w/ backend to ensure prices are correct
    const calculateOrderAmmount = () => {
        return total_amount + shipping_fee;
    };

    // 2- create an intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmmount(),
        currency: 'usd',
    });
    // 3- send clientSecret for frontend
    res.json({clientSecret: paymentIntent.client_secret})
}


module.exports = stripeController;