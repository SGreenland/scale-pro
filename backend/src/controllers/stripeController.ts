import { Request, Response } from "express";
import { stripe } from "../app"; // Assuming you have initialized Stripe in app.ts
import { prisma } from "../prisma"; // Adjust the import based on your project structure
import { createStripeCustomer } from "../services/stripeService";

export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const isYearly = req.body.isYearly || false; // Default to false if not provided

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

    const lookupKey = isYearly
      ? process.env.STRIPE_YEARLY_LOOKUP_KEY
      : process.env.STRIPE_MONTHLY_LOOKUP_KEY;

    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey!],
      expand: ["data.product"],
    });

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeId,
      billing_address_collection: "auto",
      line_items: [{ price: prices.data[0].id, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.FRONT_END_URL}/upgrade/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONT_END_URL}/upgrade/?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}

//customer portal to manage subscriptions
export async function customerPortal(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeId) {
      return res
        .status(400)
        .json({ error: "User or Stripe customer not found" });
    }

    const session = await stripe.billingPortal.sessions.create({

      customer: user.stripeId,
      return_url: `${process.env.FRONT_END_URL}/my-account`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Customer portal error:", err);
    res.status(500).json({ error: "Failed to create customer portal session" });
  }
}

//webhook to listen for subscription creation and update user subscription model
export async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err || "Invalid signature"}`);
  }

  switch (event.type) {
    case "customer.subscription.created":
      const subscription = event.data.object;
      const status = subscription.status;
      const subscriptionId = subscription.id;
      const customerId = subscription.customer as string;

      // Find the user by Stripe customer ID
      const user = await prisma.user.findFirst({
        where: { stripeId: customerId },
        include: { subscription: true },
      });

      if (user && !user.subscription) {
        await prisma.subscription.create({
          data: {
            userId: user.id,
            stripeSubId: subscriptionId,
            status: status,
            startedAt: new Date(subscription.start_date * 1000), // Convert to milliseconds
            expiresAt: null,
          },
        });
      }
      break;

    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
