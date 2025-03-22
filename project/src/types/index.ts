export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'educator';
  progress: number;
  completedCourses: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'interactive';
  content: string;
  completed: boolean;
}

export interface LearningPath {
  id: string;
  userId: string;
  courses: string[];
  currentCourse: string;
  progress: number;
  recommendations: string[];
}