/*
  # Course Management System Enhancement

  1. New Tables and Modifications
    - Add new columns to courses table:
      - `thumbnail_url` (text)
      - `duration_weeks` (integer)
      - `lesson_count` (integer)
      - `enrolled_count` (integer)
      - `rating` (float)
      - `review_count` (integer)

  2. Changes
    - Add constraints and defaults for new columns
    - Add indexes for frequently queried columns
*/

-- Add new columns to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS thumbnail_url text,
ADD COLUMN IF NOT EXISTS duration_weeks integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS lesson_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS enrolled_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating float DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS courses_category_idx ON courses(category);
CREATE INDEX IF NOT EXISTS courses_difficulty_idx ON courses(difficulty);
CREATE INDEX IF NOT EXISTS courses_rating_idx ON courses(rating);

-- Update user_courses table to include completion status
ALTER TABLE user_courses
ADD COLUMN IF NOT EXISTS completion_date timestamptz;

-- Create function to update enrolled count
CREATE OR REPLACE FUNCTION update_course_enrolled_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses 
    SET enrolled_count = enrolled_count + 1
    WHERE id = NEW.course_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses 
    SET enrolled_count = enrolled_count - 1
    WHERE id = OLD.course_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for enrolled count
DROP TRIGGER IF EXISTS update_enrolled_count ON user_courses;
CREATE TRIGGER update_enrolled_count
AFTER INSERT OR DELETE ON user_courses
FOR EACH ROW
EXECUTE FUNCTION update_course_enrolled_count();