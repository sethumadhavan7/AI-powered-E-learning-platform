/*
  # Resume Screening System Schema

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key)
      - `candidate_name` (text)
      - `email` (text)
      - `content` (text)
      - `skills` (text[])
      - `experience` (jsonb)
      - `education` (jsonb)
      - `match_score` (float)
      - `match_category` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `uploaded_by` (uuid, references profiles)
    
    - `job_descriptions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `required_skills` (text[])
      - `created_at` (timestamp)
      - `created_by` (uuid, references profiles)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name text NOT NULL,
  email text,
  content text NOT NULL,
  skills text[] DEFAULT '{}',
  experience jsonb DEFAULT '[]',
  education jsonb DEFAULT '[]',
  match_score float DEFAULT 0,
  match_category text CHECK (match_category IN ('Strong Match', 'Weak Match', 'No Match')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  uploaded_by uuid REFERENCES profiles(id) NOT NULL
);

-- Create job descriptions table
CREATE TABLE IF NOT EXISTS job_descriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  required_skills text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) NOT NULL
);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;

-- Policies for resumes
CREATE POLICY "Users can view resumes they uploaded"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can insert resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update resumes they uploaded"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

-- Policies for job descriptions
CREATE POLICY "Users can view job descriptions they created"
  ON job_descriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can insert job descriptions"
  ON job_descriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their job descriptions"
  ON job_descriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);