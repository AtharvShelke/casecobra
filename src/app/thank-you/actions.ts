'use server'

import { db } from '@/db'
import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth'

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || !session?.user?.email) {
    throw new Error('You need to be logged in to view this page.');
  }

  const order = await db.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  });

  if (!order) {
    throw new Error('This order does not exist.');
  }

  return order.isPaid ? order : { isPaid: false, message: "Payment pending" };
};
