"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { Order } from "@prisma/client";
import { getServerSession } from "next-auth"; // Server-side session retrieval
import { authOptions } from "@/lib/authOptions"; // Ensure this is correctly set up in your project

export const createCheckoutSession = async ({ configId }: { configId: string }) => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("You need to be logged in");
    }

    const userId = session.user.id;
    
    const configuration = await db.configuration.findUnique({
        where: { id: configId }
    });

    if (!configuration) {
        throw new Error("No such configuration");
    }

    const { finish, material } = configuration;
    let price = BASE_PRICE;

    if (finish === "textured") {
        price += PRODUCT_PRICES.finish.textured;
    }
    if (material === "polycarbonate") {
        price += PRODUCT_PRICES.material.polycarbonate;
    }

    // Find existing order or create a new one
    let order = await db.order.findFirst({
        where: { userId, configurationId: configId }
    });

    if (!order) {
        order = await db.order.create({
            data: {
                amount: price / 100, // Ensure amount is in correct format
                userId,
                configurationId: configId,
            }
        });
    }

    const product = await stripe.products.create({
        name: "Custom iPhone Case",
        images: [configuration.imageUrl],
        default_price_data: {
            currency: "USD",
            unit_amount: price, // Stripe expects the amount in cents
        },
    });

    const stripeSession = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configId}`,
        payment_method_types: ["card"],
        mode: "payment",
        shipping_address_collection: { allowed_countries: ["IN", "US"] },
        metadata: {
            userId,
            orderId: order.id,
        },
        line_items: [{ price: product.default_price as string, quantity: 1 }],
    });

    return { url: stripeSession.url };
};
