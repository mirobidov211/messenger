import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Moon, Sun } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUiStore } from '../store/uiStore';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const { isDarkMode, toggleDarkMode } = useUiStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ username, password });
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4 relative transition-colors duration-300">
      {/* Tepa o'ng burchakdagi Tungi / Kunduzgi rejim tugmasi */}
      <button
        onClick={() => toggleDarkMode()}
        className="absolute top-6 right-6 z-20 p-3 rounded-2xl theme-surface border border-gray-200 dark:border-white/10 theme-text-primary hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 text-xs font-semibold cursor-pointer"
        title={isDarkMode ? "Kunduzgi rejim (Oq)" : "Tungi rejim (Qora)"}
      >
        {isDarkMode ? (
          <>
            <Sun size={18} className="text-amber-400" />
            <span>Oq rejim</span>
          </>
        ) : (
          <>
            <Moon size={18} className="text-gray-700" />
            <span>Qora rejim</span>
          </>
        )}
      </button>

      {/* Floating circles */}
      <div className="auth-circle auth-circle-1"></div>
      <div className="auth-circle auth-circle-2"></div>
      <div className="auth-circle auth-circle-3"></div>
      <div className="auth-circle auth-circle-4"></div>

      <div className="w-full max-w-[420px] animate-scale-in">
        <div className="auth-card px-8 py-10 sm:px-10 sm:py-12">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-[68px] h-[68px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-[20px] mb-5 shadow-lg shadow-blue-500/25 relative">
              <span className="text-white font-bold text-2xl">A</span>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2aabee] rounded-full border-[3px] border-white dark:border-[#17212b] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>
            <p className="text-[#2aabee] text-xs font-bold tracking-[3px] uppercase mb-3">Welcome Back</p>
            <h1 className="text-[26px] font-bold theme-text-primary leading-tight">Sign in to your account</h1>
            <p className="theme-text-muted text-sm mt-2">Enter your details to continue to Messenger</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium animate-fade-in flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold theme-text-secondary mb-2">Username</label>
              <div className="auth-input-group">
                <User className="auth-input-icon" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="auth-input"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold theme-text-secondary mb-2">Password</label>
              <div className="auth-input-group">
                <Lock className="auth-input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="auth-btn"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign in <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-7 theme-text-muted text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#2aabee] hover:underline font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
