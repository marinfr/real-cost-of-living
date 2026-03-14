import YAML from 'js-yaml';

// Map of city data - populated at app startup
const citiesCache = {};

/**
 * Dynamically import and parse a YAML city file
 */
async function loadCityFile(slug) {
  try {
    const response = await fetch(`/cities/${slug}.yml`);
    if (!response.ok) {
      throw new Error(`City file not found: ${slug}`);
    }
    const yamlText = await response.text();
    return YAML.load(yamlText);
  } catch (error) {
    console.error(`Failed to load city ${slug}:`, error);
    return null;
  }
}

/**
 * Load all available cities (synchronously from a manifest or dynamically fetched)
 * For now, we assume the city files are statically available
 */
export async function loadAllCities() {
  const cityNames = ['berlin', 'paris', 'vienna', 'chisinau'];

  for (const slug of cityNames) {
    const data = await loadCityFile(slug);
    if (data) {
      citiesCache[slug] = data;
    }
  }

  return citiesCache;
}

/**
 * Get a single city by slug
 */
export function getCity(slug) {
  return citiesCache[slug] || null;
}

/**
 * Get list of all cities (metadata only: name, slug, flag)
 */
export function getCitiesList() {
  return Object.entries(citiesCache).map(([slug, data]) => ({
    slug,
    name: data.name,
    flag: data.flag,
  }));
}

/**
 * Get breakdown items from a city (housing, utilities, food, etc.)
 */
export function getCityBreakdown(slug) {
  const city = getCity(slug);
  if (!city) return [];

  const breakdown = [];
  const categories = ['housing', 'utilities', 'food', 'transportation', 'other_essentials', 'hobbies', 'savings'];

  categories.forEach((category) => {
    if (city[category]) {
      breakdown.push({
        id: category,
        name: category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        amount: city[category].amount,
        explanation: city[category].explanation,
      });
    }
  });

  return breakdown;
}

/**
 * Calculate total of all breakdown items
 */
export function calculateTotal(slug) {
  const city = getCity(slug);
  if (!city) return 0;

  const breakdown = getCityBreakdown(slug);
  return breakdown.reduce((sum, item) => sum + item.amount, 0);
}
