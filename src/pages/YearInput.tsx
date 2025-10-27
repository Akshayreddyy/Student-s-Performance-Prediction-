import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubjectConfig {
  name: string;
  columnName: string;
  credit: number;
}

const YEAR_SUBJECTS: Record<number, SubjectConfig[]> = {
  1: [
    { name: "Mathematics", columnName: "maths", credit: 4 },
    { name: "Physics", columnName: "physics", credit: 3 },
    { name: "Chemistry", columnName: "chemistry", credit: 3 },
    { name: "English", columnName: "english", credit: 3 },
    { name: "Computer", columnName: "computer", credit: 3 }
  ],
  2: [
    { name: "Data Structures", columnName: "data_structures", credit: 4 },
    { name: "Mathematics", columnName: "maths", credit: 4 },
    { name: "Python Programming", columnName: "python", credit: 4 },
    { name: "Operating Systems", columnName: "os", credit: 3 },
    { name: "Computer Networks", columnName: "networks", credit: 3 }
  ],
  3: [
    { name: "Machine Learning", columnName: "ml", credit: 4 },
    { name: "DBMS", columnName: "dbms", credit: 4 },
    { name: "Web Technologies", columnName: "web_tech", credit: 3 },
    { name: "Probability", columnName: "probability", credit: 3 },
    { name: "AI Basics", columnName: "ai_basics", credit: 3 }
  ],
  4: [
    { name: "Deep Learning", columnName: "deep_learning", credit: 4 },
    { name: "AI Ethics", columnName: "ai_ethics", credit: 3 },
    { name: "Cloud Computing", columnName: "cloud_computing", credit: 4 },
    { name: "NLP", columnName: "nlp", credit: 3 },
    { name: "Capstone Project", columnName: "capstone", credit: 6 }
  ]
};

const YearInput = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const yearNum = parseInt(year || "1");
  
  const [loading, setLoading] = useState(false);
  const [attendanceS1, setAttendanceS1] = useState("");
  const [attendanceS2, setAttendanceS2] = useState("");
  const [subjects, setSubjects] = useState<Record<string, string>>({});

  const yearSubjects = YEAR_SUBJECTS[yearNum] || [];

  const handleSubjectChange = (columnName: string, value: string) => {
    setSubjects(prev => ({
      ...prev,
      [columnName]: value
    }));
  };

  const calculateAverage = () => {
    const att1 = parseFloat(attendanceS1) || 0;
    const att2 = parseFloat(attendanceS2) || 0;
    return ((att1 + att2) / 2).toFixed(2);
  };

  const calculatePercentage = () => {
    let totalWeightedScore = 0;
    let totalCredits = 0;

    yearSubjects.forEach(subject => {
      const score = parseFloat(subjects[subject.columnName]) || 0;
      totalWeightedScore += score * subject.credit;
      totalCredits += subject.credit;
    });

    return totalCredits > 0 ? (totalWeightedScore / totalCredits).toFixed(2) : "0";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!attendanceS1 || !attendanceS2) {
      toast.error("Please enter attendance for both semesters");
      return;
    }

    const missingSubjects = yearSubjects.filter(subject => 
      !subjects[subject.columnName]
    );

    if (missingSubjects.length > 0) {
      toast.error(`Please enter scores for: ${missingSubjects.map(s => s.name).join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      // Generate a unique student ID
      const studentId = `Y${yearNum}_${Date.now()}`;

      // Create student record
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .insert({
          student_id: studentId,
          year: yearNum
        })
        .select()
        .single();

      if (studentError) {
        console.error("Student creation error:", studentError);
        throw studentError;
      }

      // Prepare performance data
      const performanceData: any = {
        student_uuid: studentData.id,
        year: yearNum,
        attendance_s1: parseFloat(attendanceS1),
        attendance_s2: parseFloat(attendanceS2),
        avg_attendance: parseFloat(calculateAverage()),
        percentage: parseFloat(calculatePercentage())
      };

      // Map subjects to database columns
      yearSubjects.forEach((subject) => {
        const score = parseFloat(subjects[subject.columnName]) || 0;
        performanceData[`${subject.columnName}_y${yearNum}_score`] = score;
        performanceData[`${subject.columnName}_y${yearNum}_credit`] = subject.credit;
      });

      console.log("Performance data to insert:", performanceData);

      const { data: performanceRecord, error: perfError } = await supabase
        .from("performance_data")
        .insert(performanceData)
        .select()
        .single();

      if (perfError) {
        console.error("Performance data error:", perfError);
        throw perfError;
      }

      // Call prediction edge function
      const subjectScores = yearSubjects.map(subject => parseFloat(subjects[subject.columnName]) || 0);
      
      const { data: predictionData, error: predictionError } = await supabase.functions.invoke('predict-risk', {
        body: {
          performance_data_id: performanceRecord.id,
          student_uuid: studentData.id,
          percentage: performanceData.percentage,
          avg_attendance: performanceData.avg_attendance,
          subject_scores: subjectScores
        }
      });

      if (predictionError) {
        console.error("Prediction error:", predictionError);
        throw predictionError;
      }

      toast.success("Prediction generated successfully!");
      navigate(`/result/${predictionData.prediction_id}`);
      
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to process data");
    } finally {
      setLoading(false);
    }
  };

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

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-primary">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Year {yearNum} Performance Data</CardTitle>
                <CardDescription>Enter student marks and attendance to predict academic risk</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Attendance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Attendance (%)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendanceS1">Semester 1 Attendance</Label>
                    <Input
                      id="attendanceS1"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={attendanceS1}
                      onChange={(e) => setAttendanceS1(e.target.value)}
                      placeholder="0-100"
                      className="bg-input border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendanceS2">Semester 2 Attendance</Label>
                    <Input
                      id="attendanceS2"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={attendanceS2}
                      onChange={(e) => setAttendanceS2(e.target.value)}
                      placeholder="0-100"
                      className="bg-input border-border"
                      required
                    />
                  </div>
                </div>
                {attendanceS1 && attendanceS2 && (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm">
                      <span className="font-semibold">Average Attendance:</span>{" "}
                      <span className="text-primary">{calculateAverage()}%</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Subjects */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Subject Scores (0-100)</h3>
                <div className="space-y-4">
                  {yearSubjects.map((subject, index) => (
                    <div
                      key={subject.columnName}
                      className="p-4 rounded-lg bg-muted/50 border border-border animate-slide-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-medium">{subject.name}</Label>
                        <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary">
                          {subject.credit} Credits
                        </span>
                      </div>
                      <Input
                        id={`${subject.columnName}-score`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={subjects[subject.columnName] || ""}
                        onChange={(e) => handleSubjectChange(subject.columnName, e.target.value)}
                        placeholder="Enter score (0-100)"
                        className="bg-input border-border"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculated Percentage */}
              {Object.keys(subjects).length > 0 && (
                <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
                  <p className="text-sm">
                    <span className="font-semibold">Calculated Percentage:</span>{" "}
                    <span className="text-primary text-lg">{calculatePercentage()}%</span>
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold py-6 text-lg shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Generate Prediction"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YearInput;
