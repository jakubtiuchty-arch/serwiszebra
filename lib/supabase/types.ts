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
      repair_requests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          email: string
          phone: string
          company: string | null
          device_model: string
          serial_number: string | null
          purchase_date: string | null
          is_warranty: string
          issue_description: string
          urgency: string
          photo_urls: string[]
          street: string
          zip_code: string
          city: string
          contact_phone: string
          pickup_date: string
          courier_notes: string | null
          status: string
          estimated_price: number | null
          final_price: number | null
          price_accepted_at: string | null
          payment_status: string | null
          stripe_session_id: string | null
          stripe_payment_id: string | null  // ← DODAJ TĘ LINIĘ
          paid_at: string | null
          user_id: string | null
          courier_tracking_number: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          company?: string | null
          device_model: string
          serial_number?: string | null
          purchase_date?: string | null
          is_warranty: string
          issue_description: string
          urgency: string
          photo_urls?: string[]
          street: string
          zip_code: string
          city: string
          contact_phone: string
          pickup_date: string
          courier_notes?: string | null
          status?: string
          estimated_price?: number | null
          final_price?: number | null
          price_accepted_at?: string | null
          payment_status?: string | null
          stripe_session_id?: string | null
          stripe_payment_id?: string | null  // ← DODAJ TĘ LINIĘ
          paid_at?: string | null
          user_id?: string | null
          courier_tracking_number?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          company?: string | null
          device_model?: string
          serial_number?: string | null
          purchase_date?: string | null
          is_warranty?: string
          issue_description?: string
          urgency?: string
          photo_urls?: string[]
          street?: string
          zip_code?: string
          city?: string
          contact_phone?: string
          pickup_date?: string
          courier_notes?: string | null
          status?: string
          estimated_price?: number | null
          final_price?: number | null
          price_accepted_at?: string | null
          payment_status?: string | null
          stripe_session_id?: string | null
          stripe_payment_id?: string | null  // ← DODAJ TĘ LINIĘ
          paid_at?: string | null
          user_id?: string | null
          courier_tracking_number?: string | null
        }
      }
      repair_status_history: {
        Row: {
          id: string
          created_at: string
          repair_request_id: string
          status: string
          notes: string | null
          changed_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          repair_request_id: string
          status: string
          notes?: string | null
          changed_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          repair_request_id?: string
          status?: string
          notes?: string | null
          changed_by?: string | null
        }
      }
      repair_messages: {
        Row: {
          id: string
          created_at: string
          repair_request_id: string
          sender_type: string
          sender_name: string
          message: string
          is_read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          repair_request_id: string
          sender_type: string
          sender_name: string
          message: string
          is_read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          repair_request_id?: string
          sender_type?: string
          sender_name?: string
          message?: string
          is_read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}