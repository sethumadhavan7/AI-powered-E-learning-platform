import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';
import { useCourseStore } from '../store/courseStore';
import { useAuthStore } from '../store/authStore';
import CourseCard from './CourseCard';
import CourseCreationModal from './CourseCreationModal';

const Courses = () => {
  const { user } = useAuthStore();
  const { courses, userCourses, loading, fetchCourses, fetchUserCourses, filters, setFilters } = useCourseStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  useEffect(() => {
    fetchCourses();
    fetchUserCourses();
  }, [fetchCourses, fetchUserCourses]);

  const getMyCourses = () => {
    const myCourseIds = new Set(userCourses.map(uc => uc.course_id));
    return courses.filter(course => myCourseIds.has(course.id));
  };

  const filteredCourses = (activeTab === 'all' ? courses : getMyCourses()).filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filters.category || course.category === filters.category;
    const matchesDifficulty = !filters.difficulty || course.difficulty === filters.difficulty;
    const matchesDuration = !filters.duration || (
      filters.duration === 'short' ? course.duration_weeks <= 4 :
      filters.duration === 'medium' ? course.duration_weeks > 4 && course.duration_weeks <= 8 :
      course.duration_weeks > 8
    );
    const matchesRating = !filters.rating || course.rating >= parseInt(filters.rating);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration && matchesRating;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Courses</h1>
            <p className="text-indigo-200">Discover and enroll in courses that match your interests</p>
          </div>
          {user?.role === 'educator' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create Course</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-indigo-200 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>All Courses</span>
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'my'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-indigo-200 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>My Courses</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value || null })}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="data-science">Data Science</option>
                <option value="ai-ml">AI & Machine Learning</option>
                <option value="design">Design</option>
              </select>

              <select
                value={filters.difficulty || ''}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value || null })}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={filters.duration || ''}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value || null })}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Durations</option>
                <option value="short">Short (&lt;4 weeks)</option>
                <option value="medium">Medium (4-8 weeks)</option>
                <option value="long">Long (&gt;8 weeks)</option>
              </select>

              <select
                value={filters.rating || ''}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value || null })}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
          )}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={activeTab === 'my'}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-indigo-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'my' ? 'No enrolled courses found' : 'No courses found'}
            </h3>
            <p className="text-indigo-200">
              {activeTab === 'my' 
                ? 'Start exploring and enroll in courses that interest you'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        )}
      </div>

      {/* Course Creation Modal */}
      {showCreateModal && (
        <CourseCreationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchCourses();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Courses;