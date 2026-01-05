// Travel Assistant Data - Locations, Safety Rules, and Packing Lists

import type { Season } from '../services/weatherService';

export interface LocationData {
  lat: number;
  lon: number;
  activities: string[];
  timezone: string;
}

export interface CountryLocations {
  [city: string]: LocationData;
}

export interface LocationsMap {
  [country: string]: CountryLocations;
}

// Activity/Landmark specific coordinates
export interface ActivityLocation {
  lat: number;
  lon: number;
  neighborhood?: string;
}

export const activityLocations: Record<string, ActivityLocation> = {
  // Buenos Aires, Argentina
  "La Boca": { lat: -34.6345, lon: -58.3631, neighborhood: "La Boca" },
  "Teatro Colón": { lat: -34.6011, lon: -58.3833, neighborhood: "San Nicolás" },
  "Recoleta Cemetery": { lat: -34.5875, lon: -58.3934, neighborhood: "Recoleta" },
  "San Telmo": { lat: -34.6214, lon: -58.3731, neighborhood: "San Telmo" },
  "Puerto Madero": { lat: -34.6117, lon: -58.3628, neighborhood: "Puerto Madero" },

  // Paris, France
  "Eiffel Tower": { lat: 48.8584, lon: 2.2945, neighborhood: "7th arrondissement" },
  "Louvre Museum": { lat: 48.8606, lon: 2.3376, neighborhood: "1st arrondissement" },
  "Notre-Dame": { lat: 48.8530, lon: 2.3499, neighborhood: "Île de la Cité" },
  "Montmartre": { lat: 48.8867, lon: 2.3431, neighborhood: "18th arrondissement" },
  "Champs-Élysées": { lat: 48.8698, lon: 2.3075, neighborhood: "8th arrondissement" },

  // Tokyo, Japan
  "Shibuya Crossing": { lat: 35.6595, lon: 139.7004, neighborhood: "Shibuya" },
  "Senso-ji Temple": { lat: 35.7148, lon: 139.7967, neighborhood: "Asakusa" },
  "Tokyo Tower": { lat: 35.6586, lon: 139.7454, neighborhood: "Minato" },
  "Meiji Shrine": { lat: 35.6764, lon: 139.6993, neighborhood: "Shibuya" },
  "Tsukiji Market": { lat: 35.6654, lon: 139.7707, neighborhood: "Chuo" },

  // Dubai, UAE
  "Burj Khalifa": { lat: 25.1972, lon: 55.2744, neighborhood: "Downtown Dubai" },
  "Dubai Mall": { lat: 25.1985, lon: 55.2796, neighborhood: "Downtown Dubai" },
  "Palm Jumeirah": { lat: 25.1124, lon: 55.1390, neighborhood: "Palm Jumeirah" },
  "Dubai Marina": { lat: 25.0805, lon: 55.1403, neighborhood: "Dubai Marina" },
  "Desert Safari": { lat: 25.0000, lon: 55.4000, neighborhood: "Dubai Desert" },

  // Istanbul, Turkey
  "Hagia Sophia": { lat: 41.0086, lon: 28.9802, neighborhood: "Sultanahmet" },
  "Blue Mosque": { lat: 41.0054, lon: 28.9768, neighborhood: "Sultanahmet" },
  "Grand Bazaar": { lat: 41.0107, lon: 28.9680, neighborhood: "Fatih" },
  "Topkapi Palace": { lat: 41.0115, lon: 28.9833, neighborhood: "Sultanahmet" },
  "Bosphorus": { lat: 41.0822, lon: 29.0060, neighborhood: "Bosphorus" },

  // Pakistan
  "Badshahi Mosque": { lat: 31.5883, lon: 74.3105, neighborhood: "Walled City" },
  "Lahore Fort": { lat: 31.5880, lon: 74.3159, neighborhood: "Walled City" },
  "Clifton Beach": { lat: 24.7936, lon: 67.0280, neighborhood: "Clifton" },
  "Mall Road Murree": { lat: 33.9070, lon: 73.3943, neighborhood: "Murree" },
  "Hunza Valley": { lat: 36.3167, lon: 74.6500, neighborhood: "Hunza" },

  // Kyoto, Japan
  "Fushimi Inari": { lat: 34.9671, lon: 135.7727, neighborhood: "Fushimi" },
  "Kinkaku-ji": { lat: 35.0394, lon: 135.7292, neighborhood: "Kita" },
  "Arashiyama": { lat: 35.0094, lon: 135.6737, neighborhood: "Arashiyama" },
  "Gion District": { lat: 35.0037, lon: 135.7756, neighborhood: "Gion" },

  // Nice, France
  "Promenade des Anglais": { lat: 43.6947, lon: 7.2653, neighborhood: "Nice Beach" },
  "Old Town Nice": { lat: 43.6976, lon: 7.2756, neighborhood: "Vieux Nice" },

  // Mendoza, Argentina
  "Wine Tours": { lat: -33.0000, lon: -68.8500, neighborhood: "Mendoza Wine Region" },
  "Aconcagua": { lat: -32.6532, lon: -70.0109, neighborhood: "Aconcagua Park" },
};

// Find activity coordinates by name (fuzzy match)
export function findActivityLocation(activityName: string): ActivityLocation | null {
  const normalizedName = activityName.toLowerCase().trim();

  // Exact match first
  for (const [name, location] of Object.entries(activityLocations)) {
    if (name.toLowerCase() === normalizedName) {
      return location;
    }
  }

  // Partial match
  for (const [name, location] of Object.entries(activityLocations)) {
    if (normalizedName.includes(name.toLowerCase()) || name.toLowerCase().includes(normalizedName)) {
      return location;
    }
  }

  return null;
}

// Location coordinates for weather API
export const locations: LocationsMap = {
  Pakistan: {
    Karachi: {
      lat: 24.8607,
      lon: 67.0011,
      activities: ["Seaside", "City"],
      timezone: "Asia/Karachi"
    },
    Lahore: {
      lat: 31.5497,
      lon: 74.3436,
      activities: ["Historical", "City"],
      timezone: "Asia/Karachi"
    },
    Murree: {
      lat: 33.9072,
      lon: 73.3931,
      activities: ["Hill Station", "Mountains"],
      timezone: "Asia/Karachi"
    },
    Hunza: {
      lat: 36.3167,
      lon: 74.65,
      activities: ["Mountains", "Adventure"],
      timezone: "Asia/Karachi"
    }
  },
  UAE: {
    Dubai: {
      lat: 25.2048,
      lon: 55.2708,
      activities: ["City", "Desert", "Seaside"],
      timezone: "Asia/Dubai"
    },
    "Abu Dhabi": {
      lat: 24.4539,
      lon: 54.3773,
      activities: ["City", "Desert"],
      timezone: "Asia/Dubai"
    }
  },
  Turkey: {
    Istanbul: {
      lat: 41.0082,
      lon: 28.9784,
      activities: ["Historical", "City"],
      timezone: "Europe/Istanbul"
    },
    Antalya: {
      lat: 36.8969,
      lon: 30.7133,
      activities: ["Seaside", "City"],
      timezone: "Europe/Istanbul"
    }
  },
  Argentina: {
    "Buenos Aires": {
      lat: -34.6037,
      lon: -58.3816,
      activities: ["City", "Cultural"],
      timezone: "America/Argentina/Buenos_Aires"
    },
    Mendoza: {
      lat: -32.8895,
      lon: -68.8458,
      activities: ["Mountains", "Adventure"],
      timezone: "America/Argentina/Buenos_Aires"
    }
  },
  Japan: {
    Tokyo: {
      lat: 35.6762,
      lon: 139.6503,
      activities: ["City", "Cultural"],
      timezone: "Asia/Tokyo"
    },
    Kyoto: {
      lat: 35.0116,
      lon: 135.7681,
      activities: ["Historical", "Cultural"],
      timezone: "Asia/Tokyo"
    }
  },
  France: {
    Paris: {
      lat: 48.8566,
      lon: 2.3522,
      activities: ["City", "Cultural"],
      timezone: "Europe/Paris"
    },
    Nice: {
      lat: 43.7102,
      lon: 7.262,
      activities: ["Seaside", "City"],
      timezone: "Europe/Paris"
    }
  }
};

// Activity type detection based on activity name
export function detectActivityType(activityName: string): string {
  const name = activityName.toLowerCase();

  if (name.includes("beach") || name.includes("sea") || name.includes("surf") || name.includes("dive") || name.includes("snorkel")) {
    return "Seaside";
  }
  if (name.includes("hike") || name.includes("trek") || name.includes("mountain") || name.includes("climb")) {
    return "Mountains";
  }
  if (name.includes("desert") || name.includes("safari") || name.includes("dune")) {
    return "Desert";
  }
  if (name.includes("museum") || name.includes("temple") || name.includes("palace") || name.includes("historic") || name.includes("tour")) {
    return "Historical";
  }
  if (name.includes("food") || name.includes("wine") || name.includes("culinary") || name.includes("tango") || name.includes("show")) {
    return "Cultural";
  }

  return "City";
}

// Safety rules by activity type and season
export interface SafetyRule {
  tempMin?: number;
  tempMax?: number;
  windMax?: number;
  safe?: boolean;
  warnings: string[];
}

export interface ActivitySafetyRules {
  [season: string]: SafetyRule;
}

export interface SafetyRulesMap {
  [activity: string]: ActivitySafetyRules;
}

export const safetyRules: SafetyRulesMap = {
  Seaside: {
    winter: {
      tempMin: 18,
      windMax: 25,
      warnings: [
        "Water is cooler - may not be ideal for swimming",
        "Evening temperatures drop significantly",
        "Winter currents can be stronger"
      ]
    },
    summer: {
      tempMin: 25,
      windMax: 30,
      warnings: [
        "High UV - use SPF 50+ sunscreen",
        "Stay hydrated - drink plenty of water",
        "Avoid midday sun (12-3 PM)"
      ]
    },
    monsoon: {
      safe: false,
      warnings: [
        "Dangerous - rough seas and flooding risk",
        "Beach activities not recommended",
        "Check local advisories before visiting"
      ]
    }
  },
  Mountains: {
    winter: {
      tempMin: -5,
      warnings: [
        "Sub-zero temperatures expected",
        "Roads may be blocked due to snow",
        "Carry emergency supplies",
        "Check road conditions before traveling"
      ]
    },
    summer: {
      tempMin: 10,
      warnings: [
        "Altitude sickness possible above 3000m",
        "Weather changes quickly - carry rain gear",
        "Start hikes early to avoid afternoon storms"
      ]
    },
    monsoon: {
      safe: false,
      warnings: [
        "Landslide risk during monsoon",
        "Trails may be slippery and dangerous",
        "Check weather forecasts frequently"
      ]
    }
  },
  Desert: {
    winter: {
      tempMin: 10,
      warnings: [
        "Desert nights can be very cold",
        "Temperature swings between day and night",
        "Bring warm layers for evening"
      ]
    },
    summer: {
      tempMax: 45,
      warnings: [
        "Extreme heat - avoid outdoor activities midday",
        "Heat stroke risk is high",
        "Carry at least 3L of water per person",
        "Wear loose, light-colored clothing"
      ]
    },
    monsoon: {
      warnings: [
        "Flash flood risk in wadis/valleys",
        "Sand storms possible",
        "Check local weather alerts"
      ]
    }
  },
  City: {
    winter: {
      warnings: [
        "Comfortable walking weather",
        "Museums and indoor attractions ideal",
        "Pack layers for temperature changes"
      ]
    },
    summer: {
      warnings: [
        "Stay hydrated during sightseeing",
        "Air-conditioned attractions recommended midday",
        "Comfortable walking shoes essential"
      ]
    },
    monsoon: {
      warnings: [
        "Carry umbrella or rain jacket",
        "Some outdoor activities may be affected",
        "Public transport recommended during heavy rain"
      ]
    }
  },
  Historical: {
    winter: {
      warnings: [
        "Good weather for outdoor historical sites",
        "Fewer crowds at major attractions",
        "Some sites may have reduced hours"
      ]
    },
    summer: {
      warnings: [
        "Arrive early to avoid crowds and heat",
        "Wear comfortable shoes for walking",
        "Carry water - many sites have limited facilities"
      ]
    },
    monsoon: {
      warnings: [
        "Check if outdoor sites are accessible",
        "Indoor museums are ideal during rain",
        "Some historical sites may close during heavy rain"
      ]
    }
  },
  Cultural: {
    winter: {
      warnings: [
        "Perfect season for cultural experiences",
        "Evening shows may require warm clothing",
        "Book popular shows in advance"
      ]
    },
    summer: {
      warnings: [
        "Air-conditioned venues provide relief",
        "Outdoor festivals may be very warm",
        "Stay hydrated during events"
      ]
    },
    monsoon: {
      warnings: [
        "Indoor cultural activities recommended",
        "Some outdoor events may be cancelled",
        "Check event schedules for changes"
      ]
    }
  },
  Adventure: {
    winter: {
      warnings: [
        "Cold weather gear essential",
        "Some activities may be weather-dependent",
        "Book with certified operators only"
      ]
    },
    summer: {
      warnings: [
        "Start activities early in the day",
        "Sun protection is crucial",
        "Stay well hydrated"
      ]
    },
    monsoon: {
      safe: false,
      warnings: [
        "Many adventure activities suspended",
        "High risk conditions",
        "Not recommended during monsoon"
      ]
    }
  }
};

// Packing lists by activity type and season
export interface PackingListsMap {
  [activity: string]: {
    [season in Season]: string[];
  };
}

export const packingLists: PackingListsMap = {
  Seaside: {
    winter: [
      "Light jacket",
      "Sunscreen SPF 30+",
      "Swimwear",
      "Flip-flops",
      "Sunglasses",
      "Beach towel",
      "Light scarf for evening"
    ],
    summer: [
      "Swimwear (2-3 sets)",
      "Sunscreen SPF 50+",
      "Wide-brim hat",
      "Flip-flops",
      "Water bottle",
      "Beach towel",
      "Aloe vera gel",
      "Waterproof phone case"
    ],
    monsoon: [
      "Rain jacket",
      "Waterproof bag",
      "Quick-dry clothing",
      "Umbrella",
      "Indoor activity gear"
    ]
  },
  Mountains: {
    winter: [
      "Heavy winter jacket",
      "Thermal innerwear",
      "Warm gloves",
      "Beanie/warm hat",
      "Insulated hiking boots",
      "Hand warmers",
      "UV sunglasses",
      "Lip balm with SPF",
      "First-aid kit"
    ],
    summer: [
      "Light jacket",
      "Hiking boots",
      "Rain jacket",
      "Daypack",
      "Sunscreen SPF 30+",
      "Water bottle (1L+)",
      "First-aid kit",
      "Trekking poles"
    ],
    monsoon: [
      "Waterproof jacket",
      "Rain pants",
      "Waterproof boots",
      "Quick-dry clothing",
      "Emergency supplies"
    ]
  },
  Desert: {
    winter: [
      "Light layers",
      "Warm jacket (for night)",
      "Closed-toe shoes",
      "Sunscreen SPF 30+",
      "Sunglasses",
      "Scarf (sand protection)",
      "Moisturizer"
    ],
    summer: [
      "Loose cotton clothing",
      "Wide-brim hat",
      "SPF 50+ sunscreen",
      "Large water bottles (3L+)",
      "Electrolyte sachets",
      "Cooling towel",
      "Light scarf",
      "Closed-toe breathable shoes"
    ],
    monsoon: [
      "Light rain jacket",
      "Dust mask",
      "Sunglasses",
      "Water bottles",
      "Emergency kit"
    ]
  },
  City: {
    winter: [
      "Warm jacket",
      "Comfortable walking shoes",
      "Scarf",
      "Layered clothing",
      "Umbrella"
    ],
    summer: [
      "Light breathable clothing",
      "Comfortable walking shoes",
      "Sunglasses",
      "Water bottle",
      "Hat or cap"
    ],
    monsoon: [
      "Rain jacket",
      "Waterproof shoes",
      "Umbrella",
      "Quick-dry clothing",
      "Waterproof bag for electronics"
    ]
  },
  Historical: {
    winter: [
      "Comfortable walking shoes",
      "Warm layers",
      "Camera",
      "Daypack",
      "Guidebook or app"
    ],
    summer: [
      "Comfortable walking shoes",
      "Light clothing",
      "Hat for sun",
      "Water bottle",
      "Camera",
      "Sunscreen"
    ],
    monsoon: [
      "Waterproof shoes",
      "Umbrella",
      "Waterproof bag for camera",
      "Light rain jacket"
    ]
  },
  Cultural: {
    winter: [
      "Smart casual clothing",
      "Comfortable shoes",
      "Light jacket",
      "Camera"
    ],
    summer: [
      "Light smart casual clothing",
      "Comfortable shoes",
      "Sunglasses",
      "Water bottle"
    ],
    monsoon: [
      "Umbrella",
      "Light jacket",
      "Comfortable shoes",
      "Waterproof bag"
    ]
  },
  Adventure: {
    winter: [
      "Thermal base layers",
      "Insulated jacket",
      "Sturdy boots",
      "Gloves",
      "Safety gear (activity-specific)",
      "First-aid kit"
    ],
    summer: [
      "Quick-dry clothing",
      "Sturdy shoes/boots",
      "Sun protection",
      "Water bottle (2L+)",
      "Energy snacks",
      "First-aid kit"
    ],
    monsoon: [
      "Waterproof gear",
      "Non-slip footwear",
      "Emergency supplies",
      "First-aid kit"
    ]
  }
};

// Get safety alerts based on weather and activity
export function getSafetyAlerts(
  activityType: string,
  season: Season,
  temperature: number,
  windSpeed: number
): { warnings: string[]; isSafe: boolean } {
  const rules = safetyRules[activityType]?.[season];

  if (!rules) {
    return { warnings: [], isSafe: true };
  }

  const warnings = [...rules.warnings];
  let isSafe = rules.safe !== false;

  // Check temperature limits
  if (rules.tempMin !== undefined && temperature < rules.tempMin) {
    warnings.unshift(`Temperature (${temperature}°C) below recommended minimum (${rules.tempMin}°C)`);
    isSafe = false;
  }
  if (rules.tempMax !== undefined && temperature > rules.tempMax) {
    warnings.unshift(`Temperature (${temperature}°C) above safe maximum (${rules.tempMax}°C)`);
    isSafe = false;
  }

  // Check wind limits
  if (rules.windMax !== undefined && windSpeed > rules.windMax) {
    warnings.unshift(`High winds (${windSpeed} km/h) - exercise caution`);
  }

  return { warnings, isSafe };
}

// Get packing list for activity and season
export function getPackingList(activityType: string, season: Season): string[] {
  return packingLists[activityType]?.[season] || packingLists.City[season];
}

// Find location coordinates by city name
export function findLocationByCity(cityName: string): LocationData | null {
  const normalizedName = cityName.toLowerCase().trim();

  for (const country of Object.values(locations)) {
    for (const [city, data] of Object.entries(country)) {
      if (city.toLowerCase() === normalizedName) {
        return data;
      }
    }
  }

  return null;
}