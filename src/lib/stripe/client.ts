import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Create a payment intent for a ride
export async function createPaymentIntent(
  amount: number,
  customerId?: string,
  metadata?: Record<string, string>
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Capture a payment intent
export async function capturePaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)
    return {
      success: true,
      paymentIntent,
    }
  } catch (error: any) {
    console.error('Error capturing payment intent:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Cancel a payment intent
export async function cancelPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId)
    return {
      success: true,
      paymentIntent,
    }
  } catch (error: any) {
    console.error('Error canceling payment intent:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Create a refund
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
) {
  try {
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    }
    
    if (amount) {
      refundParams.amount = Math.round(amount * 100)
    }
    
    if (reason) {
      refundParams.reason = reason
    }

    const refund = await stripe.refunds.create(refundParams)

    return {
      success: true,
      refund,
    }
  } catch (error: any) {
    console.error('Error creating refund:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Create a Stripe customer
export async function createCustomer(
  email: string,
  name: string,
  phone?: string
) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      phone,
    })

    return {
      success: true,
      customer,
    }
  } catch (error: any) {
    console.error('Error creating customer:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Attach a payment method to a customer
export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string
) {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })

    return {
      success: true,
      paymentMethod,
    }
  } catch (error: any) {
    console.error('Error attaching payment method:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Get customer's payment methods
export async function getPaymentMethods(customerId: string) {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    })

    return {
      success: true,
      paymentMethods: paymentMethods.data,
    }
  } catch (error: any) {
    console.error('Error getting payment methods:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Create a transfer to a connected account (for driver payouts)
export async function createTransfer(
  amount: number,
  stripeAccountId: string,
  transferGroup?: string
) {
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      destination: stripeAccountId,
      transfer_group: transferGroup,
    })

    return {
      success: true,
      transfer,
    }
  } catch (error: any) {
    console.error('Error creating transfer:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Calculate platform fee and driver earnings
export function calculateEarnings(totalFare: number, platformFeePercentage: number = 0.15) {
  const platformFee = totalFare * platformFeePercentage
  const driverEarnings = totalFare - platformFee

  return {
    totalFare,
    platformFee: Math.round(platformFee * 100) / 100,
    driverEarnings: Math.round(driverEarnings * 100) / 100,
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  try {
    const event = Stripe.webhooks.constructEvent(payload, signature, secret)
    return {
      success: true,
      event,
    }
  } catch (error: any) {
    console.error('Error verifying webhook signature:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}