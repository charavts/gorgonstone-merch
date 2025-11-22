import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import Stripe from "npm:stripe@17.4.0";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-deab0cbd/health", (c) => {
  return c.json({ status: "ok" });
});

// Create Stripe checkout session
app.post("/make-server-deab0cbd/create-checkout", async (c) => {
  try {
    console.log("Starting checkout session creation...");
    
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Stripe secret key not found in environment variables");
      return c.json({ error: "Stripe configuration error - missing secret key" }, 500);
    }

    console.log("Stripe key found, initializing Stripe...");
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    const body = await c.req.json();
    const { items } = body;

    console.log("Received items:", JSON.stringify(items));

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items provided:", items);
      return c.json({ error: "Invalid items provided" }, 400);
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${item.name} - Size: ${item.size}`,
          // Remove images as they might cause issues
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    console.log("Creating Stripe checkout session with line items:", JSON.stringify(lineItems));

    // Get the base URL from origin
    const origin = c.req.header("origin") || "https://gorgonstone-merch.verch.app";
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/cart`,
    });

    console.log("Checkout session created successfully:", session.id);
    console.log("Checkout URL:", session.url);

    return c.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    return c.json({ 
      error: `Failed to create checkout session: ${error.message}`,
      details: error.toString()
    }, 500);
  }
});

Deno.serve(app.fetch);