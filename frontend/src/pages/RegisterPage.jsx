import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Eye, EyeOff, ArrowRight, Moon, Sun } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUiStore } from '../store/uiStore';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, loading, error } = useAuth();
  const { isDarkMode, toggleDarkMode } = useUiStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const success = await register({ username, email, password, confirmPassword });
    if (success) {
      navigate('/');
    }
  };

  const displayError = localError || error;

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

      <div className="w-full max-w-[440px] animate-scale-in">
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
            <p className="text-[#2aabee] text-xs font-bold tracking-[3px] uppercase mb-3">Get Started</p>
            <h1 className="text-[26px] font-bold theme-text-primary leading-tight">Create your account</h1>
            <p className="theme-text-muted text-sm mt-2">Join Messenger and start connecting today</p>
          </div>

          {/* Error message */}
          {displayError && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium animate-fade-in flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {displayError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-semibold theme-text-secondary mb-2">Email</label>
              <div className="auth-input-group">
                <Mail className="auth-input-icon" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="Enter your email"
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

            <div>
              <label className="block text-sm font-semibold theme-text-secondary mb-2">Confirm password</label>
              <div className="auth-input-group">
                <Lock className="auth-input-icon" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                    Sign up <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center mt-7 theme-text-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2aabee] hover:underline font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
