export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      performance_data: {
        Row: {
          ai_basics_y3_credit: number | null
          ai_basics_y3_score: number | null
          ai_ethics_y4_credit: number | null
          ai_ethics_y4_score: number | null
          attendance_s1: number | null
          attendance_s2: number | null
          avg_attendance: number | null
          capstone_y4_credit: number | null
          capstone_y4_score: number | null
          cgpa: number | null
          chemistry_y1_credit: number | null
          chemistry_y1_score: number | null
          cloud_computing_y4_credit: number | null
          cloud_computing_y4_score: number | null
          computer_y1_credit: number | null
          computer_y1_score: number | null
          created_at: string | null
          data_structures_y2_credit: number | null
          data_structures_y2_score: number | null
          dbms_y3_credit: number | null
          dbms_y3_score: number | null
          deep_learning_y4_credit: number | null
          deep_learning_y4_score: number | null
          english_y1_credit: number | null
          english_y1_score: number | null
          id: string
          maths_y1_credit: number | null
          maths_y1_score: number | null
          maths_y2_credit: number | null
          maths_y2_score: number | null
          ml_y3_credit: number | null
          ml_y3_score: number | null
          networks_y2_credit: number | null
          networks_y2_score: number | null
          nlp_y4_credit: number | null
          nlp_y4_score: number | null
          os_y2_credit: number | null
          os_y2_score: number | null
          percentage: number | null
          physics_y1_credit: number | null
          physics_y1_score: number | null
          probability_y3_credit: number | null
          probability_y3_score: number | null
          python_y2_credit: number | null
          python_y2_score: number | null
          student_uuid: string | null
          updated_at: string | null
          web_tech_y3_credit: number | null
          web_tech_y3_score: number | null
          year: number
        }
        Insert: {
          ai_basics_y3_credit?: number | null
          ai_basics_y3_score?: number | null
          ai_ethics_y4_credit?: number | null
          ai_ethics_y4_score?: number | null
          attendance_s1?: number | null
          attendance_s2?: number | null
          avg_attendance?: number | null
          capstone_y4_credit?: number | null
          capstone_y4_score?: number | null
          cgpa?: number | null
          chemistry_y1_credit?: number | null
          chemistry_y1_score?: number | null
          cloud_computing_y4_credit?: number | null
          cloud_computing_y4_score?: number | null
          computer_y1_credit?: number | null
          computer_y1_score?: number | null
          created_at?: string | null
          data_structures_y2_credit?: number | null
          data_structures_y2_score?: number | null
          dbms_y3_credit?: number | null
          dbms_y3_score?: number | null
          deep_learning_y4_credit?: number | null
          deep_learning_y4_score?: number | null
          english_y1_credit?: number | null
          english_y1_score?: number | null
          id?: string
          maths_y1_credit?: number | null
          maths_y1_score?: number | null
          maths_y2_credit?: number | null
          maths_y2_score?: number | null
          ml_y3_credit?: number | null
          ml_y3_score?: number | null
          networks_y2_credit?: number | null
          networks_y2_score?: number | null
          nlp_y4_credit?: number | null
          nlp_y4_score?: number | null
          os_y2_credit?: number | null
          os_y2_score?: number | null
          percentage?: number | null
          physics_y1_credit?: number | null
          physics_y1_score?: number | null
          probability_y3_credit?: number | null
          probability_y3_score?: number | null
          python_y2_credit?: number | null
          python_y2_score?: number | null
          student_uuid?: string | null
          updated_at?: string | null
          web_tech_y3_credit?: number | null
          web_tech_y3_score?: number | null
          year: number
        }
        Update: {
          ai_basics_y3_credit?: number | null
          ai_basics_y3_score?: number | null
          ai_ethics_y4_credit?: number | null
          ai_ethics_y4_score?: number | null
          attendance_s1?: number | null
          attendance_s2?: number | null
          avg_attendance?: number | null
          capstone_y4_credit?: number | null
          capstone_y4_score?: number | null
          cgpa?: number | null
          chemistry_y1_credit?: number | null
          chemistry_y1_score?: number | null
          cloud_computing_y4_credit?: number | null
          cloud_computing_y4_score?: number | null
          computer_y1_credit?: number | null
          computer_y1_score?: number | null
          created_at?: string | null
          data_structures_y2_credit?: number | null
          data_structures_y2_score?: number | null
          dbms_y3_credit?: number | null
          dbms_y3_score?: number | null
          deep_learning_y4_credit?: number | null
          deep_learning_y4_score?: number | null
          english_y1_credit?: number | null
          english_y1_score?: number | null
          id?: string
          maths_y1_credit?: number | null
          maths_y1_score?: number | null
          maths_y2_credit?: number | null
          maths_y2_score?: number | null
          ml_y3_credit?: number | null
          ml_y3_score?: number | null
          networks_y2_credit?: number | null
          networks_y2_score?: number | null
          nlp_y4_credit?: number | null
          nlp_y4_score?: number | null
          os_y2_credit?: number | null
          os_y2_score?: number | null
          percentage?: number | null
          physics_y1_credit?: number | null
          physics_y1_score?: number | null
          probability_y3_credit?: number | null
          probability_y3_score?: number | null
          python_y2_credit?: number | null
          python_y2_score?: number | null
          student_uuid?: string | null
          updated_at?: string | null
          web_tech_y3_credit?: number | null
          web_tech_y3_score?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "performance_data_student_uuid_fkey"
            columns: ["student_uuid"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          avg_attendance: number | null
          created_at: string | null
          factors: Json | null
          id: string
          percentage: number | null
          performance_data_id: string | null
          risk_level: string
          risk_score: number | null
          student_uuid: string | null
        }
        Insert: {
          avg_attendance?: number | null
          created_at?: string | null
          factors?: Json | null
          id?: string
          percentage?: number | null
          performance_data_id?: string | null
          risk_level: string
          risk_score?: number | null
          student_uuid?: string | null
        }
        Update: {
          avg_attendance?: number | null
          created_at?: string | null
          factors?: Json | null
          id?: string
          percentage?: number | null
          performance_data_id?: string | null
          risk_level?: string
          risk_score?: number | null
          student_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_performance_data_id_fkey"
            columns: ["performance_data_id"]
            isOneToOne: false
            referencedRelation: "performance_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_student_uuid_fkey"
            columns: ["student_uuid"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string | null
          id: string
          student_id: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          student_id: string
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          student_id?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
