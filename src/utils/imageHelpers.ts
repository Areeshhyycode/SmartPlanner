// Helper to get flag emoji from country code
export const getFlagEmoji = (code: string): string => {
  const codePoints = code
    .toUpperCase()
    .slice(0, 2)
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Helper to format image URL (adds Unsplash parameters if needed)
export const formatImageUrl = (url?: string, width = 800): string => {
  if (!url) return `https://images.unsplash.com/photo-1488085061387-422e29b40080?w=${width}&q=80`;

  // If it's an Unsplash URL without parameters, add them
  if (url.includes('unsplash.com') && !url.includes('?')) {
    return `${url}?w=${width}&q=80&fit=crop`;
  }

  return url;
};

// Fallback image URL
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80';
