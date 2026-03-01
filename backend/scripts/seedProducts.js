/**
 * Seed script — generates backend/data/products.json
 * Run: node backend/scripts/seedProducts.js
 *
 * Image sources:
 *   Phones     → GSMArena bigpic CDN  (fdn2.gsmarena.com)
 *   Laptops    → Apple Store CDN / manufacturer press assets
 *   Headphones → Manufacturer press assets
 *   TVs        → Manufacturer press assets
 *   GPUs       → NVIDIA / AMD / Intel press assets
 *   Sound      → Manufacturer press assets
 *
 * Icons: icons8 Fluency style (free, no key required)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../data');
const OUT_FILE = join(OUT_DIR, 'products.json');

// ─── Category Icons ───────────────────────────────────────────────────────────
const ICONS = {
  phones:       'https://img.icons8.com/fluency/96/iphone.png',
  laptops:      'https://img.icons8.com/fluency/96/laptop.png',
  headphones:   'https://img.icons8.com/fluency/96/headphones.png',
  tvs:          'https://img.icons8.com/fluency/96/tv.png',
  gpus:         'https://img.icons8.com/fluency/96/gpu-card.png',
  soundsystems: 'https://img.icons8.com/fluency/96/speaker.png',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const slug = (...parts) =>
  parts.join('-').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const phone = ({ id, name, brand, year, storage, specs, imageUrl }) => ({
  id,
  name,
  brand,
  category: 'phones',
  year,
  storage,
  iconUrl: ICONS.phones,
  imageUrl,
  specs: {
    chip:    specs.chip,
    ram:     specs.ram,
    storage: specs.storage,
    camera:  specs.camera,
    battery: specs.battery,
    display: specs.display,
    os:      specs.os,
  },
});

const laptop = ({ id, name, brand, year, specs, imageUrl }) => ({
  id,
  name,
  brand,
  category: 'laptops',
  year,
  iconUrl: ICONS.laptops,
  imageUrl,
  specs: {
    chip:    specs.chip,
    ram:     specs.ram,
    storage: specs.storage,
    display: specs.display,
    battery: specs.battery,
    gpu:     specs.gpu,
    os:      specs.os,
  },
});

const headphone = ({ id, name, brand, year, specs, imageUrl }) => ({
  id,
  name,
  brand,
  category: 'headphones',
  year,
  iconUrl: ICONS.headphones,
  imageUrl,
  specs: {
    type:              specs.type,
    driver:            specs.driver,
    noiseCancelling:   specs.noiseCancelling,
    battery:           specs.battery,
    connectivity:      specs.connectivity,
    frequencyResponse: specs.frequencyResponse,
    weight:            specs.weight,
  },
});

const tv = ({ id, name, brand, year, specs, imageUrl }) => ({
  id,
  name,
  brand,
  category: 'tvs',
  year,
  iconUrl: ICONS.tvs,
  imageUrl,
  specs: {
    screenSize:  specs.screenSize,
    resolution:  specs.resolution,
    panel:       specs.panel,
    refreshRate: specs.refreshRate,
    hdr:         specs.hdr,
    os:          specs.os,
    ports:       specs.ports,
  },
});

const gpu = ({ id, name, brand, year, specs, imageUrl }) => ({
  id,
  name,
  brand,
  category: 'gpus',
  year,
  iconUrl: ICONS.gpus,
  imageUrl,
  specs: {
    vram:            specs.vram,
    architecture:    specs.architecture,
    tdp:             specs.tdp,
    cudaOrStreams:    specs.cudaOrStreams,
    memoryBandwidth: specs.memoryBandwidth,
    interface:       specs.interface,
    length:          specs.length,
  },
});

const soundsystem = ({ id, name, brand, year, specs, imageUrl }) => ({
  id,
  name,
  brand,
  category: 'soundsystems',
  year,
  iconUrl: ICONS.soundsystems,
  imageUrl,
  specs: {
    type:         specs.type,
    channels:     specs.channels,
    power:        specs.power,
    connectivity: specs.connectivity,
    dolby:        specs.dolby,
    subwoofer:    specs.subwoofer,
    dimensions:   specs.dimensions,
  },
});

// ─── PHONES ───────────────────────────────────────────────────────────────────
const PHONES = [
  // Apple iPhone 16 series
  phone({ id: 'iphone-16-128gb', name: 'iPhone 16', brand: 'Apple', year: '2024', storage: '128GB',
    specs: { chip: 'A18', ram: '8GB', storage: '128GB', camera: '48MP Dual', battery: '3,561 mAh', display: '6.1" OLED', os: 'iOS 18' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg' }),

  phone({ id: 'iphone-16-plus-128gb', name: 'iPhone 16 Plus', brand: 'Apple', year: '2024', storage: '128GB',
    specs: { chip: 'A18', ram: '8GB', storage: '128GB', camera: '48MP Dual', battery: '4,006 mAh', display: '6.7" OLED', os: 'iOS 18' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg' }),

  phone({ id: 'iphone-16-pro-256gb', name: 'iPhone 16 Pro', brand: 'Apple', year: '2024', storage: '256GB',
    specs: { chip: 'A18 Pro', ram: '8GB', storage: '256GB', camera: '48MP Triple', battery: '3,577 mAh', display: '6.3" OLED ProMotion', os: 'iOS 18' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg' }),

  phone({ id: 'iphone-16-pro-max-256gb', name: 'iPhone 16 Pro Max', brand: 'Apple', year: '2024', storage: '256GB',
    specs: { chip: 'A18 Pro', ram: '8GB', storage: '256GB', camera: '48MP Triple', battery: '4,685 mAh', display: '6.9" OLED ProMotion', os: 'iOS 18' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg' }),

  // Apple iPhone 15 series
  phone({ id: 'iphone-15-128gb', name: 'iPhone 15', brand: 'Apple', year: '2023', storage: '128GB',
    specs: { chip: 'A16 Bionic', ram: '6GB', storage: '128GB', camera: '48MP Dual', battery: '3,349 mAh', display: '6.1" OLED', os: 'iOS 17' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg' }),

  phone({ id: 'iphone-15-plus-128gb', name: 'iPhone 15 Plus', brand: 'Apple', year: '2023', storage: '128GB',
    specs: { chip: 'A16 Bionic', ram: '6GB', storage: '128GB', camera: '48MP Dual', battery: '4,383 mAh', display: '6.7" OLED', os: 'iOS 17' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus.jpg' }),

  phone({ id: 'iphone-15-pro-128gb', name: 'iPhone 15 Pro', brand: 'Apple', year: '2023', storage: '128GB',
    specs: { chip: 'A17 Pro', ram: '8GB', storage: '128GB', camera: '48MP Triple', battery: '3,274 mAh', display: '6.1" OLED ProMotion', os: 'iOS 17' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg' }),

  phone({ id: 'iphone-15-pro-max-256gb', name: 'iPhone 15 Pro Max', brand: 'Apple', year: '2023', storage: '256GB',
    specs: { chip: 'A17 Pro', ram: '8GB', storage: '256GB', camera: '48MP Triple', battery: '4,422 mAh', display: '6.7" OLED ProMotion', os: 'iOS 17' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg' }),

  // Apple iPhone 14 series
  phone({ id: 'iphone-14-128gb', name: 'iPhone 14', brand: 'Apple', year: '2022', storage: '128GB',
    specs: { chip: 'A15 Bionic', ram: '6GB', storage: '128GB', camera: '12MP Dual', battery: '3,279 mAh', display: '6.1" OLED', os: 'iOS 16' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg' }),

  phone({ id: 'iphone-14-pro-128gb', name: 'iPhone 14 Pro', brand: 'Apple', year: '2022', storage: '128GB',
    specs: { chip: 'A16 Bionic', ram: '6GB', storage: '128GB', camera: '48MP Triple', battery: '3,200 mAh', display: '6.1" OLED ProMotion', os: 'iOS 16' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg' }),

  phone({ id: 'iphone-14-pro-max-128gb', name: 'iPhone 14 Pro Max', brand: 'Apple', year: '2022', storage: '128GB',
    specs: { chip: 'A16 Bionic', ram: '6GB', storage: '128GB', camera: '48MP Triple', battery: '4,323 mAh', display: '6.7" OLED ProMotion', os: 'iOS 16' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max.jpg' }),

  // Samsung Galaxy S25 series
  phone({ id: 'samsung-galaxy-s25-128gb', name: 'Galaxy S25', brand: 'Samsung', year: '2025', storage: '128GB',
    specs: { chip: 'Snapdragon 8 Elite', ram: '12GB', storage: '128GB', camera: '50MP Triple', battery: '4,000 mAh', display: '6.2" Dynamic AMOLED 2X', os: 'Android 15' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25.jpg' }),

  phone({ id: 'samsung-galaxy-s25-plus-256gb', name: 'Galaxy S25+', brand: 'Samsung', year: '2025', storage: '256GB',
    specs: { chip: 'Snapdragon 8 Elite', ram: '12GB', storage: '256GB', camera: '50MP Triple', battery: '4,900 mAh', display: '6.7" Dynamic AMOLED 2X', os: 'Android 15' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-plus.jpg' }),

  phone({ id: 'samsung-galaxy-s25-ultra-256gb', name: 'Galaxy S25 Ultra', brand: 'Samsung', year: '2025', storage: '256GB',
    specs: { chip: 'Snapdragon 8 Elite', ram: '12GB', storage: '256GB', camera: '200MP Quad', battery: '5,000 mAh', display: '6.9" Dynamic AMOLED 2X', os: 'Android 15' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra.jpg' }),

  // Samsung Galaxy S24 series
  phone({ id: 'samsung-galaxy-s24-128gb', name: 'Galaxy S24', brand: 'Samsung', year: '2024', storage: '128GB',
    specs: { chip: 'Snapdragon 8 Gen 3', ram: '8GB', storage: '128GB', camera: '50MP Triple', battery: '4,000 mAh', display: '6.2" Dynamic AMOLED 2X', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24.jpg' }),

  phone({ id: 'samsung-galaxy-s24-plus-256gb', name: 'Galaxy S24+', brand: 'Samsung', year: '2024', storage: '256GB',
    specs: { chip: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', camera: '50MP Triple', battery: '4,900 mAh', display: '6.7" Dynamic AMOLED 2X', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-plus.jpg' }),

  phone({ id: 'samsung-galaxy-s24-ultra-256gb', name: 'Galaxy S24 Ultra', brand: 'Samsung', year: '2024', storage: '256GB',
    specs: { chip: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', camera: '200MP Quad', battery: '5,000 mAh', display: '6.8" Dynamic AMOLED 2X', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-ultra.jpg' }),

  phone({ id: 'samsung-galaxy-s24-fe-128gb', name: 'Galaxy S24 FE', brand: 'Samsung', year: '2024', storage: '128GB',
    specs: { chip: 'Exynos 2500', ram: '8GB', storage: '128GB', camera: '50MP Triple', battery: '4,700 mAh', display: '6.7" Dynamic AMOLED 2X', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24-fe.jpg' }),

  // Samsung Galaxy A series
  phone({ id: 'samsung-galaxy-a55-128gb', name: 'Galaxy A55', brand: 'Samsung', year: '2024', storage: '128GB',
    specs: { chip: 'Exynos 1480', ram: '8GB', storage: '128GB', camera: '50MP Triple', battery: '5,000 mAh', display: '6.6" Super AMOLED', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a55.jpg' }),

  phone({ id: 'samsung-galaxy-a35-128gb', name: 'Galaxy A35', brand: 'Samsung', year: '2024', storage: '128GB',
    specs: { chip: 'Exynos 1380', ram: '6GB', storage: '128GB', camera: '50MP Triple', battery: '5,000 mAh', display: '6.6" Super AMOLED', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a35.jpg' }),

  // Google Pixel 9 series
  phone({ id: 'google-pixel-9-128gb', name: 'Pixel 9', brand: 'Google', year: '2024', storage: '128GB',
    specs: { chip: 'Google Tensor G4', ram: '12GB', storage: '128GB', camera: '50MP Dual', battery: '4,700 mAh', display: '6.3" OLED', os: 'Android 15' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel9.jpg' }),

  phone({ id: 'google-pixel-9-pro-128gb', name: 'Pixel 9 Pro', brand: 'Google', year: '2024', storage: '128GB',
    specs: { chip: 'Google Tensor G4', ram: '16GB', storage: '128GB', camera: '50MP Triple', battery: '4,700 mAh', display: '6.3" LTPO OLED', os: 'Android 15' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel9-pro.jpg' }),

  phone({ id: 'google-pixel-9-pro-xl-128gb', name: 'Pixel 9 Pro XL', brand: 'Google', year: '2024', storage: '128GB',
    specs: { chip: 'Google Tensor G4', ram: '16GB', storage: '128GB', camera: '50MP Triple', battery: '5,060 mAh', display: '6.8" LTPO OLED', os: 'Android 15' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel9-pro-xl.jpg' }),

  phone({ id: 'google-pixel-9-pro-fold-256gb', name: 'Pixel 9 Pro Fold', brand: 'Google', year: '2024', storage: '256GB',
    specs: { chip: 'Google Tensor G4', ram: '16GB', storage: '256GB', camera: '48MP Triple', battery: '4,650 mAh', display: '8.0" LTPO OLED (inner)', os: 'Android 15' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel9-pro-fold.jpg' }),

  phone({ id: 'google-pixel-8-128gb', name: 'Pixel 8', brand: 'Google', year: '2023', storage: '128GB',
    specs: { chip: 'Google Tensor G3', ram: '8GB', storage: '128GB', camera: '50MP Dual', battery: '4,575 mAh', display: '6.2" OLED', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8.jpg' }),

  phone({ id: 'google-pixel-8-pro-128gb', name: 'Pixel 8 Pro', brand: 'Google', year: '2023', storage: '128GB',
    specs: { chip: 'Google Tensor G3', ram: '12GB', storage: '128GB', camera: '50MP Triple', battery: '5,050 mAh', display: '6.7" LTPO OLED', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8-pro.jpg' }),

  phone({ id: 'google-pixel-8a-128gb', name: 'Pixel 8a', brand: 'Google', year: '2024', storage: '128GB',
    specs: { chip: 'Google Tensor G3', ram: '8GB', storage: '128GB', camera: '64MP Dual', battery: '4,492 mAh', display: '6.1" OLED', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/google-pixel-8a.jpg' }),

  // OnePlus
  phone({ id: 'oneplus-13-256gb', name: 'OnePlus 13', brand: 'OnePlus', year: '2025', storage: '256GB',
    specs: { chip: 'Snapdragon 8 Elite', ram: '12GB', storage: '256GB', camera: '50MP Triple', battery: '6,000 mAh', display: '6.82" LTPO AMOLED', os: 'Android 15' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-13-5g.jpg' }),

  phone({ id: 'oneplus-12-256gb', name: 'OnePlus 12', brand: 'OnePlus', year: '2024', storage: '256GB',
    specs: { chip: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', camera: '50MP Triple', battery: '5,400 mAh', display: '6.82" LTPO AMOLED', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-12.jpg' }),

  phone({ id: 'oneplus-nord-4-256gb', name: 'OnePlus Nord 4', brand: 'OnePlus', year: '2024', storage: '256GB',
    specs: { chip: 'Snapdragon 7+ Gen 3', ram: '8GB', storage: '256GB', camera: '50MP Dual', battery: '5,500 mAh', display: '6.74" AMOLED', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/oneplus-nord-4.jpg' }),

  // Sony Xperia
  phone({ id: 'sony-xperia-1-vi-256gb', name: 'Xperia 1 VI', brand: 'Sony', year: '2024', storage: '256GB',
    specs: { chip: 'Snapdragon 8 Gen 3', ram: '12GB', storage: '256GB', camera: '48MP Triple', battery: '5,000 mAh', display: '6.5" OLED 120Hz', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-1-vi.jpg' }),

  phone({ id: 'sony-xperia-5-vi-128gb', name: 'Xperia 5 VI', brand: 'Sony', year: '2024', storage: '128GB',
    specs: { chip: 'Snapdragon 8 Gen 3', ram: '8GB', storage: '128GB', camera: '48MP Dual', battery: '5,000 mAh', display: '6.1" OLED 120Hz', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-5-vi.jpg' }),

  phone({ id: 'sony-xperia-10-vi-128gb', name: 'Xperia 10 VI', brand: 'Sony', year: '2024', storage: '128GB',
    specs: { chip: 'Snapdragon 6 Gen 1', ram: '6GB', storage: '128GB', camera: '48MP Dual', battery: '5,000 mAh', display: '6.1" OLED', os: 'Android 14' },
    imageUrl: 'https://fdn2.gsmarena.com/vv/bigpic/sony-xperia-10-vi.jpg' }),
];

// ─── LAPTOPS ──────────────────────────────────────────────────────────────────
const LAPTOPS = [
  // Apple MacBook Pro M4
  laptop({ id: 'macbook-pro-14-m4', name: 'MacBook Pro 14" M4', brand: 'Apple', year: '2024',
    specs: { chip: 'Apple M4', ram: '16GB', storage: '512GB SSD', display: '14.2" Liquid Retina XDR', battery: '72.4Wh', gpu: '10-core GPU', os: 'macOS Sequoia' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-m4-pro-spaceblack-select-202411?wid=904&hei=840&fmt=jpeg&qlt=90' }),

  laptop({ id: 'macbook-pro-14-m4-pro', name: 'MacBook Pro 14" M4 Pro', brand: 'Apple', year: '2024',
    specs: { chip: 'Apple M4 Pro', ram: '24GB', storage: '512GB SSD', display: '14.2" Liquid Retina XDR', battery: '72.4Wh', gpu: '20-core GPU', os: 'macOS Sequoia' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-m4-pro-spaceblack-select-202411?wid=904&hei=840&fmt=jpeg&qlt=90' }),

  laptop({ id: 'macbook-pro-16-m4-pro', name: 'MacBook Pro 16" M4 Pro', brand: 'Apple', year: '2024',
    specs: { chip: 'Apple M4 Pro', ram: '24GB', storage: '512GB SSD', display: '16.2" Liquid Retina XDR', battery: '99.6Wh', gpu: '20-core GPU', os: 'macOS Sequoia' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-m4-max-spaceblack-select-202411?wid=904&hei=840&fmt=jpeg&qlt=90' }),

  laptop({ id: 'macbook-pro-16-m4-max', name: 'MacBook Pro 16" M4 Max', brand: 'Apple', year: '2024',
    specs: { chip: 'Apple M4 Max', ram: '36GB', storage: '1TB SSD', display: '16.2" Liquid Retina XDR', battery: '99.6Wh', gpu: '40-core GPU', os: 'macOS Sequoia' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-m4-max-spaceblack-select-202411?wid=904&hei=840&fmt=jpeg&qlt=90' }),

  laptop({ id: 'macbook-air-13-m3', name: 'MacBook Air 13" M3', brand: 'Apple', year: '2024',
    specs: { chip: 'Apple M3', ram: '8GB', storage: '256GB SSD', display: '13.6" Liquid Retina', battery: '52.6Wh', gpu: '10-core GPU', os: 'macOS Sonoma' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-m3-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90' }),

  laptop({ id: 'macbook-air-13-m4', name: 'MacBook Air 13" M4', brand: 'Apple', year: '2025',
    specs: { chip: 'Apple M4', ram: '16GB', storage: '256GB SSD', display: '13.6" Liquid Retina', battery: '53.2Wh', gpu: '10-core GPU', os: 'macOS Sequoia' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-m4-skyblue-select-202503?wid=904&hei=840&fmt=jpeg&qlt=90' }),

  laptop({ id: 'macbook-air-15-m3', name: 'MacBook Air 15" M3', brand: 'Apple', year: '2024',
    specs: { chip: 'Apple M3', ram: '8GB', storage: '256GB SSD', display: '15.3" Liquid Retina', battery: '66.5Wh', gpu: '10-core GPU', os: 'macOS Sonoma' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-m3-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90' }),

  // Dell
  laptop({ id: 'dell-xps-13-9340', name: 'XPS 13 9340', brand: 'Dell', year: '2024',
    specs: { chip: 'Intel Core Ultra 7 155H', ram: '16GB', storage: '512GB SSD', display: '13.4" FHD+ IPS', battery: '55Wh', gpu: 'Intel Arc', os: 'Windows 11' },
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9340/media-gallery/notebook-xps-13-9340-t-blue-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=4000&hei=3000&qlt=100&resMode=sharp2&size=4000,3000' }),

  laptop({ id: 'dell-xps-15-9530', name: 'XPS 15 9530', brand: 'Dell', year: '2023',
    specs: { chip: 'Intel Core i7-13700H', ram: '16GB', storage: '512GB SSD', display: '15.6" FHD+ OLED', battery: '86Wh', gpu: 'NVIDIA RTX 4060', os: 'Windows 11' },
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=4000&hei=3000&qlt=100&resMode=sharp2&size=4000,3000' }),

  laptop({ id: 'dell-xps-16-9640', name: 'XPS 16 9640', brand: 'Dell', year: '2024',
    specs: { chip: 'Intel Core Ultra 9 185H', ram: '32GB', storage: '1TB SSD', display: '16.3" 3.2K OLED', battery: '99.5Wh', gpu: 'NVIDIA RTX 4070', os: 'Windows 11' },
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-16-9640/media-gallery/notebook-xps-16-9640-t-platinum-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=4000&hei=3000&qlt=100&resMode=sharp2&size=4000,3000' }),

  laptop({ id: 'dell-inspiron-15-3520', name: 'Inspiron 15 3520', brand: 'Dell', year: '2023',
    specs: { chip: 'Intel Core i5-1235U', ram: '8GB', storage: '256GB SSD', display: '15.6" FHD IPS', battery: '41Wh', gpu: 'Intel Iris Xe', os: 'Windows 11' },
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/inspiron-15-3520/media-gallery/silver/notebook-inspiron-15-3520-t-silver-gallery-1.psd?fmt=pjpg&pscan=auto&scl=1&wid=4000&hei=3000&qlt=100&resMode=sharp2&size=4000,3000' }),

  // HP
  laptop({ id: 'hp-spectre-x360-14', name: 'Spectre x360 14', brand: 'HP', year: '2024',
    specs: { chip: 'Intel Core Ultra 7 155U', ram: '16GB', storage: '512GB SSD', display: '14" 2.8K OLED', battery: '66Wh', gpu: 'Intel Arc', os: 'Windows 11' },
    imageUrl: 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08819714.png' }),

  laptop({ id: 'hp-spectre-x360-16', name: 'Spectre x360 16', brand: 'HP', year: '2024',
    specs: { chip: 'Intel Core Ultra 7 155H', ram: '16GB', storage: '1TB SSD', display: '16" 3K OLED', battery: '83Wh', gpu: 'NVIDIA RTX 4050', os: 'Windows 11' },
    imageUrl: 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08819726.png' }),

  laptop({ id: 'hp-elitebook-840-g11', name: 'EliteBook 840 G11', brand: 'HP', year: '2024',
    specs: { chip: 'Intel Core Ultra 7 165U', ram: '16GB', storage: '512GB SSD', display: '14" WUXGA IPS', battery: '51Wh', gpu: 'Intel Arc', os: 'Windows 11 Pro' },
    imageUrl: 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08527726.png' }),

  laptop({ id: 'hp-omen-16-amd', name: 'OMEN 16 AMD', brand: 'HP', year: '2024',
    specs: { chip: 'AMD Ryzen 9 8945HS', ram: '16GB', storage: '1TB SSD', display: '16.1" QHD 165Hz', battery: '83Wh', gpu: 'NVIDIA RTX 4070', os: 'Windows 11' },
    imageUrl: 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08522413.png' }),

  // Lenovo
  laptop({ id: 'lenovo-thinkpad-x1-carbon-gen12', name: 'ThinkPad X1 Carbon Gen 12', brand: 'Lenovo', year: '2024',
    specs: { chip: 'Intel Core Ultra 7 164U', ram: '16GB', storage: '512GB SSD', display: '14" WUXGA IPS', battery: '57Wh', gpu: 'Intel Arc', os: 'Windows 11 Pro' },
    imageUrl: 'https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MzIxNTYyfGltYWdlL3BuZ3xoMzcvaDI2LzE0NzIxODkxMTA0MzUwLnBuZ3w3NmY3MzZiMWE4YWI4NjcxMjhjNTAzOWQ0YWQ0YzljMTNkZTIxZmUwMjIxNGFlMDE2NGExYjI4Y2ZiMzM2NTg5/lenovo-laptop-thinkpad-x1-carbon-gen-12-14-hero.png' }),

  laptop({ id: 'lenovo-thinkpad-x1-yoga-gen9', name: 'ThinkPad X1 Yoga Gen 9', brand: 'Lenovo', year: '2024',
    specs: { chip: 'Intel Core Ultra 7 164U', ram: '16GB', storage: '512GB SSD', display: '14" WUXGA OLED', battery: '57Wh', gpu: 'Intel Arc', os: 'Windows 11 Pro' },
    imageUrl: 'https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MjQ1NjgyfGltYWdlL3BuZ3xoOGIvaDY4LzE0NTQxMDg2Nzg0OTI2LnBuZ3w4OTQzNDZiMjRlYTY1ZDcwZDkxNDFmOWQ1MzcwM2M1MjY1NWI4MDIxNTI2MTEzZjRlZjUzOTRjMTUxODE5MjNi/lenovo-laptop-thinkpad-x1-yoga-gen-9-14-hero.png' }),

  laptop({ id: 'lenovo-ideapad-slim-5-15', name: 'IdeaPad Slim 5 15"', brand: 'Lenovo', year: '2024',
    specs: { chip: 'AMD Ryzen 7 8745HS', ram: '16GB', storage: '512GB SSD', display: '15.3" FHD IPS', battery: '60Wh', gpu: 'AMD Radeon 780M', os: 'Windows 11' },
    imageUrl: 'https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8NzE2NzI4fGltYWdlL3BuZ3xoNjIvaGJhLzE0NzI4NTQ5MzMzNTE4LnBuZ3xlYmRjZWQzMGMzNjRkNjdiYzBiZmM4MjE3NmZmNGRlNzJiMTI2OGZhYzk5NzMzMGVlZjQzNDJmMjFlNzZiYTk5/lenovo-laptop-ideapad-slim-5-15-amd-2024-hero.png' }),

  laptop({ id: 'lenovo-legion-5-pro-16', name: 'Legion 5 Pro 16"', brand: 'Lenovo', year: '2024',
    specs: { chip: 'AMD Ryzen 9 8945HX', ram: '16GB', storage: '1TB SSD', display: '16" WQXGA 165Hz', battery: '80Wh', gpu: 'NVIDIA RTX 4070', os: 'Windows 11' },
    imageUrl: 'https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MzYxMjYxfGltYWdlL3BuZ3xoZTEvaGViLzE0Nzg0OTMyODQxMjQ2LnBuZ3w5NzE3MTExNzMyOTVkOTkzNDk4OGI2M2JhZDcxMmVmYThiZmVlMmQxNzZkZTM1YmIxMTgyMjQxOTMzZjhkNWRl/lenovo-laptop-legion-5-pro-gen-9-16-amd-hero.png' }),

  // ASUS
  laptop({ id: 'asus-zenbook-14-oled', name: 'ZenBook 14 OLED', brand: 'ASUS', year: '2024',
    specs: { chip: 'Intel Core Ultra 7 155H', ram: '16GB', storage: '512GB SSD', display: '14" 2.8K OLED', battery: '75Wh', gpu: 'Intel Arc', os: 'Windows 11' },
    imageUrl: 'https://dlcdnwebimgs.asus.com/gain/D8EEDDE6-7C89-4B9F-8AB3-A6E3282059AB/w800/fwebp' }),

  laptop({ id: 'asus-rog-zephyrus-g14-2024', name: 'ROG Zephyrus G14 2024', brand: 'ASUS', year: '2024',
    specs: { chip: 'AMD Ryzen 9 8945HS', ram: '32GB', storage: '1TB SSD', display: '14" 3K OLED 120Hz', battery: '73Wh', gpu: 'NVIDIA RTX 4070', os: 'Windows 11' },
    imageUrl: 'https://dlcdnwebimgs.asus.com/gain/00E8F14B-8ED7-4F67-88FD-2F3CCAA12B85/w800/fwebp' }),

  // Microsoft
  laptop({ id: 'microsoft-surface-laptop-6-13', name: 'Surface Laptop 6 13.5"', brand: 'Microsoft', year: '2024',
    specs: { chip: 'Intel Core Ultra 5 135H', ram: '16GB', storage: '256GB SSD', display: '13.5" PixelSense', battery: '54Wh', gpu: 'Intel Arc', os: 'Windows 11' },
    imageUrl: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW1lMDx?ver=af1a' }),

  laptop({ id: 'microsoft-surface-pro-11', name: 'Surface Pro 11', brand: 'Microsoft', year: '2024',
    specs: { chip: 'Snapdragon X Elite', ram: '16GB', storage: '256GB SSD', display: '13" PixelSense Flow', battery: '53Wh', gpu: 'Adreno X1', os: 'Windows 11' },
    imageUrl: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW1leYq?ver=74f1' }),
];

// ─── HEADPHONES ───────────────────────────────────────────────────────────────
const HEADPHONES = [
  // Sony WH (over-ear)
  headphone({ id: 'sony-wh-1000xm5', name: 'WH-1000XM5', brand: 'Sony', year: '2022',
    specs: { type: 'Over-ear', driver: '30mm', noiseCancelling: true, battery: '30h', connectivity: 'Bluetooth 5.2', frequencyResponse: '4Hz–40kHz', weight: '250g' },
    imageUrl: 'https://www.sony.com/image/5d02da5df552836db894cead401b9a0a?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF' }),

  headphone({ id: 'sony-wh-1000xm4', name: 'WH-1000XM4', brand: 'Sony', year: '2020',
    specs: { type: 'Over-ear', driver: '40mm', noiseCancelling: true, battery: '30h', connectivity: 'Bluetooth 5.0', frequencyResponse: '4Hz–40kHz', weight: '254g' },
    imageUrl: 'https://www.sony.com/image/3231950b1baa88e5a3b6e9dfbca77bcc?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF' }),

  // Sony WF (true wireless)
  headphone({ id: 'sony-wf-1000xm5', name: 'WF-1000XM5', brand: 'Sony', year: '2023',
    specs: { type: 'In-ear TWS', driver: '8.4mm', noiseCancelling: true, battery: '8h (36h case)', connectivity: 'Bluetooth 5.3', frequencyResponse: '20Hz–20kHz', weight: '5.9g (each)' },
    imageUrl: 'https://www.sony.com/image/94a5b1ce0b1ba09a5b0b29b8d7cc2d09?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF' }),

  headphone({ id: 'sony-wf-1000xm4', name: 'WF-1000XM4', brand: 'Sony', year: '2021',
    specs: { type: 'In-ear TWS', driver: '6mm', noiseCancelling: true, battery: '8h (24h case)', connectivity: 'Bluetooth 5.2', frequencyResponse: '20Hz–20kHz', weight: '7.3g (each)' },
    imageUrl: 'https://www.sony.com/image/a963ac72b5a6a94c4b0a3cbeba36a571?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF' }),

  headphone({ id: 'sony-linkbuds-s', name: 'LinkBuds S', brand: 'Sony', year: '2022',
    specs: { type: 'In-ear TWS', driver: '5mm', noiseCancelling: true, battery: '6h (20h case)', connectivity: 'Bluetooth 5.2', frequencyResponse: '20Hz–20kHz', weight: '4.8g (each)' },
    imageUrl: 'https://www.sony.com/image/7b57b072ba74272b0db6553c8e1e04e8?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF' }),

  headphone({ id: 'sony-mdr-7506', name: 'MDR-7506', brand: 'Sony', year: '1991',
    specs: { type: 'Over-ear (wired)', driver: '40mm', noiseCancelling: false, battery: 'N/A (wired)', connectivity: '3.5mm / 6.35mm', frequencyResponse: '10Hz–20kHz', weight: '230g' },
    imageUrl: 'https://www.sony.com/image/bd2d59d56ae5df35f82bcf0499cee6f1?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF' }),

  // Apple
  headphone({ id: 'airpods-pro-2', name: 'AirPods Pro (2nd Gen)', brand: 'Apple', year: '2022',
    specs: { type: 'In-ear TWS', driver: 'Custom', noiseCancelling: true, battery: '6h (30h case)', connectivity: 'Bluetooth 5.3', frequencyResponse: '20Hz–20kHz', weight: '5.3g (each)' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90' }),

  headphone({ id: 'airpods-4', name: 'AirPods 4', brand: 'Apple', year: '2024',
    specs: { type: 'In-ear TWS (open)', driver: 'Custom', noiseCancelling: false, battery: '5h (30h case)', connectivity: 'Bluetooth 5.3', frequencyResponse: '20Hz–20kHz', weight: '4.3g (each)' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-4-select-202409?wid=470&hei=556&fmt=jpeg&qlt=90' }),

  headphone({ id: 'airpods-4-anc', name: 'AirPods 4 (ANC)', brand: 'Apple', year: '2024',
    specs: { type: 'In-ear TWS (open)', driver: 'Custom', noiseCancelling: true, battery: '5h (30h case)', connectivity: 'Bluetooth 5.3', frequencyResponse: '20Hz–20kHz', weight: '4.3g (each)' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-4-anc-select-202409?wid=470&hei=556&fmt=jpeg&qlt=90' }),

  headphone({ id: 'airpods-max-usbc', name: 'AirPods Max (USB-C)', brand: 'Apple', year: '2024',
    specs: { type: 'Over-ear', driver: '40mm', noiseCancelling: true, battery: '20h', connectivity: 'Bluetooth 5.3', frequencyResponse: '20Hz–20kHz', weight: '385g' },
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-max-select-202409-midnight?wid=470&hei=556&fmt=jpeg&qlt=90' }),

  // Bose
  headphone({ id: 'bose-quietcomfort-ultra', name: 'QuietComfort Ultra', brand: 'Bose', year: '2023',
    specs: { type: 'Over-ear', driver: '40mm', noiseCancelling: true, battery: '24h', connectivity: 'Bluetooth 5.3', frequencyResponse: '20Hz–20kHz', weight: '250g' },
    imageUrl: 'https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra_headphones/product_silo_images/QCU_HP_BLACK_EC_001_HERO.png/jcr:content/renditions/cq5dam.web.600.600.png' }),

  headphone({ id: 'bose-quietcomfort-45', name: 'QuietComfort 45', brand: 'Bose', year: '2021',
    specs: { type: 'Over-ear', driver: '40mm', noiseCancelling: true, battery: '24h', connectivity: 'Bluetooth 5.1', frequencyResponse: '20Hz–20kHz', weight: '238g' },
    imageUrl: 'https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc45/product_silo_images/QC45_HP_BLK_1_4.png/jcr:content/renditions/cq5dam.web.600.600.png' }),

  headphone({ id: 'bose-quietcomfort-earbuds-2', name: 'QuietComfort Earbuds II', brand: 'Bose', year: '2022',
    specs: { type: 'In-ear TWS', driver: 'Custom', noiseCancelling: true, battery: '6h (24h case)', connectivity: 'Bluetooth 5.3', frequencyResponse: '20Hz–20kHz', weight: '6.2g (each)' },
    imageUrl: 'https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_earbuds_ii/product_silo_images/QCEBII_TRIPLE_BLACK_CASE_OPEN_FLAT_1.png/jcr:content/renditions/cq5dam.web.600.600.png' }),

  // Sennheiser
  headphone({ id: 'sennheiser-hd-660s2', name: 'HD 660S2', brand: 'Sennheiser', year: '2022',
    specs: { type: 'Over-ear (wired)', driver: '38mm', noiseCancelling: false, battery: 'N/A (wired)', connectivity: '4.4mm / 6.35mm', frequencyResponse: '8Hz–41.5kHz', weight: '260g' },
    imageUrl: 'https://assets.sennheiser.com/img/17270/x1_desktop_HD-660S2_Front_Transparent.png' }),

  headphone({ id: 'sennheiser-momentum-4', name: 'Momentum 4 Wireless', brand: 'Sennheiser', year: '2022',
    specs: { type: 'Over-ear', driver: '42mm', noiseCancelling: true, battery: '60h', connectivity: 'Bluetooth 5.2', frequencyResponse: '6Hz–22kHz', weight: '293g' },
    imageUrl: 'https://assets.sennheiser.com/img/17270/x1_desktop_Momentum-4-Wireless_Black_Front_Transparent.png' }),

  headphone({ id: 'sennheiser-momentum-true-wireless-4', name: 'Momentum True Wireless 4', brand: 'Sennheiser', year: '2024',
    specs: { type: 'In-ear TWS', driver: '7mm', noiseCancelling: true, battery: '7.5h (30h case)', connectivity: 'Bluetooth 5.4', frequencyResponse: '5Hz–21kHz', weight: '6g (each)' },
    imageUrl: 'https://assets.sennheiser.com/img/27574/x1_desktop_MOMENTUM_True_Wireless_4_Black_Front_case_Transparent.png' }),

  // Jabra
  headphone({ id: 'jabra-evolve2-85', name: 'Evolve2 85', brand: 'Jabra', year: '2021',
    specs: { type: 'Over-ear', driver: '40mm', noiseCancelling: true, battery: '37h', connectivity: 'Bluetooth 5.0', frequencyResponse: '20Hz–20kHz', weight: '340g' },
    imageUrl: 'https://www.jabra.com/~/media/MainImages/Products/Evolve2-85-2022/evolve2-85-titanium-black-primary.png' }),

  headphone({ id: 'jabra-elite-10', name: 'Elite 10', brand: 'Jabra', year: '2023',
    specs: { type: 'In-ear TWS', driver: '10mm', noiseCancelling: true, battery: '8h (36h case)', connectivity: 'Bluetooth 5.3', frequencyResponse: '20Hz–20kHz', weight: '5.6g (each)' },
    imageUrl: 'https://www.jabra.com/~/media/MainImages/Products/Jabra-Elite-10/Jabra-Elite-10-Titanium-Black-primary.png' }),

  // Audio-Technica
  headphone({ id: 'audio-technica-ath-m50x', name: 'ATH-M50x', brand: 'Audio-Technica', year: '2014',
    specs: { type: 'Over-ear (wired)', driver: '45mm', noiseCancelling: false, battery: 'N/A (wired)', connectivity: '3.5mm / 6.35mm', frequencyResponse: '15Hz–28kHz', weight: '285g' },
    imageUrl: 'https://www.audio-technica.com/media/catalog/product/A/T/ATH-M50x_BK_1.png' }),

  headphone({ id: 'audio-technica-ath-m40x', name: 'ATH-M40x', brand: 'Audio-Technica', year: '2014',
    specs: { type: 'Over-ear (wired)', driver: '40mm', noiseCancelling: false, battery: 'N/A (wired)', connectivity: '3.5mm / 6.35mm', frequencyResponse: '15Hz–24kHz', weight: '240g' },
    imageUrl: 'https://www.audio-technica.com/media/catalog/product/A/T/ATH-M40x_BK_1.png' }),

  // Samsung
  headphone({ id: 'samsung-galaxy-buds3-pro', name: 'Galaxy Buds3 Pro', brand: 'Samsung', year: '2024',
    specs: { type: 'In-ear TWS', driver: '10.5mm + 6.1mm', noiseCancelling: true, battery: '6h (30h case)', connectivity: 'Bluetooth 5.4', frequencyResponse: '20Hz–20kHz', weight: '5.5g (each)' },
    imageUrl: 'https://image-us.samsung.com/us/smartphones/galaxy-buds/gallery/galaxy-buds3-pro-silver-1.jpg' }),

  headphone({ id: 'samsung-galaxy-buds3', name: 'Galaxy Buds3', brand: 'Samsung', year: '2024',
    specs: { type: 'In-ear TWS (open)', driver: '11mm', noiseCancelling: false, battery: '6h (30h case)', connectivity: 'Bluetooth 5.4', frequencyResponse: '20Hz–20kHz', weight: '4.8g (each)' },
    imageUrl: 'https://image-us.samsung.com/us/smartphones/galaxy-buds/gallery/galaxy-buds3-white-1.jpg' }),
];

// ─── TVs ──────────────────────────────────────────────────────────────────────
const TVS = [
  // Samsung
  tv({ id: 'samsung-s95d-55', name: 'Samsung S95D 55"', brand: 'Samsung', year: '2024',
    specs: { screenSize: '55"', resolution: '4K UHD', panel: 'QD-OLED', refreshRate: '144Hz', hdr: 'HDR10+', os: 'Tizen', ports: '4x HDMI 2.1' },
    imageUrl: 'https://image-us.samsung.com/us/televisions-home-theater/tvs/oled-tvs/all-oled-tvs/QN55S95DAFXZA/gallery/QN55S95DAFXZA_001_Front_Black.jpg' }),

  tv({ id: 'samsung-s95d-65', name: 'Samsung S95D 65"', brand: 'Samsung', year: '2024',
    specs: { screenSize: '65"', resolution: '4K UHD', panel: 'QD-OLED', refreshRate: '144Hz', hdr: 'HDR10+', os: 'Tizen', ports: '4x HDMI 2.1' },
    imageUrl: 'https://image-us.samsung.com/us/televisions-home-theater/tvs/oled-tvs/all-oled-tvs/QN65S95DAFXZA/gallery/QN65S95DAFXZA_001_Front_Black.jpg' }),

  tv({ id: 'samsung-qn90d-65', name: 'Samsung QN90D 65"', brand: 'Samsung', year: '2024',
    specs: { screenSize: '65"', resolution: '4K UHD', panel: 'Neo QLED', refreshRate: '144Hz', hdr: 'HDR10+', os: 'Tizen', ports: '4x HDMI 2.1' },
    imageUrl: 'https://image-us.samsung.com/us/televisions-home-theater/tvs/qled-tvs/all-qled-tvs/QN65QN90DAFXZA/gallery/QN65QN90DAFXZA_001_Front_Black.jpg' }),

  tv({ id: 'samsung-qn90d-75', name: 'Samsung QN90D 75"', brand: 'Samsung', year: '2024',
    specs: { screenSize: '75"', resolution: '4K UHD', panel: 'Neo QLED', refreshRate: '144Hz', hdr: 'HDR10+', os: 'Tizen', ports: '4x HDMI 2.1' },
    imageUrl: 'https://image-us.samsung.com/us/televisions-home-theater/tvs/qled-tvs/all-qled-tvs/QN75QN90DAFXZA/gallery/QN75QN90DAFXZA_001_Front_Black.jpg' }),

  tv({ id: 'samsung-the-frame-55', name: 'Samsung The Frame 55"', brand: 'Samsung', year: '2024',
    specs: { screenSize: '55"', resolution: '4K UHD', panel: 'QLED', refreshRate: '60Hz', hdr: 'HDR10+', os: 'Tizen', ports: '3x HDMI 2.0' },
    imageUrl: 'https://image-us.samsung.com/us/televisions-home-theater/tvs/the-frame/all-the-frame-tvs/QN55LS03DAFXZA/gallery/QN55LS03DAFXZA_001_Front_Black.jpg' }),

  tv({ id: 'samsung-the-frame-65', name: 'Samsung The Frame 65"', brand: 'Samsung', year: '2024',
    specs: { screenSize: '65"', resolution: '4K UHD', panel: 'QLED', refreshRate: '60Hz', hdr: 'HDR10+', os: 'Tizen', ports: '3x HDMI 2.0' },
    imageUrl: 'https://image-us.samsung.com/us/televisions-home-theater/tvs/the-frame/all-the-frame-tvs/QN65LS03DAFXZA/gallery/QN65LS03DAFXZA_001_Front_Black.jpg' }),

  tv({ id: 'samsung-crystal-uhd-50', name: 'Samsung Crystal UHD 50"', brand: 'Samsung', year: '2024',
    specs: { screenSize: '50"', resolution: '4K UHD', panel: 'LED', refreshRate: '60Hz', hdr: 'HDR10+', os: 'Tizen', ports: '2x HDMI 2.0' },
    imageUrl: 'https://image-us.samsung.com/us/televisions-home-theater/tvs/crystal-uhd-tvs/all-crystal-uhd-tvs/UN50CU8000FXZA/gallery/UN50CU8000FXZA_001_Front_Black.jpg' }),

  // LG
  tv({ id: 'lg-c4-48', name: 'LG C4 48"', brand: 'LG', year: '2024',
    specs: { screenSize: '48"', resolution: '4K UHD', panel: 'OLED evo', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'webOS 24', ports: '4x HDMI 2.1' },
    imageUrl: 'https://gscs-b2c.lge.com/downloadFile?fileId=zvvNNKfHPLtLAFEPNf5aBg' }),

  tv({ id: 'lg-c4-55', name: 'LG C4 55"', brand: 'LG', year: '2024',
    specs: { screenSize: '55"', resolution: '4K UHD', panel: 'OLED evo', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'webOS 24', ports: '4x HDMI 2.1' },
    imageUrl: 'https://gscs-b2c.lge.com/downloadFile?fileId=jgLM7FIW7UvV7jWXE95nAg' }),

  tv({ id: 'lg-c4-65', name: 'LG C4 65"', brand: 'LG', year: '2024',
    specs: { screenSize: '65"', resolution: '4K UHD', panel: 'OLED evo', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'webOS 24', ports: '4x HDMI 2.1' },
    imageUrl: 'https://gscs-b2c.lge.com/downloadFile?fileId=2M9y9Mz2aR7kFD4DpBqYfg' }),

  tv({ id: 'lg-c4-77', name: 'LG C4 77"', brand: 'LG', year: '2024',
    specs: { screenSize: '77"', resolution: '4K UHD', panel: 'OLED evo', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'webOS 24', ports: '4x HDMI 2.1' },
    imageUrl: 'https://gscs-b2c.lge.com/downloadFile?fileId=4oJ9GolDrHPFb0s2GrGNOA' }),

  tv({ id: 'lg-g4-65', name: 'LG G4 65"', brand: 'LG', year: '2024',
    specs: { screenSize: '65"', resolution: '4K UHD', panel: 'OLED evo MLA', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'webOS 24', ports: '4x HDMI 2.1' },
    imageUrl: 'https://gscs-b2c.lge.com/downloadFile?fileId=sG9pMt7EFmhq5XNK7J7N6g' }),

  tv({ id: 'lg-g4-77', name: 'LG G4 77"', brand: 'LG', year: '2024',
    specs: { screenSize: '77"', resolution: '4K UHD', panel: 'OLED evo MLA', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'webOS 24', ports: '4x HDMI 2.1' },
    imageUrl: 'https://gscs-b2c.lge.com/downloadFile?fileId=jRpQL3hP9mNlhP6DQUiIGQ' }),

  tv({ id: 'lg-nano75-50', name: 'LG NANO75 50"', brand: 'LG', year: '2024',
    specs: { screenSize: '50"', resolution: '4K UHD', panel: 'NanoCell LED', refreshRate: '60Hz', hdr: 'HDR10', os: 'webOS 24', ports: '3x HDMI 2.0' },
    imageUrl: 'https://gscs-b2c.lge.com/downloadFile?fileId=vXkLPvt0Zv3Q2sSAMrFOtA' }),

  // Sony
  tv({ id: 'sony-a95l-65', name: 'Sony A95L 65"', brand: 'Sony', year: '2023',
    specs: { screenSize: '65"', resolution: '4K UHD', panel: 'QD-OLED', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'Google TV', ports: '4x HDMI 2.1' },
    imageUrl: 'https://www.sony.com/image/85b5b4e0d3254c01bda8aace1e16ba18?fmt=pjpeg&wid=660&bgcolor=FFFFFF&bgc=FFFFFF' }),

  tv({ id: 'sony-a95l-77', name: 'Sony A95L 77"', brand: 'Sony', year: '2023',
    specs: { screenSize: '77"', resolution: '4K UHD', panel: 'QD-OLED', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'Google TV', ports: '4x HDMI 2.1' },
    imageUrl: 'https://www.sony.com/image/85b5b4e0d3254c01bda8aace1e16ba18?fmt=pjpeg&wid=660&bgcolor=FFFFFF&bgc=FFFFFF' }),

  tv({ id: 'sony-x90l-65', name: 'Sony X90L 65"', brand: 'Sony', year: '2023',
    specs: { screenSize: '65"', resolution: '4K UHD', panel: 'Full-Array LED', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'Google TV', ports: '4x HDMI 2.1' },
    imageUrl: 'https://www.sony.com/image/3f8eca03da46c36b5a90a6a3ad66ff44?fmt=pjpeg&wid=660&bgcolor=FFFFFF&bgc=FFFFFF' }),

  // TCL
  tv({ id: 'tcl-6-series-r655-55', name: 'TCL 6-Series R655 55"', brand: 'TCL', year: '2023',
    specs: { screenSize: '55"', resolution: '4K UHD', panel: 'Mini-LED QLED', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'Roku TV', ports: '4x HDMI 2.1' },
    imageUrl: 'https://www.tcl.com/content/dam/tcl/product-images/us/55R655.png' }),

  tv({ id: 'tcl-6-series-r655-65', name: 'TCL 6-Series R655 65"', brand: 'TCL', year: '2023',
    specs: { screenSize: '65"', resolution: '4K UHD', panel: 'Mini-LED QLED', refreshRate: '120Hz', hdr: 'Dolby Vision', os: 'Roku TV', ports: '4x HDMI 2.1' },
    imageUrl: 'https://www.tcl.com/content/dam/tcl/product-images/us/65R655.png' }),

  tv({ id: 'tcl-5-series-s555-55', name: 'TCL 5-Series S555 55"', brand: 'TCL', year: '2023',
    specs: { screenSize: '55"', resolution: '4K UHD', panel: 'QLED', refreshRate: '60Hz', hdr: 'Dolby Vision', os: 'Roku TV', ports: '3x HDMI 2.0' },
    imageUrl: 'https://www.tcl.com/content/dam/tcl/product-images/us/55S555.png' }),

  // Hisense
  tv({ id: 'hisense-u8-55', name: 'Hisense U8 55"', brand: 'Hisense', year: '2024',
    specs: { screenSize: '55"', resolution: '4K UHD', panel: 'Mini-LED QLED', refreshRate: '144Hz', hdr: 'Dolby Vision', os: 'Google TV', ports: '4x HDMI 2.1' },
    imageUrl: 'https://www.hisense-usa.com/content/dam/hisense-usa/products/tvs/U8N/55U8N/55U8N-Hero.png' }),

  tv({ id: 'hisense-u8-65', name: 'Hisense U8 65"', brand: 'Hisense', year: '2024',
    specs: { screenSize: '65"', resolution: '4K UHD', panel: 'Mini-LED QLED', refreshRate: '144Hz', hdr: 'Dolby Vision', os: 'Google TV', ports: '4x HDMI 2.1' },
    imageUrl: 'https://www.hisense-usa.com/content/dam/hisense-usa/products/tvs/U8N/65U8N/65U8N-Hero.png' }),

  tv({ id: 'hisense-u6-55', name: 'Hisense U6 55"', brand: 'Hisense', year: '2024',
    specs: { screenSize: '55"', resolution: '4K UHD', panel: 'QLED', refreshRate: '60Hz', hdr: 'HDR10+', os: 'Google TV', ports: '3x HDMI 2.0' },
    imageUrl: 'https://www.hisense-usa.com/content/dam/hisense-usa/products/tvs/U6N/55U6N/55U6N-Hero.png' }),
];

// ─── GPUs ─────────────────────────────────────────────────────────────────────
const GPUS = [
  // NVIDIA RTX 40-series
  gpu({ id: 'nvidia-rtx-4090', name: 'GeForce RTX 4090', brand: 'NVIDIA', year: '2022',
    specs: { vram: '24GB GDDR6X', architecture: 'Ada Lovelace', tdp: '450W', cudaOrStreams: '16,384 CUDA', memoryBandwidth: '1,008 GB/s', interface: 'PCIe 4.0 x16', length: '336mm' },
    imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4090/geforce-ada-4090-web-oc-1920x1080.jpg' }),

  gpu({ id: 'nvidia-rtx-4080-super', name: 'GeForce RTX 4080 SUPER', brand: 'NVIDIA', year: '2024',
    specs: { vram: '16GB GDDR6X', architecture: 'Ada Lovelace', tdp: '320W', cudaOrStreams: '10,240 CUDA', memoryBandwidth: '736 GB/s', interface: 'PCIe 4.0 x16', length: '304mm' },
    imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4080-super/geforce-ada-4080S-web-oc-1920x1080.jpg' }),

  gpu({ id: 'nvidia-rtx-4080', name: 'GeForce RTX 4080', brand: 'NVIDIA', year: '2022',
    specs: { vram: '16GB GDDR6X', architecture: 'Ada Lovelace', tdp: '320W', cudaOrStreams: '9,728 CUDA', memoryBandwidth: '716.8 GB/s', interface: 'PCIe 4.0 x16', length: '336mm' },
    imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4080/geforce-ada-4080-web-oc-1920x1080.jpg' }),

  gpu({ id: 'nvidia-rtx-4070-ti-super', name: 'GeForce RTX 4070 Ti SUPER', brand: 'NVIDIA', year: '2024',
    specs: { vram: '16GB GDDR6X', architecture: 'Ada Lovelace', tdp: '285W', cudaOrStreams: '8,448 CUDA', memoryBandwidth: '672 GB/s', interface: 'PCIe 4.0 x16', length: '285mm' },
    imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4070-ti-super/geforce-ada-4070TIS-web-oc-1920x1080.jpg' }),

  gpu({ id: 'nvidia-rtx-4070-super', name: 'GeForce RTX 4070 SUPER', brand: 'NVIDIA', year: '2024',
    specs: { vram: '12GB GDDR6X', architecture: 'Ada Lovelace', tdp: '220W', cudaOrStreams: '7,168 CUDA', memoryBandwidth: '504 GB/s', interface: 'PCIe 4.0 x16', length: '240mm' },
    imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4070-super/geforce-ada-4070S-web-oc-1920x1080.jpg' }),

  gpu({ id: 'nvidia-rtx-4070', name: 'GeForce RTX 4070', brand: 'NVIDIA', year: '2023',
    specs: { vram: '12GB GDDR6X', architecture: 'Ada Lovelace', tdp: '200W', cudaOrStreams: '5,888 CUDA', memoryBandwidth: '504 GB/s', interface: 'PCIe 4.0 x16', length: '240mm' },
    imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4070/geforce-ada-4070-web-oc-1920x1080.jpg' }),

  gpu({ id: 'nvidia-rtx-4060-ti-16gb', name: 'GeForce RTX 4060 Ti 16GB', brand: 'NVIDIA', year: '2023',
    specs: { vram: '16GB GDDR6', architecture: 'Ada Lovelace', tdp: '165W', cudaOrStreams: '4,352 CUDA', memoryBandwidth: '288 GB/s', interface: 'PCIe 4.0 x8', length: '240mm' },
    imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4060-ti/geforce-ada-4060ti-web-oc-1920x1080.jpg' }),

  gpu({ id: 'nvidia-rtx-4060-ti', name: 'GeForce RTX 4060 Ti', brand: 'NVIDIA', year: '2023',
    specs: { vram: '8GB GDDR6', architecture: 'Ada Lovelace', tdp: '160W', cudaOrStreams: '4,352 CUDA', memoryBandwidth: '288 GB/s', interface: 'PCIe 4.0 x8', length: '240mm' },
    imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4060-ti/geforce-ada-4060ti-web-oc-1920x1080.jpg' }),

  gpu({ id: 'nvidia-rtx-4060', name: 'GeForce RTX 4060', brand: 'NVIDIA', year: '2023',
    specs: { vram: '8GB GDDR6', architecture: 'Ada Lovelace', tdp: '115W', cudaOrStreams: '3,072 CUDA', memoryBandwidth: '272 GB/s', interface: 'PCIe 4.0 x8', length: '240mm' },
    imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4060/geforce-ada-4060-web-oc-1920x1080.jpg' }),

  gpu({ id: 'nvidia-rtx-3090-ti', name: 'GeForce RTX 3090 Ti', brand: 'NVIDIA', year: '2022',
    specs: { vram: '24GB GDDR6X', architecture: 'Ampere', tdp: '450W', cudaOrStreams: '10,752 CUDA', memoryBandwidth: '1,008 GB/s', interface: 'PCIe 4.0 x16', length: '336mm' },
    imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090-ti/rtx-3090-ti-oc-1920x1080.jpg' }),

  // AMD
  gpu({ id: 'amd-rx-7900-xtx', name: 'Radeon RX 7900 XTX', brand: 'AMD', year: '2022',
    specs: { vram: '24GB GDDR6', architecture: 'RDNA 3', tdp: '355W', cudaOrStreams: '6,144 Stream', memoryBandwidth: '960 GB/s', interface: 'PCIe 4.0 x16', length: '287mm' },
    imageUrl: 'https://www.amd.com/system/files/2022-11/1207752-amd-radeon-rx-7900-xtx-og-1200x628.jpg' }),

  gpu({ id: 'amd-rx-7900-xt', name: 'Radeon RX 7900 XT', brand: 'AMD', year: '2022',
    specs: { vram: '20GB GDDR6', architecture: 'RDNA 3', tdp: '315W', cudaOrStreams: '5,376 Stream', memoryBandwidth: '800 GB/s', interface: 'PCIe 4.0 x16', length: '287mm' },
    imageUrl: 'https://www.amd.com/system/files/2022-11/1207752-amd-radeon-rx-7900-xt-og-1200x628.jpg' }),

  gpu({ id: 'amd-rx-7800-xt', name: 'Radeon RX 7800 XT', brand: 'AMD', year: '2023',
    specs: { vram: '16GB GDDR6', architecture: 'RDNA 3', tdp: '263W', cudaOrStreams: '3,840 Stream', memoryBandwidth: '624 GB/s', interface: 'PCIe 4.0 x16', length: '267mm' },
    imageUrl: 'https://www.amd.com/system/files/2023-08/1282944-amd-radeon-rx-7800-xt-og-1200x628.jpg' }),

  gpu({ id: 'amd-rx-7700-xt', name: 'Radeon RX 7700 XT', brand: 'AMD', year: '2023',
    specs: { vram: '12GB GDDR6', architecture: 'RDNA 3', tdp: '245W', cudaOrStreams: '3,456 Stream', memoryBandwidth: '432 GB/s', interface: 'PCIe 4.0 x8', length: '267mm' },
    imageUrl: 'https://www.amd.com/system/files/2023-08/1282944-amd-radeon-rx-7700-xt-og-1200x628.jpg' }),

  gpu({ id: 'amd-rx-7600-xt', name: 'Radeon RX 7600 XT', brand: 'AMD', year: '2024',
    specs: { vram: '16GB GDDR6', architecture: 'RDNA 3', tdp: '190W', cudaOrStreams: '2,048 Stream', memoryBandwidth: '288 GB/s', interface: 'PCIe 4.0 x8', length: '240mm' },
    imageUrl: 'https://www.amd.com/system/files/2024-01/amd-radeon-rx-7600-xt-og-1200x628.jpg' }),

  // Intel Arc
  gpu({ id: 'intel-arc-a770-16gb', name: 'Arc A770 16GB', brand: 'Intel', year: '2022',
    specs: { vram: '16GB GDDR6', architecture: 'Alchemist', tdp: '225W', cudaOrStreams: '4,096 Xe Cores', memoryBandwidth: '560 GB/s', interface: 'PCIe 4.0 x16', length: '272mm' },
    imageUrl: 'https://www.intel.com/content/dam/www/public/us/en/images/photography-consumer/rwd/arc-a770-graphics-card-rwd.png' }),

  gpu({ id: 'intel-arc-a750', name: 'Arc A750', brand: 'Intel', year: '2022',
    specs: { vram: '8GB GDDR6', architecture: 'Alchemist', tdp: '225W', cudaOrStreams: '3,584 Xe Cores', memoryBandwidth: '512 GB/s', interface: 'PCIe 4.0 x16', length: '272mm' },
    imageUrl: 'https://www.intel.com/content/dam/www/public/us/en/images/photography-consumer/rwd/arc-a750-graphics-card-rwd.png' }),
];

// ─── SOUND SYSTEMS ────────────────────────────────────────────────────────────
const SOUND_SYSTEMS = [
  // Sonos
  soundsystem({ id: 'sonos-arc-ultra', name: 'Sonos Arc Ultra', brand: 'Sonos', year: '2024',
    specs: { type: 'Soundbar', channels: '9.1.4', power: 'N/A (DSP-driven)', connectivity: 'HDMI eARC, Wi-Fi 6, AirPlay 2', dolby: 'Dolby Atmos', subwoofer: 'Optional (Sonos Sub)', dimensions: '1141 x 87 x 115mm' },
    imageUrl: 'https://www.sonos.com/on/demandware.static/-/Sites-sonos-us/default/dw897d7ced/images/PDPImages/ARC-ULTRA/sonos-arc-ultra-hero-white.png' }),

  soundsystem({ id: 'sonos-arc', name: 'Sonos Arc', brand: 'Sonos', year: '2020',
    specs: { type: 'Soundbar', channels: '5.0.2', power: 'N/A (DSP-driven)', connectivity: 'HDMI ARC, Wi-Fi, AirPlay 2', dolby: 'Dolby Atmos', subwoofer: 'Optional (Sonos Sub)', dimensions: '1141 x 87 x 115mm' },
    imageUrl: 'https://www.sonos.com/on/demandware.static/-/Sites-sonos-us/default/dw85869d62/images/PDPImages/ARC/sonos-arc-pdp-black.png' }),

  soundsystem({ id: 'sonos-beam-gen2', name: 'Sonos Beam Gen 2', brand: 'Sonos', year: '2021',
    specs: { type: 'Soundbar (compact)', channels: '3.0.2', power: 'N/A (DSP-driven)', connectivity: 'HDMI ARC, Wi-Fi, AirPlay 2', dolby: 'Dolby Atmos', subwoofer: 'Optional', dimensions: '651 x 69 x 100mm' },
    imageUrl: 'https://www.sonos.com/on/demandware.static/-/Sites-sonos-us/default/dw31cee965/images/PDPImages/BEAM/sonos-beam-pdp-black.png' }),

  soundsystem({ id: 'sonos-era-300', name: 'Sonos Era 300', brand: 'Sonos', year: '2023',
    specs: { type: 'Wireless Speaker', channels: '4.0.2', power: 'N/A', connectivity: 'Wi-Fi 6, Bluetooth, AirPlay 2', dolby: 'Dolby Atmos (spatial audio)', subwoofer: 'N/A', dimensions: '260 x 185 x 157mm' },
    imageUrl: 'https://www.sonos.com/on/demandware.static/-/Sites-sonos-us/default/dw93e4eb9e/images/PDPImages/ERA300/sonos-era-300-pdp-black.png' }),

  soundsystem({ id: 'sonos-era-100', name: 'Sonos Era 100', brand: 'Sonos', year: '2023',
    specs: { type: 'Wireless Speaker', channels: '2.0', power: 'N/A', connectivity: 'Wi-Fi 6, Bluetooth, AirPlay 2', dolby: 'N/A', subwoofer: 'N/A', dimensions: '120 x 193 x 143mm' },
    imageUrl: 'https://www.sonos.com/on/demandware.static/-/Sites-sonos-us/default/dw9f4e0ed6/images/PDPImages/ERA100/sonos-era-100-pdp-black.png' }),

  // Bose
  soundsystem({ id: 'bose-smart-soundbar-900', name: 'Smart Soundbar 900', brand: 'Bose', year: '2021',
    specs: { type: 'Soundbar', channels: '7.0.2', power: 'N/A (DSP-driven)', connectivity: 'HDMI eARC, Wi-Fi, Bluetooth, AirPlay 2', dolby: 'Dolby Atmos', subwoofer: 'Optional (Bass Module)', dimensions: '1097 x 58 x 109mm' },
    imageUrl: 'https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/speakers/bose_smart_soundbar_900/product_silo_images/bose-smart-soundbar-900-black-right.png/jcr:content/renditions/cq5dam.web.600.600.png' }),

  soundsystem({ id: 'bose-smart-soundbar-600', name: 'Smart Soundbar 600', brand: 'Bose', year: '2022',
    specs: { type: 'Soundbar', channels: '5.0.2', power: 'N/A (DSP-driven)', connectivity: 'HDMI eARC, Wi-Fi, Bluetooth, AirPlay 2', dolby: 'Dolby Atmos', subwoofer: 'Optional', dimensions: '838 x 54 x 109mm' },
    imageUrl: 'https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/speakers/bose_smart_soundbar_600/product_silo_images/bose-smart-soundbar-600-black-front.png/jcr:content/renditions/cq5dam.web.600.600.png' }),

  soundsystem({ id: 'bose-tv-speaker', name: 'Bose TV Speaker', brand: 'Bose', year: '2020',
    specs: { type: 'Soundbar (entry)', channels: '2.0', power: 'N/A', connectivity: 'Optical, HDMI ARC, Bluetooth', dolby: 'N/A', subwoofer: 'N/A', dimensions: '584 x 63 x 89mm' },
    imageUrl: 'https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/speakers/bose_tv_speaker/product_silo_images/bosetvspeaker_black_front.png/jcr:content/renditions/cq5dam.web.600.600.png' }),

  // Samsung
  soundsystem({ id: 'samsung-hw-q990d', name: 'HW-Q990D', brand: 'Samsung', year: '2024',
    specs: { type: 'Soundbar System', channels: '11.1.4', power: '656W', connectivity: 'HDMI eARC, Wi-Fi, Bluetooth', dolby: 'Dolby Atmos', subwoofer: 'Wireless Sub included', dimensions: '1232 x 64 x 136mm (bar)' },
    imageUrl: 'https://image-us.samsung.com/us/home-theater/soundbars/all-soundbars/HW-Q990D/gallery/HW-Q990D_001_Front_Titan-Black.jpg' }),

  soundsystem({ id: 'samsung-hw-s801d', name: 'HW-S801D', brand: 'Samsung', year: '2024',
    specs: { type: 'Soundbar (slim)', channels: '3.1.2', power: '330W', connectivity: 'HDMI eARC, Wi-Fi, Bluetooth', dolby: 'Dolby Atmos', subwoofer: 'Built-in', dimensions: '980 x 46 x 117mm' },
    imageUrl: 'https://image-us.samsung.com/us/home-theater/soundbars/all-soundbars/HW-S801D/gallery/HW-S801D_001_Front_Black.jpg' }),

  soundsystem({ id: 'samsung-hw-b550', name: 'HW-B550', brand: 'Samsung', year: '2022',
    specs: { type: 'Soundbar System', channels: '2.1', power: '410W', connectivity: 'HDMI ARC, Bluetooth', dolby: 'Dolby Audio', subwoofer: 'Wireless Sub included', dimensions: '700 x 55 x 85mm (bar)' },
    imageUrl: 'https://image-us.samsung.com/us/home-theater/soundbars/all-soundbars/HW-B550/gallery/HW-B550_001_Front_Black.jpg' }),

  // JBL
  soundsystem({ id: 'jbl-bar-1300', name: 'JBL Bar 1300', brand: 'JBL', year: '2023',
    specs: { type: 'Soundbar System', channels: '11.1.4', power: '1170W', connectivity: 'HDMI eARC, Wi-Fi, Bluetooth, AirPlay 2', dolby: 'Dolby Atmos', subwoofer: 'Wireless Sub included', dimensions: '1300 x 64 x 152mm (bar)' },
    imageUrl: 'https://www.jbl.com/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw6c53e3f3/JBL_BAR_1300_Soundbar_JBLBAR1300BLKAM_Hero.png' }),

  soundsystem({ id: 'jbl-bar-800', name: 'JBL Bar 800', brand: 'JBL', year: '2023',
    specs: { type: 'Soundbar System', channels: '5.1.2', power: '720W', connectivity: 'HDMI eARC, Wi-Fi, Bluetooth, AirPlay 2', dolby: 'Dolby Atmos', subwoofer: 'Wireless Sub included', dimensions: '890 x 64 x 152mm (bar)' },
    imageUrl: 'https://www.jbl.com/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw9a5a9db1/JBL_BAR_800_Soundbar_JBLBAR800BLKAM_Hero.png' }),

  soundsystem({ id: 'jbl-bar-500', name: 'JBL Bar 500', brand: 'JBL', year: '2023',
    specs: { type: 'Soundbar System', channels: '5.1', power: '590W', connectivity: 'HDMI eARC, Wi-Fi, Bluetooth, AirPlay 2', dolby: 'Dolby Atmos', subwoofer: 'Wireless Sub included', dimensions: '700 x 57 x 136mm (bar)' },
    imageUrl: 'https://www.jbl.com/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw7e9a8a7f/JBL_BAR_500_Soundbar_JBLBAR500BLKAM_Hero.png' }),

  soundsystem({ id: 'jbl-authentics-500', name: 'JBL Authentics 500', brand: 'JBL', year: '2023',
    specs: { type: 'Smart Home Speaker', channels: '3.0', power: '270W', connectivity: 'Wi-Fi, Bluetooth, AirPlay 2', dolby: 'N/A', subwoofer: 'Built-in 6.5" woofer', dimensions: '270 x 414 x 270mm' },
    imageUrl: 'https://www.jbl.com/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw4e3a8b7f/JBL_AUTHENTICS_500_Hero.png' }),
];

// ─── Build & Write ────────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  ...PHONES,
  ...LAPTOPS,
  ...HEADPHONES,
  ...TVS,
  ...GPUS,
  ...SOUND_SYSTEMS,
];

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(ALL_PRODUCTS, null, 2));

console.log(`✓ Seeded ${ALL_PRODUCTS.length} products → ${OUT_FILE}`);
console.table(
  Object.entries(
    ALL_PRODUCTS.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count }))
);
