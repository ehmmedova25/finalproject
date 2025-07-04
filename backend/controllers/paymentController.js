import stripe from "../utils/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { items, customerInfo } = req.body;

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: [item.product.images[0]],
        },
        unit_amount: Math.round((item.product.discountPrice || item.product.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error("Stripe Session Xətası:", error.message);
    res.status(500).json({ message: "Ödəniş xətası: " + error.message });
  }
};
