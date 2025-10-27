import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { performance_data_id, student_uuid, percentage, avg_attendance, subject_scores } = await req.json();

    console.log("Predicting risk for:", { performance_data_id, student_uuid, percentage, avg_attendance, subject_scores });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Risk categorization based on percentage and attendance thresholds
    const factors: Record<string, string> = {};
    let riskLevel = "No Risk";
    let riskScore = 0;

    // Performance factor analysis
    if (percentage < 36) {
      factors.performance = "Critical: Performance below 36%";
    } else if (percentage < 50) {
      factors.performance = "Warning: Performance below 50%";
    } else if (percentage < 70) {
      factors.performance = "Moderate: Performance below 70%";
    } else {
      factors.performance = "Good: Performance above 70%";
    }

    // Attendance factor analysis
    if (avg_attendance < 50) {
      factors.attendance = "Critical: Attendance below 50%";
    } else if (avg_attendance < 65) {
      factors.attendance = "Warning: Attendance below 65%";
    } else if (avg_attendance < 75) {
      factors.attendance = "Moderate: Attendance below 75%";
    } else {
      factors.attendance = "Good: Attendance above 75%";
    }

    // Check for failed subjects (below 36)
    if (subject_scores && Array.isArray(subject_scores)) {
      const failedSubjects = subject_scores.filter((score: number) => score < 36);
      if (failedSubjects.length > 0) {
        factors.failed_subjects = `${failedSubjects.length} subject(s) below passing grade (36)`;
      }
    }

    // Determine risk level based on thresholds
    // High Risk: Below 36% percentage OR below 50% attendance
    if (percentage < 36 || avg_attendance < 50) {
      riskLevel = "High Risk";
      riskScore = 0.85;
    }
    // Risk (At Risk): Below 50% percentage OR below 65% attendance
    else if (percentage < 50 || avg_attendance < 65) {
      riskLevel = "Risk";
      riskScore = 0.60;
    }
    // Low Risk: Below 70% percentage OR below 75% attendance
    else if (percentage < 70 || avg_attendance < 75) {
      riskLevel = "Low Risk";
      riskScore = 0.35;
    }
    // No Risk: Above 70% percentage AND above 75% attendance
    else {
      riskLevel = "No Risk";
      riskScore = 0.10;
    }

    // Save prediction to database
    const { data: prediction, error: predictionError } = await supabase
      .from('predictions')
      .insert({
        student_uuid,
        performance_data_id,
        risk_level: riskLevel,
        risk_score: riskScore,
        percentage,
        avg_attendance,
        factors
      })
      .select()
      .single();

    if (predictionError) {
      console.error("Error saving prediction:", predictionError);
      throw predictionError;
    }

    console.log("Prediction saved:", prediction);

    return new Response(
      JSON.stringify({
        success: true,
        prediction_id: prediction.id,
        risk_level: riskLevel,
        risk_score: riskScore,
        factors
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in predict-risk function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
