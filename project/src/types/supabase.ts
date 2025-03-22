export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor_id: string;
  instructor_name?: string;
  thumbnail_url?: string;
  duration_weeks: number;
  lesson_count: number;
  enrolled_count: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserCourse {
  id: string;
  user_id: string;
  course_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  completion_date?: string;
  last_accessed: string;
  created_at: string;
  updated_at: string;
}

export interface CourseFilters {
  category: string | null;
  difficulty: string | null;
  duration: string | null;
  rating: string | null;
}