-- Create students table to store student information and predictions
CREATE TABLE public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance_data table to store marks and attendance
CREATE TABLE public.performance_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_uuid UUID REFERENCES public.students(id) ON DELETE CASCADE,
  year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
  
  -- Attendance
  attendance_s1 DECIMAL(5,2),
  attendance_s2 DECIMAL(5,2),
  avg_attendance DECIMAL(5,2),
  
  -- Year 1 subjects
  maths_y1_score DECIMAL(5,2),
  maths_y1_credit INTEGER,
  physics_y1_score DECIMAL(5,2),
  physics_y1_credit INTEGER,
  chemistry_y1_score DECIMAL(5,2),
  chemistry_y1_credit INTEGER,
  english_y1_score DECIMAL(5,2),
  english_y1_credit INTEGER,
  computer_y1_score DECIMAL(5,2),
  computer_y1_credit INTEGER,
  
  -- Year 2 subjects
  data_structures_y2_score DECIMAL(5,2),
  data_structures_y2_credit INTEGER,
  maths_y2_score DECIMAL(5,2),
  maths_y2_credit INTEGER,
  python_y2_score DECIMAL(5,2),
  python_y2_credit INTEGER,
  os_y2_score DECIMAL(5,2),
  os_y2_credit INTEGER,
  networks_y2_score DECIMAL(5,2),
  networks_y2_credit INTEGER,
  
  -- Year 3 subjects
  ml_y3_score DECIMAL(5,2),
  ml_y3_credit INTEGER,
  dbms_y3_score DECIMAL(5,2),
  dbms_y3_credit INTEGER,
  web_tech_y3_score DECIMAL(5,2),
  web_tech_y3_credit INTEGER,
  probability_y3_score DECIMAL(5,2),
  probability_y3_credit INTEGER,
  ai_basics_y3_score DECIMAL(5,2),
  ai_basics_y3_credit INTEGER,
  
  -- Year 4 subjects
  deep_learning_y4_score DECIMAL(5,2),
  deep_learning_y4_credit INTEGER,
  ai_ethics_y4_score DECIMAL(5,2),
  ai_ethics_y4_credit INTEGER,
  cloud_computing_y4_score DECIMAL(5,2),
  cloud_computing_y4_credit INTEGER,
  nlp_y4_score DECIMAL(5,2),
  nlp_y4_credit INTEGER,
  capstone_y4_score DECIMAL(5,2),
  capstone_y4_credit INTEGER,
  
  -- Calculated fields
  percentage DECIMAL(5,2),
  cgpa DECIMAL(4,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create predictions table to store risk predictions
CREATE TABLE public.predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_uuid UUID REFERENCES public.students(id) ON DELETE CASCADE,
  performance_data_id UUID REFERENCES public.performance_data(id) ON DELETE CASCADE,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low Risk', 'At Risk', 'High Risk')),
  risk_score DECIMAL(5,2),
  percentage DECIMAL(5,2),
  avg_attendance DECIMAL(5,2),
  factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for this educational tool)
CREATE POLICY "Allow public read access on students"
  ON public.students FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on students"
  ON public.students FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access on performance_data"
  ON public.performance_data FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on performance_data"
  ON public.performance_data FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access on predictions"
  ON public.predictions FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on predictions"
  ON public.predictions FOR INSERT
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performance_data_updated_at
  BEFORE UPDATE ON public.performance_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();