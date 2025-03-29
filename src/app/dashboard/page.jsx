import { db } from "@/db";
import { notFound } from "next/navigation";
import { Calendar, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import Phone from "@/components/Phone";
import { COLORS } from "@/validators/option-validator";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Ensure this is correctly set up

const Dashboard = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return notFound();
    }

    try {
        const orders = await db.dummyOrder.findMany({
            orderBy: { createdAt: "desc" },
            include: { user: true, configuration: true },
        });

        return (
            <div className="min-h-screen w-full bg-gray-100 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 Order Dashboard</h1>

                {orders.length === 0 ? (
                    <p className="text-gray-600">No orders found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order) => {
                            const twColor =
                                COLORS.find((c) => c.value === order.configuration.color)?.tw || "bg-gray-200";

                            return (
                                <Card key={order.id} className="shadow-md hover:shadow-lg transition duration-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>Order #{order.id.slice(-6)}</span>
                                            <Badge variant="outline">{formatPrice(order.amount / 100)}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4">
                                            {/* User Info */}
                                            <div>
                                                <p className="text-gray-800 font-medium">{order.user.email}</p>
                                                <p className="text-gray-500 text-sm flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Product Preview */} 
                                        <div className="mt-4 flex gap-4 items-center">
                                            <Phone imgSrc={order.configuration.imageUrl} className={cn(twColor, "w-24")} />
                                            <div>
                                                <p className="text-gray-700 text-sm flex items-center gap-1">
                                                    <Package className="w-4 h-4 text-gray-500" />
                                                    {order.configuration.model}
                                                </p>
                                                <p className="text-gray-700 text-sm">
                                                    Material: {order.configuration.material}
                                                </p>
                                                <p className="text-gray-700 text-sm">
                                                    Finish: {order.configuration.finish}
                                                </p>
                                                <p className="text-gray-700 text-sm">Color: {order.configuration.color}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error("Error fetching orders:", error);
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-red-200">
                <p className="text-red-800 font-semibold">Error loading dashboard.</p>
            </div>
        );
    }
};

export default Dashboard;
