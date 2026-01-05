import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Palmtree,
  LogIn,
  LogOut,
  ChevronDown,
  Compass,
  Map,
  Sparkles,
  Settings,
  Crown,
  Plane,
  CloudSun,
  UserCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../common/ConfirmDialog';
import NotificationBell from '../common/NotificationBell';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isUserMenuOpen && !(e.target as Element).closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsUserMenuOpen(false);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate('/');
  };

  // Navigation links with icons
  const publicLinks = [
    { path: '/', label: 'Home', icon: Sparkles },
    { path: '/explore', label: 'Explore', icon: Compass },
    { path: '/weather', label: 'Weather', icon: CloudSun },
  ];

  const protectedLinks = [
    { path: '/trips', label: 'My Trips', icon: Map },
  ];

  const navLinks = isAuthenticated ? [...publicLinks, ...protectedLinks] : publicLinks;

  const isActiveLink = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-dark-bg/95 backdrop-blur-xl border-b border-dark-border shadow-lg shadow-black/10'
            : 'bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-105">
                  <Palmtree className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg sm:rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity -z-10" />
              </div>
              <div className="hidden xs:block sm:block">
                <span className="text-lg sm:text-xl font-bold text-text-primary">
                  Wander<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">lust</span>
                </span>
                <div className="text-[9px] sm:text-[10px] text-text-muted -mt-1 tracking-wider uppercase">Explore the world</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              <div className="flex items-center text-center bg-dark-elevated/50 backdrop-blur-sm rounded-2xl p-1.5 border border-dark-border/50">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isActiveLink(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                        isActive
                          ? 'text-white'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl shadow-lg shadow-emerald-500/30" />
                      )}
                      <span className={`relative flex items-center gap-2 ${isActive ? 'text-white' : ''}`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                        <span className={isActive ? 'text-white' : ''}>{link.label}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
              {/* Notification Bell - Only for authenticated users */}
              {isAuthenticated && <NotificationBell />}

              {/* User Menu - Now visible on all screen sizes */}
              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                      isUserMenuOpen
                        ? 'bg-dark-elevated ring-2 ring-emerald-500/50'
                        : 'hover:bg-dark-elevated'
                    }`}
                  >
                    <div className="relative">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl object-cover border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/20"
                        />
                      ) : (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 bg-emerald-500 rounded-full border-2 border-dark-bg" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-text-primary leading-tight">{user?.username}</p>
                      <p className="text-[10px] text-text-muted flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" />
                        {user?.role || 'Member'}
                      </p>
                    </div>
                    <ChevronDown className={`hidden sm:block w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-muted transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu - Responsive for all screens */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 max-w-[280px] bg-dark-card/95 backdrop-blur-xl border border-dark-border rounded-xl sm:rounded-2xl shadow-2xl shadow-black/30 py-1.5 sm:py-2 overflow-hidden animate-dropdown z-50">
                      {/* User Info Header */}
                      <div className="px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-b border-dark-border">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          {user?.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.username}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover border-2 border-emerald-500/30 shadow-lg"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg">
                              {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-text-primary text-sm sm:text-base truncate">{user?.username}</p>
                            <p className="text-[10px] sm:text-xs text-text-muted truncate">{user?.email}</p>
                          </div>
                        </div>
                        <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 rounded-md sm:rounded-lg font-medium border border-emerald-500/30">
                            {user?.role}
                          </span>
                          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-emerald-500/20 text-emerald-400 rounded-md sm:rounded-lg font-medium border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Online
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1.5 sm:py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-text-secondary hover:text-text-primary hover:bg-dark-elevated/80 transition-all group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-violet-500/10 rounded-lg flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                            <UserCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-400" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium">My Profile</p>
                            <p className="text-[10px] sm:text-xs text-text-muted">Manage your account</p>
                          </div>
                        </Link>
                        <Link
                          to="/trips"
                          className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-text-secondary hover:text-text-primary hover:bg-dark-elevated/80 transition-all group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                            <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium">My Trips</p>
                            <p className="text-[10px] sm:text-xs text-text-muted">View your bookings</p>
                          </div>
                        </Link>
                        <Link
                          to="/explore"
                          className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-text-secondary hover:text-text-primary hover:bg-dark-elevated/80 transition-all group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium">Explore</p>
                            <p className="text-[10px] sm:text-xs text-text-muted">Discover destinations</p>
                          </div>
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-text-secondary hover:text-text-primary hover:bg-dark-elevated/80 transition-all group"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-500/10 rounded-lg flex items-center justify-center group-hover:bg-slate-500/20 transition-colors">
                            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium">Settings</p>
                            <p className="text-[10px] sm:text-xs text-text-muted">Preferences</p>
                          </div>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="pt-1.5 sm:pt-2 mt-1.5 sm:mt-2 border-t border-dark-border">
                        <button
                          onClick={handleLogoutClick}
                          className="w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-red-400 hover:bg-red-500/10 transition-all group"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-medium">Logout</p>
                            <p className="text-[10px] sm:text-xs text-red-400/70">Sign out of your account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop Login/Register buttons */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <Link
                      to="/login"
                      className="px-3 sm:px-4 py-2 sm:py-2.5 text-text-secondary hover:text-text-primary font-medium transition-all hover:bg-dark-elevated rounded-xl flex items-center gap-2 text-sm"
                    >
                      <User className="w-4 h-4" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="group relative px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 flex items-center gap-2 overflow-hidden text-sm"
                    >
                      <span className="relative z-10 flex items-center gap-2 text-white">
                        <LogIn className="w-4 h-4 text-white" />
                        <span className="text-white">Get Started</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </div>
                  {/* Mobile Login button - compact */}
                  <Link
                    to="/login"
                    className="sm:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-medium text-xs shadow-lg shadow-emerald-500/30"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">Login</span>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button - Always visible on mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 ${
                  isMenuOpen
                    ? 'bg-dark-elevated text-text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-dark-elevated'
                }`}
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                  <span className={`absolute left-0 w-5 sm:w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? 'top-2.5 sm:top-3 rotate-45' : 'top-0.5 sm:top-1'
                  }`} />
                  <span className={`absolute left-0 top-2.5 sm:top-3 w-5 sm:w-6 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`} />
                  <span className={`absolute left-0 w-5 sm:w-6 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? 'top-2.5 sm:top-3 -rotate-45' : 'top-[18px] sm:top-5'
                  }`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-3 sm:py-4 border-t border-dark-border">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = isActiveLink(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20'
                          : 'text-text-secondary hover:text-text-primary hover:bg-dark-elevated'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                      <span className={isActive ? 'text-white' : ''}>{link.label}</span>
                    </Link>
                  );
                })}

                {isAuthenticated ? (
                  <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-dark-border space-y-2 sm:space-y-3">
                    <Link
                      to="/profile"
                      className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg sm:rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover border-2 border-emerald-500/30 shadow-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-text-primary truncate">{user?.username}</p>
                        <p className="text-xs text-text-muted truncate">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-400">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          Online
                        </span>
                      </div>
                      <UserCircle className="w-5 h-5 text-text-muted" />
                    </Link>
                    <button
                      onClick={() => {
                        handleLogoutClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg sm:rounded-xl font-medium transition-all border border-red-500/20"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-dark-border space-y-2 sm:space-y-3">
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 text-text-secondary hover:text-text-primary bg-dark-elevated hover:bg-dark-card rounded-lg sm:rounded-xl transition-all font-medium border border-dark-border"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white rounded-lg sm:rounded-xl font-semibold shadow-lg shadow-emerald-500/30 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5 text-white"  />
                      <span className="text-white">Get Started Free</span>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Styles */}
      <style>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
      `}</style>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout Confirmation"
        message={`Are you sure you want to logout, ${user?.username}? You will need to login again to access your trips and account.`}
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
}

export default Header;

