import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, CheckCircle, TrendingDown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface Prediction {
  id: string;
  risk_level: string;
  risk_score: number;
  percentage: number;
  avg_attendance: number;
  factors: any;
  created_at: string;
}

const Result = () => {
  const { predictionId } = useParams<{ predictionId: string }>();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrediction();
  }, [predictionId]);

  const fetchPrediction = async () => {
    try {
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("id", predictionId)
        .single();

      if (error) throw error;
      setPrediction(data);
    } catch (error: any) {
      console.error("Error fetching prediction:", error);
      toast.error("Failed to load prediction");
    } finally {
      setLoading(false);
    }
  };

  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case "No Risk":
        return {
          color: "text-green-500",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          gradient: "from-green-500 to-emerald-500",
          icon: CheckCircle,
          message: "Excellent performance! Student is on track for success.",
        };
      case "Low Risk":
        return {
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          gradient: "from-yellow-500 to-yellow-600",
          icon: AlertTriangle,
          message: "Minor concern. Encourage improvement in attendance or performance.",
        };
      case "Risk":
        return {
          color: "text-orange-500",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/30",
          gradient: "from-orange-500 to-orange-600",
          icon: AlertTriangle,
          message: "Moderate risk detected. Intervention recommended.",
        };
      case "High Risk":
        return {
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          gradient: "from-red-500 to-pink-500",
          icon: TrendingDown,
          message: "High risk! Immediate attention and support required.",
        };
      default:
        return {
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          gradient: "from-gray-500 to-gray-600",
          icon: AlertTriangle,
          message: "Unable to determine risk level.",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading prediction results...</p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Prediction Not Found</h2>
          <p className="text-muted-foreground mb-4">Unable to load the prediction results.</p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  const config = getRiskConfig(prediction.risk_level);
  const Icon = config.icon;
  const riskPercentage = prediction.risk_score * 100;

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Main Result Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-scale-in mb-6">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Prediction Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Risk Level Display */}
            <div className={`relative p-8 rounded-2xl ${config.bgColor} border-2 ${config.borderColor} animate-pulse-glow`}>
              <div className="text-center space-y-4">
                <div className={`inline-flex p-6 rounded-full bg-gradient-to-br ${config.gradient}`}>
                  <Icon className="w-16 h-16 text-white" />
                </div>
                <h2 className={`text-4xl font-bold ${config.color}`}>{prediction.risk_level}</h2>
                <p className="text-lg text-muted-foreground">{config.message}</p>
              </div>
            </div>

            {/* Risk Score Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">Risk Score</span>
                <span className={`text-2xl font-bold ${config.color}`}>
                  {riskPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={riskPercentage} className="h-3" />
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Academic Performance</p>
                      <p className="text-3xl font-bold text-primary">
                        {prediction.percentage.toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/10">
                      <TrendingDown className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <Progress value={prediction.percentage} className="h-2 mt-4" />
                </CardContent>
              </Card>

              <Card className="bg-muted/50 border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Average Attendance</p>
                      <p className="text-3xl font-bold text-primary">
                        {prediction.avg_attendance.toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-primary/10">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <Progress value={prediction.avg_attendance} className="h-2 mt-4" />
                </CardContent>
              </Card>
            </div>

            {/* Risk Factors */}
            {prediction.factors && (
              <Card className="bg-muted/50 border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Risk Factors Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {Object.entries(prediction.factors).map(([key, value]: [string, any]) => (
                      <li key={key} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div>
                          <p className="font-medium capitalize">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-sm text-muted-foreground">{value}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/")}
                className="flex-1 bg-gradient-primary text-white hover:opacity-90 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                New Prediction
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1 border-primary/20 hover:bg-primary/10"
              >
                Print Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timestamp */}
        <p className="text-center text-sm text-muted-foreground">
          Prediction generated on {new Date(prediction.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Result;
