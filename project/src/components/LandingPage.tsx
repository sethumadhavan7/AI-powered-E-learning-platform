import React from 'react';
import { Brain, BookOpen, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">EDU Sphere </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/auth"
              className="px-4 py-2 text-indigo-200 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-indigo-200 backdrop-blur-xl">
              Transform your learning experience
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              Elevate your skills with{' '}
              <span className="text-blue-400">AI-powered</span> learning
            </h1>
            <p className="text-xl text-indigo-200">
              Experience the future of education with adaptive courses, AI-generated quizzes,
              and real-time progress tracking.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/auth"
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                Get started for free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/courses"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                Explore courses
              </Link>
            </div>
            <div className="flex items-center gap-2 text-indigo-200">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-indigo-900"
                  />
                ))}
              </div>
              <span>Joined by 10,000+ students</span>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
              alt="Learning"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Learning</h3>
            <p className="text-indigo-200">
              Personalized learning paths and adaptive quizzes tailored to your progress.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Expert-Led Courses</h3>
            <p className="text-indigo-200">
              Learn from industry experts with real-world experience and practical insights.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-indigo-200">
              Monitor your learning journey with detailed analytics and achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;