import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Mountain, Star, Users } from 'lucide-react';

interface Destination {
  id: number;
  title: string;
  location: string;
  country: string;
  image: string;
  tag: string;
  tagColor: string;
  rating: number;
  travelers: string;
  description: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    title: 'Dubai Adventures',
    location: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    tag: 'Featured',
    tagColor: 'from-blue-500 to-blue-600',
    rating: 4.9,
    travelers: '2.5K',
    description: 'Experience luxury, desert safaris, and iconic landmarks in the city of dreams',
  },
  {
    id: 2,
    title: 'Hunza Valley',
    location: 'Gilgit-Baltistan',
    country: 'Pakistan',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    tag: 'Nature',
    tagColor: 'from-green-500 to-green-600',
    rating: 4.8,
    travelers: '1.2K',
    description: 'Mountain paradise with stunning views and rich culture',
  },
  {
    id: 3,
    title: 'Phuket Paradise',
    location: 'Phuket',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
    tag: 'Beach',
    tagColor: 'from-cyan-500 to-cyan-600',
    rating: 4.7,
    travelers: '3.1K',
    description: 'Crystal clear waters and tropical beaches await',
  },
];

function ExploreAdventures() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent"></div>
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-6 shadow-lg shadow-orange-500/5">
              <Mountain className="w-4 h-4" />
              <span className="tracking-wide">Popular Destinations</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-4 tracking-tight">
              Explore Our <span className="gradient-text">Adventures</span>
            </h2>
            <p className="text-lg lg:text-xl text-text-secondary max-w-xl font-light">
              Discover breathtaking destinations and plan your next unforgettable journey
            </p>
          </div>
          <Link
            to="/explore"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-dark-card hover:bg-dark-elevated border border-dark-border hover:border-blue-500/50 text-text-primary font-medium rounded-xl transition-all duration-300 self-start md:self-auto"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Large Card */}
          <div className="group relative h-[450px] lg:h-[540px] rounded-3xl overflow-hidden cursor-pointer">
            <img
              src={destinations[0].image}
              alt={destinations[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 bg-gradient-to-r ${destinations[0].tagColor} rounded-full text-white text-xs font-semibold shadow-lg`}>
                  {destinations[0].tag}
                </span>
                <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-medium">
                  {destinations[0].country}
                </span>
              </div>

              <div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3 group-hover:translate-x-2 transition-transform duration-300">
                  {destinations[0].title}
                </h3>
                <p className="text-white/70 mb-5 max-w-md text-sm lg:text-base">
                  {destinations[0].description}
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-white/80 text-sm">{destinations[0].location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white/80 text-sm">{destinations[0].rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="text-white/80 text-sm">{destinations[0].travelers} travelers</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Stacked Cards */}
          <div className="flex flex-col gap-6">
            {destinations.slice(1).map((destination) => (
              <div
                key={destination.id}
                className="group relative h-[210px] lg:h-[255px] rounded-3xl overflow-hidden cursor-pointer"
              >
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 bg-gradient-to-r ${destination.tagColor} rounded-full text-white text-xs font-semibold shadow-lg`}>
                      {destination.tag}
                    </span>
                    <span className="text-white/60 text-xs">{destination.country}</span>
                  </div>

                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-1 group-hover:translate-x-2 transition-transform duration-300">
                      {destination.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-3">{destination.description}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white/80 text-xs">{destination.rating}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-white/80 text-xs">{destination.travelers}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExploreAdventures;