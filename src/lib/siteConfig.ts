import cityData from '../data/city-data.json';
import {
  serviceCategories,
  governmentCategories,
  allBarangays,
} from '../data/yamlLoader';
import {
  mayor,
  viceMayor,
  totalOfficials,
  getCouncilors,
} from '../data/publicOfficials';

const env = import.meta.env;

export const siteConfig = {
  governmentName: env.VITE_GOVERNMENT_NAME || 'Cabanatuan City',
  governmentType: env.VITE_GOVERNMENT_TYPE || 'City',
  region: env.VITE_REGION || 'Region III',
  province: env.VITE_PROVINCE || 'Nueva Ecija',
  websiteUrl: env.VITE_WEBSITE_URL || 'https://www.cabanatuancity.gov.ph/',
  contactEmail: env.VITE_CONTACT_EMAIL || 'cabanatuan.lgu@gmail.com',
  contactPhone: env.VITE_CONTACT_PHONE || '0919-081-3749',
  facebookUrl: env.VITE_FACEBOOK_URL || '',
  twitterUrl: env.VITE_TWITTER_URL || '',
  instagramUrl: env.VITE_INSTAGRAM_URL || '',
  youtubeUrl: env.VITE_YOUTUBE_URL || '',
  siteDescription:
    env.VITE_SITE_DESCRIPTION ||
    'Community portal for local government services and information.',
  prodOrigin: env.VITE_PROD_ORIGIN || '',
};

export const cityStats = {
  cityName: cityData.cityName,
  totalPopulation: cityData.totalPopulation,
  totalBarangays: cityData.totalBarangays,
  landArea: cityData.landArea,
  urbanBarangays: allBarangays.filter(b => b.classification === 'Urban').length,
  ruralBarangays: allBarangays.filter(b => b.classification === 'Rural').length,
};

export const services = serviceCategories.categories;
export const governmentSections = governmentCategories.categories;
export const serviceCount = services.length;
export const governmentSectionCount = governmentSections.length;

export const leadership = {
  mayor,
  viceMayor,
  councilorCount: getCouncilors().length,
  totalOfficials,
};

export const cityHallAddress =
  mayor?.contact?.office ||
  'FXC2+9Q5, Corner M. De Leon Avenue and, 2nd St, Cabanatuan City, Nueva Ecija';

/** City hall map location — override via VITE_CITY_HALL_* env vars */
export const cityHallLocation = {
  address: env.VITE_CITY_HALL_ADDRESS || cityHallAddress,
  latitude: Number(env.VITE_CITY_HALL_LAT) || 15.4708053,
  longitude: Number(env.VITE_CITY_HALL_LNG) || 120.9519476,
  zoom: Number(env.VITE_CITY_HALL_MAP_ZOOM) || 17,
};

/** Open-Meteo weather location — separate from map pin coordinates */
export const weatherLocation = {
  latitude: Number(env.VITE_WEATHER_LAT) || 15.4859,
  longitude: Number(env.VITE_WEATHER_LNG) || 120.9665,
};
