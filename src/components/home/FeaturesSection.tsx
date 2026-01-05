import {
  MapPin,
  Calendar,
  Compass,
  Heart,
  Camera,
  Wallet,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Compass,
    title: 'Discover Destinations',
    description: 'Explore curated destinations worldwide with detailed guides, local tips, and hidden gems waiting to be discovered.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Calendar,
    title: 'Smart Planning',
    description: 'Create detailed itineraries with our intelligent planner that optimizes your travel schedule and activities.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: MapPin,
    title: 'Local Experiences',
    description: 'Find authentic local experiences, restaurants, and attractions recommended by travelers and locals.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Heart,
    title: 'Save Favorites',
    description: 'Bookmark your favorite destinations, create wishlists, and plan future adventures with ease.',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Camera,
    title: 'Photo Spots',
    description: 'Discover the most Instagram-worthy locations and best times to capture stunning travel photos.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Wallet,
    title: 'Budget Tracking',
    description: 'Keep track of your travel expenses and get smart suggestions to maximize your travel budget.',
    color: 'from-green-500 to-green-600',
  },
];

function FeaturesSection() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-card/30 to-transparent"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6 shadow-lg shadow-cyan-500/5">
            <Zap className="w-4 h-4" />
            <span className="tracking-wide">Powerful Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 tracking-tight">
            Why Choose <span className="gradient-text">Wanderlust?</span>
          </h2>
          <p className="text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto font-light">
            Everything you need to plan the perfect trip, all in one place
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 lg:p-10 bg-dark-card/70 hover:bg-dark-elevated/90 backdrop-blur-sm border border-dark-border/50 hover:border-blue-500/40 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 overflow-hidden"
            >
              {/* Gradient glow effect */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

              {/* Card inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

              <div className="relative">
                {/* Icon Container */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold text-text-primary mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm lg:text-base leading-relaxed">
                  {feature.description}
                </p>

                {/* Learn more link */}
                <div className="mt-6 flex items-center gap-2 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span>Learn more</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;