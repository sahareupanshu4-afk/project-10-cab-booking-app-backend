import { z } from 'zod'

export const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  address: z.string().optional(),
})

export const rideBookingSchema = z.object({
  pickup: locationSchema,
  drop: locationSchema,
  stops: z.array(locationSchema).optional(),
  vehicle_type: z.enum(['ECONOMY', 'PREMIUM', 'XL']),
  promo_code: z.string().optional(),
})

export const rideUpdateSchema = z.object({
  status: z.enum(['REQUESTED', 'ACCEPTED', 'DRIVER_ARRIVING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  driver_id: z.string().uuid().optional(),
  cancellation_reason: z.string().optional(),
  cancelled_by: z.string().uuid().optional(),
})

export const rideRatingSchema = z.object({
  ride_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export const promoCodeSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
})

export type LocationFormData = z.infer<typeof locationSchema>
export type RideBookingFormData = z.infer<typeof rideBookingSchema>
export type RideUpdateFormData = z.infer<typeof rideUpdateSchema>
export type RideRatingFormData = z.infer<typeof rideRatingSchema>
export type PromoCodeFormData = z.infer<typeof promoCodeSchema>