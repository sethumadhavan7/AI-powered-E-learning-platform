import React, { useState } from 'react';
import { Eye, EyeOff, BookOpen, Brain, Cpu, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, signOut, user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while signing out');
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 px-4 py-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 text-center w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-white mb-6 break-all">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 relative overflow-hidden px-4 py-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-20 animate-pulse hidden sm:block"></div>
        <div className="absolute right-1/3 top-1/3 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-pulse delay-300 hidden sm:block"></div>
        <div className="absolute left-1/3 bottom-1/4 w-40 h-40 bg-indigo-500 rounded-full opacity-20 animate-pulse delay-700 hidden sm:block"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <Brain className="absolute top-1/4 left-1/4 w-8 h-8 text-indigo-300 opacity-30 animate-float" />
        <Cpu className="absolute top-1/3 right-1/4 w-6 h-6 text-purple-300 opacity-30 animate-float-delayed" />
        <BookOpen className="absolute bottom-1/4 left-1/3 w-7 h-7 text-blue-300 opacity-30 animate-float" />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 border border-white/20">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-indigo-200 text-sm sm:text-base">
              {isSignUp 
                ? 'Join our AI-powered learning community'
                : 'Continue your learning journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-1.5 sm:mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-indigo-300/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-indigo-300/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" /> : <Eye className="w-4 sm:w-5 h-4 sm:h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 px-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg text-sm sm:text-base"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>

            <div className="relative my-6 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-indigo-300/20"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-transparent text-indigo-300">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {['Google', 'Apple', 'Facebook'].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  className="flex items-center justify-center py-2 sm:py-2.5 px-2 sm:px-4 bg-white/5 hover:bg-white/10 border border-indigo-300/20 rounded-xl text-indigo-200 hover:text-white transition-all text-xs sm:text-sm"
                >
                  {provider}
                </button>
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                type="button"
                className="text-indigo-300 hover:text-white text-xs sm:text-sm transition-colors"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;