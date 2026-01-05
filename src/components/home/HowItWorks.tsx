import { Search, BarChart3, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  features: string[];
}

const steps: Step[] = [
  {
    step: '01',
    title: 'Search Your Destination',
    description: 'Enter your destination city and travel dates to discover the perfect weather conditions.',
    icon: Search,
    color: 'from-blue-500 to-blue-600',
    features: ['Smart city search', 'Flexible dates', 'Multiple destinations'],
  },
  {
    step: '02',
    title: 'Compare Weather',
    description: 'View detailed forecasts and compare conditions across multiple cities side by side.',
    icon: BarChart3,
    color: 'from-cyan-500 to-cyan-600',
    features: ['7-day forecasts', 'Historical data', 'Best day scoring'],
  },
  {
    step: '03',
    title: 'Plan & Pack Smart',
    description: 'Get personalized recommendations and create your perfect travel itinerary.',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600',
    features: ['Packing lists', 'Weather alerts', 'Trip itinerary'],
  },
];

function HowItWorks() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-card/50 to-dark-bg"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-6 shadow-lg shadow-purple-500/5">
            <ArrowRight className="w-4 h-4" />
            <span className="tracking-wide">Simple Process</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 tracking-tight">
            Plan Your Trip in{' '}
            <span className="gradient-text">3 Easy Steps</span>
          </h2>
          <p className="text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto font-light">
            From destination search to packed bags — we make travel planning effortless
          </p>
        </div>

        {/* Steps - Vertical Timeline on Mobile, Horizontal on Desktop */}
        <div className="relative">
          {/* Connector Line - Desktop */}
          <div className="hidden lg:block absolute top-[100px] left-[16.66%] right-[16.66%] h-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-full"></div>
          <div className="hidden lg:block absolute top-[100px] left-[16.66%] w-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full animate-line-grow"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((item, index) => (
              <div
                key={index}
                className="group relative"
              >
                {/* Card */}
                <div className="relative p-8 lg:p-10 bg-dark-card/80 backdrop-blur-sm border border-dark-border/50 rounded-3xl hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10">
                  {/* Step Number Badge */}
                  <div className={`absolute -top-5 left-8 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-xl font-bold text-white">{item.step}</span>
                  </div>

                  {/* Glow effect */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${item.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                  <div className="relative pt-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6 border border-white/5`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-text-primary mb-4 group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      {item.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-3">
                      {item.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-3 text-text-muted text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Vertical Connector - Mobile */}
                {index < 2 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <div className="w-px h-12 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;