import { Request, Response } from "express";
import { prisma } from "../prisma"; // Adjust the import based on your project structure
import { stripe } from "../app"; // Assuming you have initialized Stripe in app.ts
import jwt from "jsonwebtoken";
import { createStripeCustomer } from "../services/stripeService";


export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const token = req.cookies.token;

    const isYearly = req.body.isYearly || false; // Default to false if not provided

    const userId = (jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }).userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }


    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Create Stripe customer if not exists
    if (!user.stripeId) {
        const stripeCustomer = await createStripeCustomer(user.email);
        user.stripeId = stripeCustomer.id;
        await prisma.user.update({
            where: { id: userId },
            data: { stripeId: user.stripeId },
        });
    }

    const lookupKey = isYearly ? process.env.STRIPE_YEARLY_LOOKUP_KEY : process.env.STRIPE_MONTHLY_LOOKUP_KEY;

    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey!],
      expand: ['data.product'],
    });


    const session = await stripe.checkout.sessions.create({
      customer: user.stripeId,
      billing_address_collection: 'auto',
      line_items: [{ price: prices.data[0].id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONT_END_URL}/upgrade/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_END_URL}/upgrade/?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};