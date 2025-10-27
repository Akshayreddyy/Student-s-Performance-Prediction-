import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RiskSettings {
  high_risk_percentage: number;
  high_risk_attendance: number;
  risk_percentage: number;
  risk_attendance: number;
  low_risk_percentage: number;
  low_risk_attendance: number;
}

const DEFAULT_SETTINGS: RiskSettings = {
  high_risk_percentage: 36,
  high_risk_attendance: 50,
  risk_percentage: 50,
  risk_attendance: 65,
  low_risk_percentage: 70,
  low_risk_attendance: 75,
};

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<RiskSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("riskSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("riskSettings", JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Risk prediction thresholds have been updated.",
    });
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem("riskSettings", JSON.stringify(DEFAULT_SETTINGS));
    toast({
      title: "Settings reset",
      description: "Risk prediction thresholds have been reset to defaults.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Risk Prediction Settings</CardTitle>
            <CardDescription>
              Configure the percentage and attendance thresholds for risk level predictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-destructive">High Risk Thresholds</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="high_risk_percentage">Percentage (Below)</Label>
                  <Input
                    id="high_risk_percentage"
                    type="number"
                    value={settings.high_risk_percentage}
                    onChange={(e) =>
                      setSettings({ ...settings, high_risk_percentage: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="high_risk_attendance">Attendance % (Below)</Label>
                  <Input
                    id="high_risk_attendance"
                    type="number"
                    value={settings.high_risk_attendance}
                    onChange={(e) =>
                      setSettings({ ...settings, high_risk_attendance: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-500">Risk Thresholds</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="risk_percentage">Percentage (Below)</Label>
                  <Input
                    id="risk_percentage"
                    type="number"
                    value={settings.risk_percentage}
                    onChange={(e) =>
                      setSettings({ ...settings, risk_percentage: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk_attendance">Attendance % (Below)</Label>
                  <Input
                    id="risk_attendance"
                    type="number"
                    value={settings.risk_attendance}
                    onChange={(e) =>
                      setSettings({ ...settings, risk_attendance: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-yellow-500">Low Risk Thresholds</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="low_risk_percentage">Percentage (Below)</Label>
                  <Input
                    id="low_risk_percentage"
                    type="number"
                    value={settings.low_risk_percentage}
                    onChange={(e) =>
                      setSettings({ ...settings, low_risk_percentage: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="low_risk_attendance">Attendance % (Below)</Label>
                  <Input
                    id="low_risk_attendance"
                    type="number"
                    value={settings.low_risk_attendance}
                    onChange={(e) =>
                      setSettings({ ...settings, low_risk_attendance: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Save Settings
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
