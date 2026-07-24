export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TrekDifficulty = "Easy" | "Moderate" | "Hard" | "Technical";

export type PermitAudience =
  | "Foreigner"
  | "SAARC"
  | "Nepali"
  | "Resident"
  | "Other";

export type PermitCost = {
  audience: PermitAudience;
  amount_npr: number;
  notes?: string;
};

export type TrekPermit = {
  permit_name: string;
  required: boolean;
  costs: PermitCost[];
  notes?: string;
};

export type GuideVerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type Database = {
  public: {
    Tables: {
      treks: {
        Row: {
          id: string;
          slug: string;
          name: string;
          region: string;
          duration_days: number | null;
          max_altitude: number | null;
          difficulty: string | null;
          description: string | null;
          route_overview: string | null;
          permit_required: boolean;
          permit_details: string | null;
          permit_costs: Json | null;
          best_seasons: string[] | null;
          highlights: string[] | null;
          safety_notes: string[] | null;
          image_url: string | null;
          is_verified: boolean;
          last_verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          region: string;
          duration_days?: number | null;
          max_altitude?: number | null;
          difficulty?: string | null;
          description?: string | null;
          route_overview?: string | null;
          permit_required?: boolean;
          permit_details?: string | null;
          permit_costs?: Json | null;
          best_seasons?: string[] | null;
          highlights?: string[] | null;
          safety_notes?: string[] | null;
          image_url?: string | null;
          is_verified?: boolean;
          last_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          region?: string;
          duration_days?: number | null;
          max_altitude?: number | null;
          difficulty?: string | null;
          description?: string | null;
          route_overview?: string | null;
          permit_required?: boolean;
          permit_details?: string | null;
          permit_costs?: Json | null;
          best_seasons?: string[] | null;
          highlights?: string[] | null;
          safety_notes?: string[] | null;
          image_url?: string | null;
          is_verified?: boolean;
          last_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trek_sources: {
        Row: {
          id: string;
          trek_id: string;
          source_name: string;
          source_url: string | null;
          source_type: string | null;
          checked_at: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trek_id: string;
          source_name: string;
          source_url?: string | null;
          source_type?: string | null;
          checked_at?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trek_id?: string;
          source_name?: string;
          source_url?: string | null;
          source_type?: string | null;
          checked_at?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      trek_itineraries: {
        Row: {
          id: string;
          trek_id: string;
          day_number: number;
          title: string;
          summary: string | null;
          overnight_place: string | null;
          altitude_m: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          trek_id: string;
          day_number: number;
          title: string;
          summary?: string | null;
          overnight_place?: string | null;
          altitude_m?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          trek_id?: string;
          day_number?: number;
          title?: string;
          summary?: string | null;
          overnight_place?: string | null;
          altitude_m?: number | null;
          created_at?: string;
        };
      };
      guides: {
        Row: {
          id: string;
          slug: string;
          full_name: string;
          home_region: string | null;
          base_location: string | null;
          bio: string | null;
          years_experience: number | null;
          languages: string[] | null;
          phone: string | null;
          whatsapp: string | null;
          email: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          full_name: string;
          home_region?: string | null;
          base_location?: string | null;
          bio?: string | null;
          years_experience?: number | null;
          languages?: string[] | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          full_name?: string;
          home_region?: string | null;
          base_location?: string | null;
          bio?: string | null;
          years_experience?: number | null;
          languages?: string[] | null;
          phone?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      guide_verifications: {
        Row: {
          id: string;
          guide_id: string;
          verification_status: GuideVerificationStatus;
          license_number: string | null;
          license_document_url: string | null;
          reviewed_by: string | null;
          verified_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          guide_id: string;
          verification_status?: GuideVerificationStatus;
          license_number?: string | null;
          license_document_url?: string | null;
          reviewed_by?: string | null;
          verified_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          guide_id?: string;
          verification_status?: GuideVerificationStatus;
          license_number?: string | null;
          license_document_url?: string | null;
          reviewed_by?: string | null;
          verified_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      guide_treks: {
        Row: {
          id: string;
          guide_id: string;
          trek_id: string;
          years_guiding: number | null;
          is_primary: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          guide_id: string;
          trek_id: string;
          years_guiding?: number | null;
          is_primary?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          guide_id?: string;
          trek_id?: string;
          years_guiding?: number | null;
          is_primary?: boolean;
          notes?: string | null;
          created_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          message: string;
          rating: number | null;
          category: string | null;
          email: string | null;
          page_path: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          message: string;
          rating?: number | null;
          category?: string | null;
          email?: string | null;
          page_path?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          message?: string;
          rating?: number | null;
          category?: string | null;
          email?: string | null;
          page_path?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

export type TrekRow = Database["public"]["Tables"]["treks"]["Row"];
export type TrekSourceRow = Database["public"]["Tables"]["trek_sources"]["Row"];
export type TrekItineraryRow = Database["public"]["Tables"]["trek_itineraries"]["Row"];
export type GuideRow = Database["public"]["Tables"]["guides"]["Row"];
export type GuideVerificationRow =
  Database["public"]["Tables"]["guide_verifications"]["Row"];
export type GuideTrekRow = Database["public"]["Tables"]["guide_treks"]["Row"];
