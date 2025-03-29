import { db } from "@/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Phone from "@/components/Phone";
import { cn, formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";
import { COLORS } from "@/validators/option-validator";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

const Page = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        console.error("User not found or not authenticated.");
        
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-400 text-lg">User not authenticated.</p>
                <Link href={'/'}>Go to home page</Link>
            </div>
        );
    }

    try {
        const orders = await db.dummyOrder.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: { user: true, configuration: true },
        });

        if (!orders.length) {
            console.warn("No orders found for user:", session.user.id);
        }

        return (
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Orders</h1>

                {orders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order) => {
                            if (!order.configuration) {
                                console.error("Order has no configuration:", order);
                                return null;
                            }

                            const twColor =
                                COLORS.find((c) => c.value === order.configuration.color)?.tw || "bg-gray-200";

                            return (
                                <Card key={order.id} className="shadow-lg transition-transform transform hover:scale-105">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-gray-900">
                                            Order ID: <span className="text-gray-600">{order.id}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4">
                                            <Phone
                                                imgSrc={order.configuration.imageUrl}
                                                className={cn(twColor, "w-24")}
                                            />
                                            <div className="space-y-1">
                                                <p className="text-gray-700 text-sm flex items-center gap-1">
                                                    <Package className="w-4 h-4 text-gray-500" />
                                                    <span className="font-medium">{order.configuration.model}</span>
                                                </p>
                                                <div className="flex gap-2 mt-2">
                                                    <Badge variant="outline">{order.configuration.material}</Badge>
                                                    <Badge variant="secondary">{order.configuration.finish}</Badge>
                                                    <Badge className={cn(twColor, "text-white px-2")}>
                                                        {order.configuration.color}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-800 font-semibold text-lg mt-4">
                                            {formatPrice(order.amount / 100)}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                        <p className="text-gray-400 text-lg">No orders found.</p>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-500 text-lg">Error loading orders. Please try again later.</p>
            </div>
        );
    }
};

export default Page;
