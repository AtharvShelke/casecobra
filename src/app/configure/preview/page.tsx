import { db } from '@/db';
import { notFound } from 'next/navigation';
import DesignPreview from './DesignPreview';

interface PageProps {
  searchParams: {
    id?: string;
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const awaitedSearchParams = await searchParams; // Await searchParams
  const id = awaitedSearchParams.id;

  if (!id) {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  return <DesignPreview configuration={configuration} />;
};

export default Page;