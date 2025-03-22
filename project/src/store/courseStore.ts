import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import type { Course, UserCourse, CourseFilters } from '../types/supabase';
import { useToastStore } from '../components/ui/Toaster';

interface CourseState {
  courses: Course[];
  userCourses: UserCourse[];
  loading: boolean;
  error: string | null;
  filters: CourseFilters;
  fetchCourses: () => Promise<void>;
  fetchUserCourses: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCourseStatus: (courseId: string, status: UserCourse['status']) => Promise<void>;
  setFilters: (filters: Partial<CourseFilters>) => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  userCourses: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    difficulty: null,
    duration: null,
    rating: null,
  },

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedCourses = courses.map(course => ({
        ...course,
        instructor_name: course.instructor?.full_name || 'Unknown Instructor'
      }));

      set({ courses: transformedCourses });
    } catch (error) {
      console.error('Error fetching courses:', error);
      set({ error: 'Failed to fetch courses' });
    } finally {
      set({ loading: false });
    }
  },

  fetchUserCourses: async () => {
    set({ loading: true, error: null });
    try {
      const { data: userCourses, error } = await supabase
        .from('user_courses')
        .select('*')
        .order('last_accessed', { ascending: false });

      if (error) throw error;
      set({ userCourses });
    } catch (error) {
      console.error('Error fetching user courses:', error);
      set({ error: 'Failed to fetch user courses' });
    } finally {
      set({ loading: false });
    }
  },

  addCourse: async (course) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([course])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ courses: [data, ...state.courses] }));
    } catch (error) {
      console.error('Error adding course:', error);
      set({ error: 'Failed to add course' });
    } finally {
      set({ loading: false });
    }
  },

  updateCourseStatus: async (courseId, status) => {
    set({ loading: true, error: null });
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const { data: existingEnrollment } = await supabase
        .from('user_courses')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingEnrollment) {
        const { error } = await supabase
          .from('user_courses')
          .update({ 
            status, 
            last_accessed: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEnrollment.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_courses')
          .insert([{
            course_id: courseId,
            user_id: userId,
            status,
            progress: 0,
            last_accessed: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      // Show success toast
      useToastStore.getState().addToast({
        type: 'success',
        message: 'Successfully enrolled in course!'
      });

      // Refresh user courses
      await get().fetchUserCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
      set({ error: 'Failed to update course status' });
      useToastStore.getState().addToast({
        type: 'error',
        message: 'Failed to enroll in course'
      });
    } finally {
      set({ loading: false });
    }
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },
}));