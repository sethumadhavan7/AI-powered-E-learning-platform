import React, { useState } from 'react';
import { 
  BookOpen, Clock, Award, TrendingUp, Brain, Star, 
  ChevronRight, Play, BarChart, MessageSquare, Trophy,
  Settings, User, Search, FileText, Video // Added Video icon for the video call feature
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import ResourceAggregator from './ResourceAggregator';
import ResumeScreening from './ResumeScreening';
import AIChat from './AIChat';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [showAIChat, setShowAIChat] = useState(false);
  const [showResourceAggregator, setShowResourceAggregator] = useState(false);
  const [showResumeScreening, setShowResumeScreening] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <header className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-indigo-200">Your learning journey continues</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowResourceAggregator(!showResourceAggregator)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>Find Resources</span>
              </button>
              {user?.role === 'educator' && (
                <button
                  onClick={() => setShowResumeScreening(!showResumeScreening)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Resume Screening</span>
                </button>
              )}
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    className="text-indigo-900"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="36"
                    cx="40"
                    cy="40"
                  />
                  <circle
                    className="text-purple-500"
                    strokeWidth="4"
                    strokeDasharray={226.2}
                    strokeDashoffset={226.2 * (1 - 0.85)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="36"
                    cx="40"
                    cy="40"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">85%</span>
                </div>
              </div>
              <div className="text-indigo-200">
                <p className="text-sm">Overall Progress</p>
                <p className="text-white font-semibold">Level 12</p>
              </div>
            </div>
          </div>
        </header>

        {/* Resource Aggregator */}
        {showResourceAggregator && <ResourceAggregator />}

        {/* Resume Screening */}
        {showResumeScreening && <ResumeScreening />}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            icon={<BookOpen className="w-6 h-6 text-blue-400" />}
            label="Active Courses"
            value="8"
            subtext="3 in progress"
            trend="+2 this week"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-green-400" />}
            label="Learning Hours"
            value="48"
            subtext="This month"
            trend="+5 hrs today"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-purple-400" />}
            label="Certificates"
            value="12"
            subtext="4 pending"
            trend="2 new"
          />
          <StatCard
            icon={<Brain className="w-6 h-6 text-pink-400" />}
            label="AI Quiz Score"
            value="92%"
            subtext="Last attempt"
            trend="+5% improvement"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Active Courses */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Active Courses</h2>
              <button className="text-indigo-300 hover:text-white text-sm flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:space-y-8">
            {/* AI Quiz Challenge */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Daily AI Challenge</h2>
              </div>
              <p className="text-indigo-200 text-sm mb-4">
                Ready for today's personalized quiz on Machine Learning fundamentals?
              </p>
              <button className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Play className="w-4 h-4" /> Start Quiz
              </button>
            </div>

            {/* Learning Stats */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4">Weekly Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <BarChart className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-indigo-200 text-sm">Study Time</span>
                      <span className="text-white font-medium">12h 30m</span>
                    </div>
                    <div className="h-2 bg-blue-900/50 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-indigo-200 text-sm">Quiz Score</span>
                      <span className="text-white font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-green-900/50 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionButton
                  icon={<MessageSquare className="w-5 h-5" />}
                  label="AI Chat"
                  onClick={() => setShowAIChat(true)}
                />
                <QuickActionButton
                  icon={<User className="w-5 h-5" />}
                  label="Profile"
                />
                <QuickActionButton
                  icon={<Trophy className="w-5 h-5" />}
                  label="Rankings"
                />
                <QuickActionButton
                  icon={<Settings className="w-5 h-5" />}
                  label="Settings"
                />
                {/* Video Call Feature */}
                <QuickActionButton
                  icon={<Video className="w-5 h-5" />} // Added Video icon
                  label="Video Call"
                  onClick={() => window.open("https://hearttohear-frontend.onrender.com/#/", "_blank")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showAIChat && <AIChat onClose={() => setShowAIChat(false)} />}
    </div>
  );
};

const StatCard = ({ 
  icon, 
  label, 
  value, 
  subtext,
  trend 
}: { 
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  trend: string;
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
        <div>
          <h3 className="text-indigo-200 text-sm">{label}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-indigo-300 text-sm">{subtext}</span>
            <span className="text-green-400 text-xs">• {trend}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({
  title,
  progress,
  image,
  lastAccessed,
  duration,
  videoUrl,
}: {
  title: string;
  progress: number;
  image: string;
  lastAccessed: string;
  duration: string;
  videoUrl: string;
}) => {
  const handleCourseClick = () => {
    window.open(videoUrl, '_blank');
  };

  return (
    <div 
      className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors group cursor-pointer"
      onClick={handleCourseClick}
    >
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={title}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-medium text-white mb-2">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-indigo-200 mb-3">
            <span>Last accessed: {lastAccessed}</span>
            <span>•</span>
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-indigo-900/50 rounded-full">
              <div
                className="h-2 bg-purple-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white font-medium">{progress}%</span>
          </div>
        </div>
        <button className="p-2 text-indigo-300 hover:text-white transition-colors">
          <Play className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const QuickActionButton = ({ 
  icon, 
  label,
  onClick 
}: { 
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
    >
      {icon}
      <span className="text-indigo-200 text-sm">{label}</span>
    </button>
  );
};

const courses = [
  {
    title: "Machine Learning Fundamentals",
    progress: 65,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60",
    lastAccessed: "Today",
    duration: "2h 30m remaining",
    videoUrl: "https://youtu.be/ukzFI9rgwfU?si=-DxRd-pRVeO57pnP"
  },
  {
    title: "Deep Learning Specialization",
    progress: 45,
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60",
    lastAccessed: "Yesterday",
    duration: "4h remaining",
    videoUrl: "https://youtu.be/J4g6KCS5bw4?si=2a79LD-pLyuTyqrH"
  },
  {
    title: "Neural Networks Advanced",
    progress: 85,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60",
    lastAccessed: "2 days ago",
    duration: "1h remaining",
    videoUrl: "https://youtu.be/aircAruvnKk?si=kNDi2r7PEocpJzJ1"
  }
];

export default Dashboard;