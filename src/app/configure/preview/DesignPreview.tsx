'use client'
import Phone from '@/components/Phone'
import { Button } from '@/components/ui/button'
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { cn, formatPrice } from '@/lib/utils'
import { COLORS, MODELS } from '@/validators/option-validator'
import { Configuration } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import Confetti from 'react-dom-confetti'
import { createCheckoutSession } from './actions'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import LoginModal from '@/components/LoginModal'

interface DesignPreviewProps {
    configuration: Configuration;
    data: {
      configurationId: string;
      userId: string;
      amount: number;
    };
  }
  
const DesignPreview = ({ configuration, data }: DesignPreviewProps) => {
    const router = useRouter();

    const { id } = configuration;
    const { user } = useKindeBrowserClient();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const { toast } = useToast();

    const [showConfetti, setShowConfetti] = useState<boolean>(false)

    useEffect(() => setShowConfetti(true), [])
    const { color, model, finish, material } = configuration;
    const tw = COLORS.find((supportedColor) => supportedColor.value === color)?.tw;
    const { label: modelLabel } = MODELS.options.find(({ value }) => value === model)!

    let totalPrice = BASE_PRICE
    if (material === 'polycarbonate') {
        totalPrice += PRODUCT_PRICES.material.polycarbonate
    }
    if (finish === 'textured') {
        totalPrice += PRODUCT_PRICES.finish.textured
    }
    const { mutate: createPaymentSession } = useMutation({
        mutationKey: ["get-checkout-session"],
        mutationFn: createCheckoutSession,
        onSuccess: ({ url }) => {
            if (url) {
                router.push(url)
            } else {
                throw new Error("Enable to retrieve payment URL")
            }
        },
        onError: () => {
            toast({
                title: 'Something went wrong',
                description: "There was an error on our end. Please try again",
                variant: 'destructive'
            })
        }
    })
    const handleCheckout = () => {
        if (user) {
            createPaymentSession({configId:id})
        } else {
            console.log("configurationId: ", id)
            localStorage.setItem("configurationId", id);
            setIsLoginModalOpen(true)
        }
    }
    const handleDummyCheckout = async (data: DesignPreviewProps['data']) => {
        if (user) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/dummyOrder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
    
                if (!response.ok) {
                    throw new Error(`Failed to process order: ${response.statusText}`);
                }
    
                const result = await response.json();
                console.log("Order response:", result);
    
                router.push(`/payment-page?id=${data.configurationId}`);
            } catch (error) {
                console.error("Error during checkout:", error);
                toast({
                    title: "Checkout Failed",
                    description: "An error occurred while processing your order. Please try again.",
                    variant: "destructive",
                });
            }
        } else {
            console.log("configurationId: ", data.configurationId);
            localStorage.setItem("configurationId", data.configurationId);
            setIsLoginModalOpen(true);
        }
    };
    
    return (
        <>
            <div aria-hidden='true' className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center">
                <Confetti active={showConfetti} config={{ elementCount: 500, spread: 100 }} />
            </div>
            <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen}/>

           
            <div className='mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12'>
                <div className='sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2'>
                    <Phone imgSrc={configuration.croppedImageUrl!} className={cn(`bg-${tw}`)} />
                </div>
                <div className="mt-6 sm:col-span-9 ms:mt-0 md:row-end-1">
                    <h3 className='text-3xl font-bold tracking-tight text-gray-900'>
                        Your {modelLabel} Case
                    </h3>
                    <div className="mt-3 flex items-center gap-1.5 text-base">
                        <Check className='h-4 w-4 text-green-500' />
                        In Stock and Ready to Ship
                    </div>
                </div>
                <div className='sm:col-span-12 md:col-span-9 text-base'>
                    <div className='grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10'>
                        <div>
                            <p className='font-medium text-zinc-950'>
                                Highlights
                            </p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>Wireless charging compatible</li>
                                <li>TPU shock absorption</li>
                                <li>Packaging made from recycled materials</li>
                                <li>5 year print warranty</li>
                            </ol>
                        </div>
                        <div>
                            <p className='font-medium text-zinc-950'>Materials</p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>High-quality, durable material</li>
                                <li>Scratch and fingerprint resistant coating</li>

                            </ol>
                        </div>
                    </div>
                    <div className='mt-8'>
                        <div className='bg-gray-50 sm:rounded-lg sm:p-8'>
                            <div className='flow-root text-sm'>
                                <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>Base Price</p>
                                    <p className='font-medium text-gray-900'>
                                        {formatPrice(BASE_PRICE / 100)}
                                    </p>
                                </div>
                                {finish === 'textured' ? (
                                    <div className="flex items-center justify-between py-1 mt-2">
                                        <p className="text-gray-600">Textured Finish</p>
                                        <p className="font-medium text-gray-900">
                                            {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                                        </p>
                                    </div>
                                ) : null}
                                {material === 'polycarbonate' ? (
                                    <div className="flex items-center justify-between py-1 mt-2">
                                        <p className="text-gray-600">Polycarbonate Material</p>
                                        <p className="font-medium text-gray-900">
                                            {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                                        </p>
                                    </div>
                                ) : null}

                                <div className='my-2 h-px bg-gray-200' />
                                <div className='flex items-center justify-between py-2'>
                                    <p className="font-semibold text-gray-900">Order total</p>
                                    <p className='font-semibold text-gray-900'>
                                        {formatPrice(totalPrice / 100)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-8 flex justify-end pb-12'>
                            
                            <Button onClick={() => { handleDummyCheckout(data) }} className='px-4 sm:px-6 lg:px-8'>
                                Check Out <ArrowRight className='h-4 w-4 ml-1.5 inline' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
// 7:27:00
export default DesignPreview