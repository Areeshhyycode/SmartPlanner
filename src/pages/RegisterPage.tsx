import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Plane, Loader2, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/common/Alert';
import { parseErrorMessage } from '../utils/errorHandler';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const { register, isLoading, isAuthenticated } = useAuth();

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please make sure both passwords are the same.');
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(parseErrorMessage(err));
    }
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains a number', met: /\d/.test(formData.password) },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
              <Plane className="w-7 h-7 text-white transform -rotate-45" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
          <p className="text-text-secondary">Start planning your perfect trips today</p>
        </div>

        {/* Register Form */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError('')}
              />
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 bg-dark-elevated border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 space-y-1.5">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          req.met ? 'bg-green-500' : 'bg-dark-elevated border border-dark-border'
                        }`}
                      >
                        {req.met && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={req.met ? 'text-green-400' : 'text-text-muted'}>{req.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full pl-12 pr-12 py-3.5 bg-dark-elevated border rounded-xl text-text-primary placeholder-text-muted focus:ring-2 outline-none transition-all duration-300 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-danger focus:border-danger focus:ring-danger/20'
                      : 'border-dark-border focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-2 text-sm text-danger">Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                    agreedToTerms
                      ? 'bg-blue-500 border-white'
                      : 'bg-dark-elevated border-white group-hover:border-blue-500/50'
                  }`}
                >
                  {agreedToTerms && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
              <span className="ml-3 text-sm text-text-secondary">
                I agree to the{' '}
                <a href="#" className="text-blue-400 hover:text-cyan-400 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-cyan-400 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

