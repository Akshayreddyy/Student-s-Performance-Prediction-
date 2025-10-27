import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Brain, Trophy, Database } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const years = [
    {
      year: 1,
      title: "First Year",
      description: "Foundation courses in core subjects",
      subjects: ["Mathematics", "Physics", "Chemistry", "English", "Computer Basics"],
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500"
    },
    {
      year: 2,
      title: "Second Year",
      description: "Building programming skills",
      subjects: ["Data Structures", "Mathematics", "Python", "Operating Systems", "Networks"],
      icon: Brain,
      color: "from-purple-500 to-pink-500"
    },
    {
      year: 3,
      title: "Third Year",
      description: "Advanced computing concepts",
      subjects: ["Machine Learning", "DBMS", "Web Technologies", "Probability", "AI Basics"],
      icon: GraduationCap,
      color: "from-green-500 to-emerald-500"
    },
    {
      year: 4,
      title: "Fourth Year",
      description: "Specialization & capstone",
      subjects: ["Deep Learning", "AI Ethics", "Cloud Computing", "NLP", "Capstone Project"],
      icon: Trophy,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJoc2woMjE3IDkxJSA2MCUgLyAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        
        <div className="container relative mx-auto px-4 py-16">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
              <Brain className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-primary font-semibold">AI-Powered Analytics</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent animate-slide-in">
              Student Performance
              <br />
              Prediction System
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
              Predict academic risk levels using advanced ML algorithms.
              Track performance, analyze patterns, and get insights for better outcomes.
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate("/bulk-analysis")}
                className="bg-gradient-success hover:opacity-90 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                size="lg"
              >
                <Database className="w-5 h-5 mr-2" />
                Bulk Dataset Analysis
              </Button>
              <Button
                onClick={() => navigate("/settings")}
                variant="outline"
                size="lg"
              >
                <Settings className="w-5 h-5 mr-2" />
                Risk Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Year Selection Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Select Academic Year</h2>
          <p className="text-muted-foreground">Choose a year to enter student performance data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {years.map((yearData, index) => {
            const Icon = yearData.icon;
            return (
              <Card 
                key={yearData.year}
                className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/year/${yearData.year}`)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${yearData.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <CardContent className="p-6 relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Year {yearData.year}</h3>
                      <p className="text-sm text-muted-foreground">{yearData.title}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{yearData.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-primary">Key Subjects:</p>
                    <div className="flex flex-wrap gap-2">
                      {yearData.subjects.slice(0, 3).map((subject) => (
                        <span key={subject} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                          {subject}
                        </span>
                      ))}
                      {yearData.subjects.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                          +{yearData.subjects.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-6 bg-primary hover:bg-primary/90 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
                    onClick={() => navigate(`/year/${yearData.year}`)}
                  >
                    Enter Data
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm animate-fade-in">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-success flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2">AI-Powered Predictions</h3>
            <p className="text-sm text-muted-foreground">Advanced ML algorithms analyze patterns to predict risk levels</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2">Comprehensive Tracking</h3>
            <p className="text-sm text-muted-foreground">Monitor attendance and performance across all subjects</p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-danger flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold mb-2">Instant Results</h3>
            <p className="text-sm text-muted-foreground">Get immediate feedback on academic risk assessment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
