import { type ApiCountry } from '../../api';
import { formatImageUrl, getFlagEmoji, FALLBACK_IMAGE } from '../../utils/imageHelpers';

interface CountryHeaderProps {
  country: ApiCountry;
}

function CountryHeader({ country }: CountryHeaderProps) {
  const flag = getFlagEmoji(country.code || 'UN');

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden mb-8">
      <div className="relative h-48 md:h-64">
        <img
          src={formatImageUrl(country.imageUrl, 1200)}
          alt={country.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/50 to-transparent"></div>

        {/* Country Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{flag}</span>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">{country.name}</h1>
              <p className="text-text-secondary">{country.description || 'Explore this amazing country'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryHeader;
