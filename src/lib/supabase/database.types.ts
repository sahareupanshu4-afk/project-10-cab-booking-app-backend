export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'RIDER' | 'DRIVER' | 'ADMIN'
          name: string | null
          phone: string | null
          avatar_url: string | null
          rating: number
          total_rides: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'RIDER' | 'DRIVER' | 'ADMIN'
          name?: string | null
          phone?: string | null
          avatar_url?: string | null
          rating?: number
          total_rides?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'RIDER' | 'DRIVER' | 'ADMIN'
          name?: string | null
          phone?: string | null
          avatar_url?: string | null
          rating?: number
          total_rides?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          user_id: string
          vehicle_type: 'ECONOMY' | 'PREMIUM' | 'XL'
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_number: string
          vehicle_color: string | null
          is_available: boolean
          is_verified: boolean
          current_lat: number | null
          current_lng: number | null
          last_location_update: string | null
          total_earnings: number
          total_trips: number
          documents: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_type?: 'ECONOMY' | 'PREMIUM' | 'XL'
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_number: string
          vehicle_color?: string | null
          is_available?: boolean
          is_verified?: boolean
          current_lat?: number | null
          current_lng?: number | null
          last_location_update?: string | null
          total_earnings?: number
          total_trips?: number
          documents?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_type?: 'ECONOMY' | 'PREMIUM' | 'XL'
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_number?: string
          vehicle_color?: string | null
          is_available?: boolean
          is_verified?: boolean
          current_lat?: number | null
          current_lng?: number | null
          last_location_update?: string | null
          total_earnings?: number
          total_trips?: number
          documents?: Json
          created_at?: string
          updated_at?: string
        }
      }
      rides: {
        Row: {
          id: string
          rider_id: string
          driver_id: string | null
          pickup_address: string
          pickup_lat: number
          pickup_lng: number
          drop_address: string
          drop_lat: number
          drop_lng: number
          stops: Json
          vehicle_type: 'ECONOMY' | 'PREMIUM' | 'XL'
          distance: number
          duration: number
          base_fare: number
          surge_multiplier: number
          discount: number
          promo_code_id: string | null
          final_fare: number
          status: 'REQUESTED' | 'ACCEPTED' | 'DRIVER_ARRIVING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          cancellation_reason: string | null
          cancelled_by: string | null
          cancelled_at: string | null
          requested_at: string
          accepted_at: string | null
          driver_arrived_at: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          rider_id: string
          driver_id?: string | null
          pickup_address: string
          pickup_lat: number
          pickup_lng: number
          drop_address: string
          drop_lat: number
          drop_lng: number
          stops?: Json
          vehicle_type?: 'ECONOMY' | 'PREMIUM' | 'XL'
          distance?: number
          duration?: number
          base_fare?: number
          surge_multiplier?: number
          discount?: number
          promo_code_id?: string | null
          final_fare?: number
          status?: 'REQUESTED' | 'ACCEPTED' | 'DRIVER_ARRIVING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          cancellation_reason?: string | null
          cancelled_by?: string | null
          cancelled_at?: string | null
          requested_at?: string
          accepted_at?: string | null
          driver_arrived_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rider_id?: string
          driver_id?: string | null
          pickup_address?: string
          pickup_lat?: number
          pickup_lng?: number
          drop_address?: string
          drop_lat?: number
          drop_lng?: number
          stops?: Json
          vehicle_type?: 'ECONOMY' | 'PREMIUM' | 'XL'
          distance?: number
          duration?: number
          base_fare?: number
          surge_multiplier?: number
          discount?: number
          promo_code_id?: string | null
          final_fare?: number
          status?: 'REQUESTED' | 'ACCEPTED' | 'DRIVER_ARRIVING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
          cancellation_reason?: string | null
          cancelled_by?: string | null
          cancelled_at?: string | null
          requested_at?: string
          accepted_at?: string | null
          driver_arrived_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          ride_id: string
          user_id: string
          driver_id: string | null
          stripe_payment_intent: string | null
          stripe_charge_id: string | null
          amount: number
          currency: string
          platform_fee: number
          driver_earnings: number
          status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          refund_amount: number | null
          refund_reason: string | null
          refunded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          user_id: string
          driver_id?: string | null
          stripe_payment_intent?: string | null
          stripe_charge_id?: string | null
          amount: number
          currency?: string
          platform_fee?: number
          driver_earnings?: number
          status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          user_id?: string
          driver_id?: string | null
          stripe_payment_intent?: string | null
          stripe_charge_id?: string | null
          amount?: number
          currency?: string
          platform_fee?: number
          driver_earnings?: number
          status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          ride_id: string
          rider_id: string
          driver_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          rider_id: string
          driver_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          rider_id?: string
          driver_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          description: string | null
          type: 'PERCENTAGE' | 'FLAT'
          value: number
          min_amount: number
          max_discount: number | null
          usage_limit: number | null
          used_count: number
          is_active: boolean
          valid_from: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          type: 'PERCENTAGE' | 'FLAT'
          value: number
          min_amount?: number
          max_discount?: number | null
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          valid_from?: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          type?: 'PERCENTAGE' | 'FLAT'
          value?: number
          min_amount?: number
          max_discount?: number | null
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          valid_from?: string
          expires_at?: string | null
          created_at?: string
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          ride_id: string | null
          subject: string
          message: string
          status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
          priority: string
          assigned_to: string | null
          responses: Json
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          ride_id?: string | null
          subject: string
          message: string
          status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
          priority?: string
          assigned_to?: string | null
          responses?: Json
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          ride_id?: string | null
          subject?: string
          message?: string
          status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
          priority?: string
          assigned_to?: string | null
          responses?: Json
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      emergency_logs: {
        Row: {
          id: string
          ride_id: string
          user_id: string
          latitude: number
          longitude: number
          address: string | null
          alert_type: string
          message: string | null
          resolved: boolean
          resolved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          user_id: string
          latitude: number
          longitude: number
          address?: string | null
          alert_type?: string
          message?: string | null
          resolved?: boolean
          resolved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          user_id?: string
          latitude?: number
          longitude?: number
          address?: string | null
          alert_type?: string
          message?: string | null
          resolved?: boolean
          resolved_at?: string | null
          created_at?: string
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          relationship: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          relationship?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          relationship?: string | null
          created_at?: string
        }
      }
      user_payment_methods: {
        Row: {
          id: string
          user_id: string
          stripe_payment_method_id: string
          card_last_four: string | null
          card_brand: string | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_method_id: string
          card_last_four?: string | null
          card_brand?: string | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_method_id?: string
          card_last_four?: string | null
          card_brand?: string | null
          is_default?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json
          read?: boolean
          created_at?: string
        }
      }
      ride_tracking: {
        Row: {
          id: string
          ride_id: string
          driver_id: string
          latitude: number
          longitude: number
          eta_seconds: number | null
          distance_remaining: number | null
          created_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          driver_id: string
          latitude: number
          longitude: number
          eta_seconds?: number | null
          distance_remaining?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          driver_id?: string
          latitude?: number
          longitude?: number
          eta_seconds?: number | null
          distance_remaining?: number | null
          created_at?: string
        }
      }
      driver_location_history: {
        Row: {
          id: string
          driver_id: string
          latitude: number
          longitude: number
          speed: number | null
          heading: number | null
          created_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          latitude: number
          longitude: number
          speed?: number | null
          heading?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          heading?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      active_rides: {
        Row: {
          id: string | null
          rider_id: string | null
          rider_name: string | null
          rider_phone: string | null
          driver_id: string | null
          vehicle_type: string | null
          vehicle_number: string | null
          driver_name: string | null
          pickup_address: string | null
          drop_address: string | null
          status: string | null
          final_fare: number | null
          requested_at: string | null
        }
      }
      driver_earnings_summary: {
        Row: {
          driver_id: string | null
          user_id: string | null
          driver_name: string | null
          total_earnings: number | null
          total_trips: number | null
          total_rides: number | null
          avg_rating: number | null
        }
      }
    }
    Functions: {
      update_updated_at_column: {
        Args: Record<string, never>
        Returns: undefined
      }
      update_driver_rating: {
        Args: Record<string, never>
        Returns: undefined
      }
      update_user_total_rides: {
        Args: Record<string, never>
        Returns: undefined
      }
      update_driver_earnings: {
        Args: Record<string, never>
        Returns: undefined
      }
      increment_promo_usage: {
        Args: Record<string, never>
        Returns: undefined
      }
    }
    Enums: {
      user_role: 'RIDER' | 'DRIVER' | 'ADMIN'
      ride_status: 'REQUESTED' | 'ACCEPTED' | 'DRIVER_ARRIVING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
      payment_status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
      promo_type: 'PERCENTAGE' | 'FLAT'
      ticket_status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
      vehicle_type: 'ECONOMY' | 'PREMIUM' | 'XL'
    }
  }
}