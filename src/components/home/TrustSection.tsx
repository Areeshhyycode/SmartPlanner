import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Travel Blogger',
    text: 'Wanderlust transformed how I plan my trips. The destination guides are incredibly detailed and helped me discover hidden gems!',
    rating: 5,
    avatar: 'S',
  },
  {
    name: 'Mike Chen',
    role: 'Adventure Traveler',
    text: 'The best trip planning tool I have used. Simple interface, amazing recommendations, and saved me hours of planning.',
    rating: 5,
    avatar: 'M',
  },
  {
    name: 'Emma Williams',
    role: 'Digital Nomad',
    text: 'Having all my trips organized in one place is a game changer. Absolutely love the budget tracking feature!',
    rating: 5,
    avatar: 'E',
  },
];

function TrustSection() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-card/20 to-dark-bg"></div>
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[150px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-dark-card/90 to-dark-elevated/90 backdrop-blur-xl border border-dark-border/50 rounded-[2.5rem] p-8 lg:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-[100px]"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium mb-8 shadow-lg shadow-green-500/5">
                <Shield className="w-4 h-4" />
                <span className="tracking-wide">Trusted by Travelers</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 tracking-tight leading-tight">
                Join Thousands of
                <br />
                <span className="gradient-text">Happy Travelers</span>
              </h2>
              <p className="text-lg lg:text-xl text-text-secondary mb-10 leading-relaxed font-light">
                Our platform has helped thousands of travelers discover amazing destinations
                and create unforgettable memories.
              </p>

              <div className="flex flex-wrap gap-8 mb-10">
                <div>
                  <div className="text-3xl lg:text-4xl font-bold gradient-text">10K+</div>
                  <div className="text-text-muted text-sm">Happy Travelers</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold gradient-text">50+</div>
                  <div className="text-text-muted text-sm">Countries</div>
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold gradient-text">4.9</div>
                  <div className="text-text-muted text-sm">Rating</div>
                </div>
              </div>

              <Link
                to="/register"
                className="text-white group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500  font-semibold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="text-white w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-5">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-dark-bg/60 backdrop-blur-sm border border-dark-border/50 rounded-2xl hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-500/10 group-hover:text-blue-500/20 transition-colors" />

                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <p className="text-text-secondary mb-5 leading-relaxed text-sm lg:text-base">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-text-primary font-semibold">{testimonial.name}</div>
                      <div className="text-text-muted text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;