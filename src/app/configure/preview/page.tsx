import { db } from '@/db'
import { notFound } from 'next/navigation'
import DesignPreview from './DesignPreview'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: PageProps) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    console.error("User not found or not authenticated.");
    return notFound();
  }

  const userId = user.id;
  const { id } = searchParams;

  if (!id || typeof id !== 'string') {
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

  let totalPrice = BASE_PRICE;
  if (configuration.material === 'polycarbonate') {
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  }
  if (configuration.finish === 'textured') {
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
