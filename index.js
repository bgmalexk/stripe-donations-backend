import express from "express"
import Stripe from "stripe"
import cors from "cors"

const app = express()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.use(cors())
app.use(express.json())

app.post("/create-payment-intent", async (req, res) => {
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
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
