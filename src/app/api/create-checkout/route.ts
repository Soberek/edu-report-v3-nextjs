import Stripe from "stripe";
import { NextResponse } from "next/server";

interface CheckoutItem {
  name: string;
  description?: string;
  image?: string;
  price: number;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      console.error("STRIPE_SECRET_KEY is not set in environment");
      return NextResponse.json({ error: "Stripe secret key not configured on server." }, { status: 500 });
    }

    const stripe = new Stripe(secret, { apiVersion: "2025-09-30.clover" });

    const body = await req.json();
    const { items, successUrl, cancelUrl } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const line_items = items.map((item: CheckoutItem) => ({
      price_data: {
        currency: "pln",
        product_data: {
          name: item.name,
          description: item.description,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }));

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3001`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: successUrl || `${baseUrl}/success`,
      cancel_url: cancelUrl || `${baseUrl}/dietetyk`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "Server error" }, { status: 500 });
  }
}
