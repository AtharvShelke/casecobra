'use client'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notFound, useRouter } from 'next/navigation'
import { useState } from "react";
import { CreditCard } from "lucide-react";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const PaymentPage = ({ searchParams }: PageProps) => {
  const router = useRouter();
   const { id } = searchParams
  
    if (!id || typeof id !== 'string') {
      return notFound()
    }
  
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);

  const handleContinue = () => {
    router.push(`/thankYou?id=${id}`)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <FlickeringGrid className="h-screen z-0"/>
      <Card className="absolute w-full max-w-md p-6 shadow-lg bg-white rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-4">
          This will be your payment gateway page
        </h1>
        <p className="text-gray-600 text-center mb-6">
          We support multiple payment integrations. It's your choice what's suitable for your business
        </p>

        <div className="grid gap-4">
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => handleContinue()}
          >
            <CreditCard size={20} />
            Continue
          </Button>

          
        </div>
        <p className="text-gray-400 text-center my-6 text-xs">
          As this is demo we are going to next page to show what happens after successful payment
        </p>
        
      </Card>
    </div>
  );
};

export default PaymentPage;
