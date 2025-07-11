const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("Only POST requests allowed")
    }

    const { amount, message } = req.body

    if (!amount || typeof amount !== "number") {
        return res.status(400).json({ error: "Invalid amount" })
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "gbp",
            metadata: { message: message || "" },
        })

        res.status(200).json({ clientSecret: paymentIntent.client_secret })
    } catch (err) {
        console.error("Stripe error:", err)
        res.status(500).json({ error: "Stripe failed" })
    }
}
