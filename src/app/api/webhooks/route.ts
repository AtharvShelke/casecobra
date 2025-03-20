import { db } from "@/db"; 
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
    try {
        const body = await request.text();
        const signature = headers().get("stripe-signature");

        if (!signature) {
            console.error("❌ Missing Stripe signature");
            return new Response('Invalid signature', { status: 400 });
        }

        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error("❌ STRIPE_WEBHOOK_SECRET is missing");
            return new Response("Server error: Stripe webhook secret is missing", { status: 500 });
        }

        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error("❌ Webhook signature verification failed:", err);
            return new Response("Webhook signature verification failed", { status: 400 });
        }

        console.log("🔄 Stripe Webhook Event Received:", event.type);

        if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
            const session = event.data.object as Stripe.Checkout.Session;

            // ✅ Ensure metadata exists
            if (!session.metadata?.userId || !session.metadata?.orderId) {
                console.error("❌ Missing metadata:", session.metadata);
                return new Response("Invalid metadata", { status: 400 });
            }

            const { userId, orderId } = session.metadata;
            console.log("✅ Processing payment for:", { orderId, userId });

            // ✅ Check if the order exists in the database
            const existingOrder = await db.order.findUnique({ where: { id: orderId } });

            if (!existingOrder) {
                console.error("❌ Order not found in database:", orderId);
                return new Response("Order not found", { status: 404 });
            }

            // ✅ Check if order is already marked as paid
            if (existingOrder.isPaid) {
                console.warn("⚠️ Order is already marked as paid:", orderId);
                return NextResponse.json({ message: "Order already paid", ok: true });
            }

            // ✅ Update database and log the result
            const updatedOrder = await db.order.update({
                where: { id: orderId },
                data: { isPaid: true },
            });

            console.log("✅ Order updated as paid in database:", updatedOrder);

            return NextResponse.json({ message: "Payment recorded successfully", ok: true });
        } else {
            console.warn("ℹ️ Unhandled Stripe event type:", event.type);
        }

        return NextResponse.json({ message: "Event received", ok: true });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("❌ Webhook error:", error.message, error.stack);
            return NextResponse.json({ 
                message: `Something went wrong: ${error.message}`, 
                error: error.stack, 
                ok: false 
            }, { status: 500 });
        } else {
            console.error("❌ Webhook unknown error:", error);
            return NextResponse.json({ 
                message: "Something went wrong", 
                error: JSON.stringify(error), 
                ok: false 
            }, { status: 500 });
        }
    }
    
    
};
