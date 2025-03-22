import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Award, Star, Clock, MessageSquare } from 'lucide-react';
import { useCourseStore } from '../store/courseStore';
import OpportunityChat from './OpportunityChat';
import { useSearchParams } from 'react-router-dom';

const Progress = () => {
  const { userCourses } = useCourseStore();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'progress' | 'opportunities'>('progress');

  useEffect(() => {
    if (searchParams.get('tab') === 'opportunities') {
      setActiveTab('opportunities');
    }
  }, [searchParams]);

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'progress'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-indigo-200 hover:bg-white/10'
            }`}
          >
            <BarChart className="w-5 h-5" />
            <span>Learning Progress</span>
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'opportunities'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-indigo-200 hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Opportunity Chat</span>
          </button>
        </div>

        {activeTab === 'progress' ? (
          <>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h1 className="text-2xl font-bold text-white mb-6">Learning Progress</h1>

              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <BarChart className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-white">Overall Progress</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">85%</div>
                  <div className="w-full h-2 bg-blue-900/50 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="text-white">Courses Completed</span>
                  </div>
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-indigo-300 text-sm">+3 this month</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Clock className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-white">Learning Hours</span>
                  </div>
                  <div className="text-2xl font-bold text-white">48h</div>
                  <div className="text-indigo-300 text-sm">This month</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Award className="w-6 h-6 text-yellow-400" />
                    </div>
                    <span className="text-white">Achievements</span>
                  </div>
                  <div className="text-2xl font-bold text-white">15</div>
                  <div className="text-indigo-300 text-sm">4 new this week</div>
                </div>
              </div>

              {/* Course Progress */}
              <div className="bg-white/5 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Course Progress</h2>
                <div className="space-y-4">
                  {userCourses.map((userCourse) => (
                    <div key={userCourse.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">Course Title</h3>
                        <span className="text-indigo-300">{userCourse.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-indigo-900/50 rounded-full">
                        <div
                          className="h-2 bg-purple-500 rounded-full transition-all"
                          style={{ width: `${userCourse.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="text-indigo-300">
                          Last accessed: {new Date(userCourse.last_accessed).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          userCourse.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          userCourse.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {userCourse.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <OpportunityChat />
        )}
      </div>
    </div>
  );
};

export default Progress;