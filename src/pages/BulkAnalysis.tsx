import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, Loader2, Download, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface StudentResult {
  student_id: string;
  year: number;
  percentage: number;
  avg_attendance: number;
  risk_level: string;
  risk_score: number;
}

const BulkAnalysis = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv") {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
      setResults([]);
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue;
      const values = lines[i].split(",");
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim();
      });
      data.push(row);
    }

    return data;
  };

  const calculatePercentageFromRow = (row: any, year: number): number => {
    const subjects: { [key: number]: { names: string[], credits: number[] } } = {
      1: {
        names: ["Maths_Y1_Score", "Physics_Y1_Score", "Chemistry_Y1_Score", "English_Y1_Score", "Computer_Y1_Score"],
        credits: [4, 3, 3, 3, 3]
      },
      2: {
        names: ["Data Structures_Y2_Score", "Maths_Y2_Score", "Python Programming_Y2_Score", "Operating Systems_Y2_Score", "Computer Networks_Y2_Score"],
        credits: [4, 4, 4, 3, 3]
      },
      3: {
        names: ["Machine Learning_Y3_Score", "DBMS_Y3_Score", "Web Technologies_Y3_Score", "Probability_Y3_Score", "AI Basics_Y3_Score"],
        credits: [4, 4, 3, 3, 3]
      },
      4: {
        names: ["Deep Learning_Y4_Score", "AI Ethics_Y4_Score", "Cloud Computing_Y4_Score", "NLP_Y4_Score", "Capstone Project_Y4_Score"],
        credits: [4, 3, 4, 3, 6]
      }
    };

    const yearData = subjects[year];
    if (!yearData) return 0;

    let totalWeighted = 0;
    let totalCredits = 0;

    yearData.names.forEach((name, index) => {
      const score = parseFloat(row[name]) || 0;
      const credit = yearData.credits[index];
      totalWeighted += score * credit;
      totalCredits += credit;
    });

    return totalCredits > 0 ? parseFloat((totalWeighted / totalCredits).toFixed(2)) : 0;
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      toast.info(`Processing ${data.length} student records...`);
      const analysisResults: StudentResult[] = [];

      for (const row of data) {
        const studentId = row.Student_ID;
        const year = parseInt(row.Year) || 1;
        
        // Calculate attendance
        let attendance1 = 0, attendance2 = 0;
        if (year === 1) {
          attendance1 = parseFloat(row.Attendance_Y1_S1) || 0;
          attendance2 = parseFloat(row.Attendance_Y1_S2) || 0;
        } else if (year === 2) {
          attendance1 = parseFloat(row.Attendance_Y2_S1) || 0;
          attendance2 = parseFloat(row.Attendance_Y2_S2) || 0;
        } else if (year === 3) {
          attendance1 = parseFloat(row.Attendance_Y3_S1) || 0;
          attendance2 = parseFloat(row.Attendance_Y3_S2) || 0;
        } else if (year === 4) {
          attendance1 = parseFloat(row.Attendance_Y4_S1) || 0;
          attendance2 = parseFloat(row.Attendance_Y4_S2) || 0;
        }

        const avgAttendance = parseFloat(((attendance1 + attendance2) / 2).toFixed(2));
        const percentage = parseFloat(row.Percentage) || calculatePercentageFromRow(row, year);

        // Get all subject scores for the year to check for failures
        const yearData = {
          1: ["Maths_Y1_Score", "Physics_Y1_Score", "Chemistry_Y1_Score", "English_Y1_Score", "Computer_Y1_Score"],
          2: ["Data Structures_Y2_Score", "Maths_Y2_Score", "Python Programming_Y2_Score", "Operating Systems_Y2_Score", "Computer Networks_Y2_Score"],
          3: ["Machine Learning_Y3_Score", "DBMS_Y3_Score", "Web Technologies_Y3_Score", "Probability_Y3_Score", "AI Basics_Y3_Score"],
          4: ["Deep Learning_Y4_Score", "AI Ethics_Y4_Score", "Cloud Computing_Y4_Score", "NLP_Y4_Score", "Capstone Project_Y4_Score"]
        };

        const subjectScores = yearData[year as keyof typeof yearData]?.map(subject => parseFloat(row[subject]) || 0) || [];

        // Determine risk level based on thresholds
        let riskLevel = "No Risk";
        let riskScore = 0.10;

        // High Risk: Below 36% percentage OR below 50% attendance
        if (percentage < 36 || avgAttendance < 50) {
          riskLevel = "High Risk";
          riskScore = 0.85;
        }
        // Risk (At Risk): Below 50% percentage OR below 65% attendance
        else if (percentage < 50 || avgAttendance < 65) {
          riskLevel = "Risk";
          riskScore = 0.60;
        }
        // Low Risk: Below 70% percentage OR below 75% attendance
        else if (percentage < 70 || avgAttendance < 75) {
          riskLevel = "Low Risk";
          riskScore = 0.35;
        }
        // No Risk: Above 70% percentage AND above 75% attendance
        else {
          riskLevel = "No Risk";
          riskScore = 0.10;
        }

        analysisResults.push({
          student_id: studentId,
          year,
          percentage,
          avg_attendance: avgAttendance,
          risk_level: riskLevel,
          risk_score: parseFloat(riskScore.toFixed(2))
        });
      }

      setResults(analysisResults);
      toast.success(`Analysis complete! Processed ${analysisResults.length} students`);
    } catch (error: any) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file. Please check the format.");
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (results.length === 0) return;

    const csv = [
      ["Student ID", "Year", "Percentage", "Avg Attendance", "Risk Level", "Risk Score"].join(","),
      ...results.map(r => [
        r.student_id,
        r.year,
        r.percentage,
        r.avg_attendance,
        r.risk_level,
        r.risk_score
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `risk_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredResults = results.filter(r => {
    if (filter === "all") return true;
    if (filter === "risk") return r.risk_level === "High Risk" || r.risk_level === "Risk" || r.risk_level === "Low Risk";
    if (filter === "safe") return r.risk_level === "No Risk";
    return true;
  });

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "No Risk":
        return <Badge className="bg-green-500 hover:bg-green-600">No Risk</Badge>;
      case "Low Risk":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Low Risk</Badge>;
      case "Risk":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Risk</Badge>;
      case "High Risk":
        return <Badge className="bg-red-500 hover:bg-red-600">High Risk</Badge>;
      default:
        return <Badge>{riskLevel}</Badge>;
    }
  };

  const riskCount = results.filter(r => r.risk_level === "High Risk" || r.risk_level === "Risk" || r.risk_level === "Low Risk").length;
  const safeCount = results.filter(r => r.risk_level === "No Risk").length;

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-primary">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Bulk Student Analysis</CardTitle>
                <CardDescription>Upload a CSV dataset to analyze multiple students at once</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="csv-file">Upload Student Dataset (CSV)</Label>
              <div className="flex gap-4">
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="bg-input border-border flex-1"
                />
                <Button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="bg-gradient-primary hover:opacity-90 min-w-[150px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with columns: Student_ID, Year, Attendance (S1/S2), and subject scores
              </p>
            </div>

            {results.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50 border-border">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Total Students</p>
                        <p className="text-4xl font-bold text-primary">{results.length}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-500/10 border-red-500/20">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">At Risk Students</p>
                        <p className="text-4xl font-bold text-red-500">{riskCount}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-500/10 border-green-500/20">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Safe Students</p>
                        <p className="text-4xl font-bold text-green-500">{safeCount}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      onClick={() => setFilter("all")}
                      size="sm"
                    >
                      All ({results.length})
                    </Button>
                    <Button
                      variant={filter === "risk" ? "default" : "outline"}
                      onClick={() => setFilter("risk")}
                      size="sm"
                    >
                      At Risk ({riskCount})
                    </Button>
                    <Button
                      variant={filter === "safe" ? "default" : "outline"}
                      onClick={() => setFilter("safe")}
                      size="sm"
                    >
                      Safe ({safeCount})
                    </Button>
                  </div>

                  <Button
                    onClick={exportResults}
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                </div>

                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-0">
                    <div className="max-h-[600px] overflow-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-card z-10">
                          <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Attendance</TableHead>
                            <TableHead>Risk Level</TableHead>
                            <TableHead>Risk Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredResults.map((result, index) => (
                            <TableRow key={index} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{result.student_id}</TableCell>
                              <TableCell>Year {result.year}</TableCell>
                              <TableCell>{result.percentage.toFixed(2)}%</TableCell>
                              <TableCell>{result.avg_attendance.toFixed(2)}%</TableCell>
                              <TableCell>{getRiskBadge(result.risk_level)}</TableCell>
                              <TableCell>{(result.risk_score * 100).toFixed(1)}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BulkAnalysis;
