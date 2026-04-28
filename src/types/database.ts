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
          permit_cost: number | null;
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
          permit_cost?: number | null;
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
          permit_cost?: number | null;
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
    };
  };
};

export type TrekRow = Database["public"]["Tables"]["treks"]["Row"];
export type TrekSourceRow = Database["public"]["Tables"]["trek_sources"]["Row"];
export type TrekItineraryRow = Database["public"]["Tables"]["trek_itineraries"]["Row"];
