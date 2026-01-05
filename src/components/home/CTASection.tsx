import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Globe, Plane } from 'lucide-react';

function CTASection() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-blue-950/20 to-dark-bg"></div>

      {/* Animated orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse-slow"></div>
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[80px] animate-float-delayed"></div>

      {/* Floating icons */}
      <div className="absolute top-1/4 left-[15%] hidden lg:block">
        <div className="w-16 h-16 bg-dark-card/50 backdrop-blur-sm border border-dark-border/30 rounded-2xl flex items-center justify-center animate-float">
          <Globe className="w-8 h-8 text-blue-400/60" />
        </div>
      </div>
      <div className="absolute bottom-1/3 right-[15%] hidden lg:block">
        <div className="w-14 h-14 bg-dark-card/50 backdrop-blur-sm border border-dark-border/30 rounded-2xl flex items-center justify-center animate-float-delayed">
          <Plane className="w-7 h-7 text-cyan-400/60" />
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8 shadow-lg shadow-blue-500/5">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="tracking-wide">Start Your Journey Today</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-text-primary mb-8 tracking-tight leading-tight">
          Ready to Plan Your Next
          <br />
          <span className="gradient-text">Adventure?</span>
        </h2>

        {/* Subtext */}
        <p className="text-lg lg:text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Join thousands of travelers who trust Wanderlust for their travel adventures.
          Start planning your perfect trip today — it's free!
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            to="/explore"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 active:bg-[#1a9eff] focus:bg-[#1a9eff] text-white active:text-white focus:text-white active:text-white focus:text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/30 transition-all duration-500 transform hover:-translate-y-1.5 hover:shadow-blue-500/50 active:shadow-[#1a9eff]/40 focus:shadow-[#1a9eff]/40 min-w-[220px] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 text-white">Explore Destinations</span>
            <ArrowRight className="w-5 h-5 text-white relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Free to use</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;