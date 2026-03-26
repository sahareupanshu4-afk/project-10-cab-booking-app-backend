import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createPaymentIntent, capturePaymentIntent } from '@/lib/stripe/client'

export async function POST(request: NextRequest) {
  try {
    const { ride_id, user_id, driver_id, amount, currency = 'usd' } = await request.json()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create payment intent with Stripe
    const paymentResult = await createPaymentIntent(amount, undefined, {
      ride_id,
      user_id,
      driver_id: driver_id || '',
    })

    if (!paymentResult.success) {
      return NextResponse.json(
        { success: false, error: paymentResult.error },
        { status: 400 }
      )
    }

    // Calculate platform fee and driver earnings
    const platformFee = amount * 0.15 // 15% platform fee
    const driverEarnings = amount - platformFee

    // Create payment record in database
    const { data, error } = await supabase
      .from('payments')
      .insert({
        ride_id,
        user_id,
        driver_id,
        stripe_payment_intent: paymentResult.paymentIntentId,
        amount,
        currency,
        platform_fee: platformFee,
        driver_earnings: driverEarnings,
        status: 'PENDING',
      } as any)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        payment: data,
        clientSecret: paymentResult.clientSecret,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create payment' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { payment_intent_id, action } = await request.json()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (action === 'capture') {
      // Capture the payment
      const captureResult = await capturePaymentIntent(payment_intent_id)

      if (!captureResult.success) {
        return NextResponse.json(
          { success: false, error: captureResult.error },
          { status: 400 }
        )
      }

      // Update payment status
      const { data, error } = await supabase
        .from('payments')
        .update({ status: 'COMPLETED' } as any)
        .eq('stripe_payment_intent', payment_intent_id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        data,
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update payment' },
      { status: 500 }
    )
  }
}