import { stripe } from "../app";


export async function createStripeCustomer(email: string) {
  try {
    const customer = await stripe.customers.create({
      email: email,
    });
    if (!customer.id) {
      throw new Error("Failed to create Stripe customer");
    }
    return customer;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw new Error("Failed to create Stripe customer");
  }
}

