import { db } from "@/db";

export const POST = async (request: Request) => {
    try {
        const data = await request.json();
        const { configurationId, userId, amount } = data;

        if (!configurationId || !userId || !amount) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const dummyOrder = await db.dummyOrder.create({
            data: {
                configurationId,
                userId,
                amount,
            },
        });

        return new Response(JSON.stringify({ message: "Order created successfully", order: dummyOrder }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error creating dummy order:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error", error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
