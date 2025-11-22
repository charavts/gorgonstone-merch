import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import Stripe from "npm:stripe@17.4.0";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods - MUST be before all routes
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: false,
  }),
);

// Handle preflight requests explicitly
app.options("/*", (c) => {
  return c.text("", 204);
});

// Health check endpoint
app.get("/make-server-deab0cbd/health", (c) => {
  console.log("Health check called");
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
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

    // Log the key type (test vs live) - SAFE to log, shows only prefix
    const keyPrefix = stripeSecretKey.substring(0, 8); // Shows "sk_test_" or "sk_live_"
    console.log(`✅ Stripe key type detected: ${keyPrefix}...`);
    console.log(`🔑 Using ${keyPrefix.includes('test') ? 'TEST' : 'LIVE'} mode`);

    console.log("Stripe key found, initializing Stripe...");
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-11-20.acacia",
    });

    const body = await c.req.json();
    const { items, locale } = body;

    console.log("Received items:", JSON.stringify(items));
    console.log("Received locale:", locale);

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
    
    // Determine Stripe locale - 'el' for Greek, 'en' for English (default)
    const stripeLocale = locale === 'el' ? 'el' : 'en';
    console.log(`Setting Stripe checkout locale to: ${stripeLocale}`);
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/cart`,
      locale: stripeLocale, // Set the language for Stripe Checkout
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['GR', 'CY', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'SE', 'DK', 'NO', 'FI', 'PT', 'IE', 'LU', 'CH'],
      },
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