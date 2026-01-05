import { Link } from 'react-router-dom';
import {
  Calendar,
  ArrowRight,
  Globe,
  CheckCircle2,
  Users,
  Plane,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Stat {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

const stats: Stat[] = [
  { value: '10K+', label: 'Active Users', icon: Users, color: 'from-blue-500 to-blue-600' },
  { value: '50K+', label: 'Trips Planned', icon: Plane, color: 'from-cyan-500 to-cyan-600' },
  { value: '100+', label: 'Countries', icon: Globe, color: 'from-purple-500 to-purple-600' },
  { value: '99%', label: 'Accuracy', icon: CheckCircle2, color: 'from-green-500 to-green-600' },
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-40">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>

      {/* Floating orbs with staggered animations */}
      <div className="absolute top-20 left-[15%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-20 right-[15%] w-[350px] h-[350px] bg-cyan-500/20 rounded-full blur-[100px] animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-dark-bg/50 to-dark-bg"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">

          {/* Heading with enhanced typography */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-text-primary mb-8 leading-[1.05] tracking-tight">
            Plan Your Perfect
            <br />
            <span className="relative inline-block mt-2">
              <span className="gradient-text">Trip with Wanderlust</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 4 100 4 150 7C200 10 250 6 298 3" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                    <stop stopColor="#3B82F6"/>
                    <stop offset="1" stopColor="#06B6D4"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl lg:text-2xl text-text-secondary mb-14 max-w-3xl mx-auto leading-relaxed font-light">
            Discover breathtaking destinations, explore hidden gems, and create
            unforgettable travel memories with our intelligent trip planner.
          </p>

          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              to="/explore"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white active:text-white focus:text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/30 transition-all duration-500 transform hover:-translate-y-1.5 hover:shadow-blue-500/50 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 min-w-[240px] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Globe className="w-5 h-5 relative z-10 text-white" />
              <span className="relative z-10 text-white">Explore Destinations</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 text-white transition-transform duration-300" />
            </Link>
            <Link
              to="/trips"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-dark-card/90 hover:bg-dark-elevated border-2 border-dark-border/80 hover:border-cyan-500/50 text-text-primary font-semibold rounded-2xl transition-all duration-300 backdrop-blur-md min-w-[240px] hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <Calendar className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>My Trips</span>
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </div>

          {/* Stats with enhanced cards */}
          <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative p-6 lg:p-8 bg-dark-card/60 backdrop-blur-md border border-dark-border/50 rounded-3xl hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Animated gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`}></div>

                {/* Glow effect */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2 tracking-tight">{stat.value}</div>
                  <div className="text-text-muted text-sm font-medium tracking-wide uppercase">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;