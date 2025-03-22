import React from 'react';
import { Clock, Book, Users, Star, Play, ChevronRight } from 'lucide-react';
import { Course } from '../types/supabase';
import { useCourseStore } from '../store/courseStore';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled = false }) => {
  const { updateCourseStatus } = useCourseStore();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-purple-500/20 text-purple-400';
    }
  };

  if (isEnrolled) {
    return (
      <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all group">
        <div className="relative">
          <img
            src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea'}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors">
              <Play className="w-5 h-5" />
              <span>Continue Learning</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-indigo-300">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{course.duration_weeks} weeks</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-300">
              <Book className="w-4 h-4" />
              <span className="text-sm">{course.lesson_count} lessons</span>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="space-y-3 mt-6">
            <h4 className="text-white font-medium">Course Content</h4>
            <div className="space-y-2">
              {Array.from({ length: Math.min(3, course.lesson_count) }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 text-sm">{idx + 1}</span>
                    </div>
                    <span className="text-indigo-200">Lesson {idx + 1}</span>
                  </div>
                  <Play className="w-4 h-4 text-indigo-300" />
                </div>
              ))}
            </div>
            {course.lesson_count > 3 && (
              <button className="w-full text-center text-indigo-300 hover:text-white transition-colors text-sm">
                View all {course.lesson_count} lessons
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all group">
      <div className="relative">
        <img
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea'}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
            {course.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{course.title}</h3>
        <p className="text-indigo-200 mb-4 text-sm line-clamp-2">{course.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-indigo-300">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{course.duration_weeks} weeks</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-300">
            <Book className="w-4 h-4" />
            <span className="text-sm">{course.lesson_count} lessons</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-300">
            <Users className="w-4 h-4" />
            <span className="text-sm">{course.enrolled_count} enrolled</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-300">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm">{course.rating.toFixed(1)} ({course.review_count})</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-purple-400 text-sm font-medium">
                {course.instructor_name?.[0].toUpperCase()}
              </span>
            </div>
            <span className="text-indigo-200 text-sm">{course.instructor_name}</span>
          </div>
          
          <button
            onClick={() => updateCourseStatus(course.id, 'not_started')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors group-hover:bg-purple-600"
          >
            <span>Enroll</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;