import { HOTELS } from '../src/data/hotels.js';
const cities = new Set(HOTELS.map(h => h.city));
console.log('Cities:', Array.from(cities));
console.log('Total hotels:', HOTELS.length);
