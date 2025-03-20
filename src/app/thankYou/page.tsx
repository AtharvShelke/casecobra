import Phone from "@/components/Phone";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS } from "@/validators/option-validator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ThankYou = async ({ searchParams }: PageProps) => {
 

  const orderId = searchParams.id;
  if (!orderId || typeof orderId !== "string") return notFound();

  const orderData = await db.configuration.findUnique({ where: { id: orderId } });
  if (!orderData) return notFound();

  const twColor = COLORS.find((c) => c.value === orderData.color)?.tw || "gray-200";
  const totalPrice =
    BASE_PRICE +
    (orderData.material === "polycarbonate" ? PRODUCT_PRICES.material.polycarbonate : 0) +
    (orderData.finish === "textured" ? PRODUCT_PRICES.finish.textured : 0);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full space-y-12 py-16">
        {/* Header */}
        <div className="text-center">
          <p className="text-lg font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is on the way!
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            We've received your order and are now processing it.
          </p>
        </div>

        {/* Order Details */}
        <div className="border-t border-zinc-200 pt-6">
          <h4 className="font-semibold text-zinc-900">Order Details</h4>
          <p className="text-sm text-zinc-600 mt-2">
            We at CaseCobra believe that a phone case should not only look good but also last for
            years. We offer a <span className="font-semibold">5-year print guarantee</span>: If your case isn't of the highest
            quality, we'll replace it for free.
          </p>

          <div className="mt-6">
            <p className="text-zinc-900 font-medium">Order Number:</p>
            <p className="text-zinc-500">{orderData.id}</p>
          </div>
        </div>

        {/* Product Display */}
        <div className="flex flex-col items-center">
          <div className="bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 rounded-2xl p-4">
            <Phone imgSrc={orderData.croppedImageUrl!} className={cn(`bg-${twColor}`, "w-56")} />
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-zinc-200 pt-6 space-y-4">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Subtotal</p>
            <p className="text-zinc-700">{formatPrice(totalPrice / 100)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Shipping</p>
            <p className="text-zinc-700">Free</p>
          </div>
          <div className="flex justify-between font-semibold text-zinc-900">
            <p>Total</p>
            <p>{formatPrice(totalPrice / 100)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
