import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AuthRedirect from "@/components/AuthRedirect";


interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const session = await getServerSession(authOptions);

  const id = Array.isArray(searchParams.id) ? searchParams.id[0] : searchParams.id;
  if (!id || typeof id !== "string") {
    console.error("Invalid or missing configuration ID:", id);
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    console.error("Configuration not found for ID:", id);
    return notFound();
  }

  if (!session?.user || !session.user.id) {
    return <AuthRedirect configurationId={configuration.id} />;
  }

  const userId = session.user.id;
  let totalPrice = BASE_PRICE;
  if (configuration.material === "polycarbonate") {
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  }
  if (configuration.finish === "textured") {
    totalPrice += PRODUCT_PRICES.finish.textured;
  }

  const data = {
    configurationId: configuration.id,
    userId,
    amount: totalPrice,
  };

  return (
    <div>
      <DesignPreview configuration={configuration} data={data} />
    </div>
  );
};

export default Page;
