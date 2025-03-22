import React, { useState } from 'react';
import { BookOpen, Layout, BarChart, Settings, User, LogOut, MessageSquare, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import QuizGenerator from './QuizGenerator';

const Navigation = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuthStore();
  const [showQuizGenerator, setShowQuizGenerator] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 h-screen w-64 bg-indigo-900 text-white p-4">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-xl font-bold">EDU Sphere</h1>
        </div>
        
        <div className="flex flex-col h-full">
          <div className="space-y-2">
            <NavItem icon={<Layout />} label="Dashboard" onClick={() => navigate('/dashboard')} />
            <NavItem icon={<BookOpen />} label="My Courses" onClick={() => navigate('/courses')} />
            <NavItem icon={<BarChart />} label="Progress" onClick={() => navigate('/progress')} />
            <NavItem icon={<MessageSquare />} label="Opportunity Chat" onClick={() => navigate('/chat')} />
            <NavItem icon={<Brain />} label="Generate Quiz" onClick={() => setShowQuizGenerator(true)} />
            <NavItem icon={<User />} label="Profile" onClick={() => navigate('/profile')} />
            <NavItem icon={<Settings />} label="Settings" onClick={() => navigate('/settings')} />
          </div>

          <div className="mt-auto">
            <div className="border-t border-indigo-800 pt-4 mb-4">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-indigo-200 hover:bg-indigo-800 hover:text-white transition-colors mb-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
              <div className="flex items-center gap-3 px-3">
                <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Quiz Generator Modal */}
      {showQuizGenerator && (
        <QuizGenerator onClose={() => setShowQuizGenerator(false)} />
      )}
    </>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  active = false,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors
        ${active 
          ? 'bg-indigo-800 text-white' 
          : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default Navigation;