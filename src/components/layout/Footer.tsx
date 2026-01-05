import { Link } from 'react-router-dom';
import { Plane, Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-card border-t border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Plane className="w-5 h-5 text-white transform -rotate-45" />
              </div>
              <span className="text-xl font-bold text-text-primary">
                Trip<span className="text-cyan-400">Planner</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Plan your perfect trip with weather intelligence. Make informed travel decisions with real-time forecasts and smart recommendations.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <a
                href="#"
                className="w-9 h-9 bg-dark-elevated hover:bg-blue-500/20 border border-dark-border hover:border-blue-500/50 rounded-lg flex items-center justify-center text-text-muted hover:text-blue-400 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-dark-elevated hover:bg-blue-500/20 border border-dark-border hover:border-blue-500/50 rounded-lg flex items-center justify-center text-text-muted hover:text-blue-400 transition-all duration-300"
                aria-label="Github"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-dark-elevated hover:bg-blue-500/20 border border-dark-border hover:border-blue-500/50 rounded-lg flex items-center justify-center text-text-muted hover:text-blue-400 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { to: '/search', label: 'Search Weather' },
                { to: '/compare', label: 'Compare Cities' },
                { to: '/trips', label: 'My Trips' },
                { to: '/favorites', label: 'Favorites' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-text-secondary hover:text-cyan-400 text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {[
                { href: '#', label: 'Help Center' },
                { href: '#', label: 'Privacy Policy' },
                { href: '#', label: 'Terms of Service' },
                { href: '#', label: 'FAQ' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-secondary hover:text-cyan-400 text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>hello@tripplanner.com</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3 text-text-secondary text-sm">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <span>123 Travel Street<br />San Francisco, CA 94102</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {currentYear} TripPlanner. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-text-muted hover:text-text-secondary text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-text-muted hover:text-text-secondary text-sm transition-colors">
              Terms
            </a>
            <a href="#" className="text-text-muted hover:text-text-secondary text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

