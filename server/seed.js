require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI missing in server/.env — please add your connection string with password replaced');
  process.exit(1);
}

const PRODUCTS = [
  {
    productId: 1,
    name: 'Adjustable Dumbbell Set',
    brand: 'PowerFlex',
    category: 'Equipment',
    price: 15999,
    originalPrice: 17999,
    rating: 4.8,
    reviews: 214,
    badge: 'Best Seller',
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSS1FadeaSIlLechl5PE2tgT7CQRhmGjdOcb5RFz01v4peREYrgmWi9_-Q4i7z8pw1V8uaxYBTHr9Id3WZClayDXQDFJ24JgPWB678qfUfPT52cl5BDvxmQFw0',
    stock: 25,
    reserved: 3
  },
  {
    productId: 2,
    name: 'Whey Protein Isolate',
    brand: 'NutriCore',
    category: 'Nutrition',
    price: 3299,
    originalPrice: 3999,
    rating: 4.9,
    reviews: 531,
    badge: 'Verified',
    image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/msc/msc71758/l/9.jpg',
    stock: 120,
    reserved: 15
  },
  {
    productId: 3,
    name: 'Resistance Band Kit',
    brand: 'FlexBand',
    category: 'Equipment',
    price: 1499,
    originalPrice: null,
    rating: 4.7,
    reviews: 88,
    badge: null,
    image: 'https://m.media-amazon.com/images/I/71-87y93B+L._AC_UF894,1000_QL80_.jpg',
    stock: 75,
    reserved: 8
  },
  {
    productId: 4,
    name: 'Creatine Monohydrate',
    brand: 'NutriCore',
    category: 'Nutrition',
    price: 1899,
    originalPrice: 2299,
    rating: 4.8,
    reviews: 312,
    badge: 'Verified',
    image: 'https://m.media-amazon.com/images/I/61kotip5wIL._AC_UF1000,1000_QL80_.jpg',
    stock: 90,
    reserved: 12
  },
  {
    productId: 5,
    name: 'Smart Fitness Watch',
    brand: 'VitalSync',
    category: 'Wearables',
    price: 7999,
    originalPrice: 9499,
    rating: 4.6,
    reviews: 167,
    badge: 'New',
    image: 'https://m.media-amazon.com/images/I/61Bugm3Wo+L.jpg',
    stock: 30,
    reserved: 5
  },
  {
    productId: 6,
    name: 'Yoga Mat Pro',
    brand: 'ZenFlow',
    category: 'Equipment',
    price: 2199,
    originalPrice: null,
    rating: 4.7,
    reviews: 95,
    badge: null,
    image: 'https://m.media-amazon.com/images/I/61KZlPKYscL._AC_UF894,1000_QL80_.jpg',
    stock: 50,
    reserved: 4
  },
  {
    productId: 7,
    name: 'Pre-Workout Formula',
    brand: 'NutriCore',
    category: 'Nutrition',
    price: 2599,
    originalPrice: 2999,
    rating: 4.5,
    reviews: 78,
    badge: null,
    image: 'https://m.media-amazon.com/images/I/81iTFIGL+2L._AC_UF1000,1000_QL80_.jpg',
    stock: 65,
    reserved: 7
  },
  {
    productId: 8,
    name: 'Pull-Up Bar',
    brand: 'IronGrip',
    category: 'Equipment',
    price: 3499,
    originalPrice: null,
    rating: 4.8,
    reviews: 203,
    badge: 'Best Seller',
    image: 'https://m.media-amazon.com/images/I/519Am+Kv0SL._AC_UF894,1000_QL80_.jpg',
    stock: 40,
    reserved: 6
  },
  // New products — mixed order below (Equipment, Nutrition, Wearables)
  {
    productId: 9,
    name: 'Mass Gainer',
    brand: 'NutriCore',
    category: 'Nutrition',
    price: 1999,
    originalPrice: 2499,
    rating: 4.6,
    reviews: 142,
    badge: null,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwD-kcQRKy0R4Ps7N5nsU4o55z719DjGVXQB2yRqce3A&s',
    stock: 85,
    reserved: 9
  },
  {
    productId: 10,
    name: 'Smart Weighing Scale',
    brand: 'VitalSync',
    category: 'Wearables',
    price: 2999,
    originalPrice: 3899,
    rating: 4.7,
    reviews: 176,
    badge: null,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-HGK2FasryHp8nqI9Uo1dD2onnCmOcA_Nt-33Etbg8Q&s=10',
    stock: 45,
    reserved: 6
  },
  {
    productId: 11,
    name: 'Kettlebell Set',
    brand: 'PowerFlex',
    category: 'Equipment',
    price: 3499,
    originalPrice: 4299,
    rating: 4.8,
    reviews: 198,
    badge: 'New',
    image: 'https://nwscdn.com/media/catalog/product/cache/h900xw900/f/o/forza-pro-cast-iron-kettlebell-family_10.jpg',
    stock: 35,
    reserved: 5
  },
  {
    productId: 12,
    name: 'BCAA',
    brand: 'NutriCore',
    category: 'Nutrition',
    price: 1499,
    originalPrice: 1799,
    rating: 4.5,
    reviews: 89,
    badge: null,
    image: 'https://www.lifenowhealth.com/cdn/shop/files/BCAA-ORANGE.jpg?v=1695894694&width=2200',
    stock: 70,
    reserved: 8
  },
  {
    productId: 13,
    name: 'Posture Corrector',
    brand: 'FlexBand',
    category: 'Wearables',
    price: 1099,
    originalPrice: 1399,
    rating: 4.4,
    reviews: 121,
    badge: null,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW1AlOPEn9KNdBP874WZcvpAKLScEO6u1pbQPPn3qE_g&s=10',
    stock: 60,
    reserved: 7
  },
  {
    productId: 14,
    name: 'Foam Roller',
    brand: 'ZenFlow',
    category: 'Equipment',
    price: 1299,
    originalPrice: 1799,
    rating: 4.6,
    reviews: 143,
    badge: null,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc8cx1oQswdbvax1R-ZZK8sPvnZ5yXqPikMP3AG-nQhw&s=10',
    stock: 55,
    reserved: 6
  },
  {
    productId: 15,
    name: 'Multivitamin Tablets',
    brand: 'HealthCore',
    category: 'Nutrition',
    price: 449,
    originalPrice: null,
    rating: 4.7,
    reviews: 267,
    badge: 'Verified',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVge656sBTAZ9XrqgLLZ1wfXOlkGjWEgjfhWgvzWOAcw&s=10',
    stock: 200,
    reserved: 20
  },
  {
    productId: 16,
    name: 'Full Compression Wear Set',
    brand: 'FlexBand',
    category: 'Wearables',
    price: 1999,
    originalPrice: 2599,
    rating: 4.5,
    reviews: 98,
    badge: null,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS3E9iElOz7xapI7SWgGyz9F7cXWHGBxuz_isK3Z1Ldg&s',
    stock: 50,
    reserved: 5
  },
  {
    productId: 17,
    name: 'Skipping Rope',
    brand: 'PowerFlex',
    category: 'Equipment',
    price: 499,
    originalPrice: null,
    rating: 4.8,
    reviews: 312,
    badge: 'Best Seller',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtVUqSjH2jzr8JWYmtkGaUowhAFalxK6eK_RJMZdIdzw&s=10',
    stock: 120,
    reserved: 12
  },
  {
    productId: 18,
    name: 'Fish Oil',
    brand: 'HealthCore',
    category: 'Nutrition',
    price: 899,
    originalPrice: 1199,
    rating: 4.6,
    reviews: 156,
    badge: null,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzpBblWQcWZk6XN0XB9_YPI53HFkWciYqf8MVi9IiGhg&s',
    stock: 95,
    reserved: 10
  },
  {
    productId: 19,
    name: 'GPS Running Watch',
    brand: 'VitalSync',
    category: 'Wearables',
    price: 9999,
    originalPrice: 12999,
    rating: 4.7,
    reviews: 134,
    badge: 'New',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbthcoprfyV88OaGdmb3RaNYHzrwkvMeX3PCTaiEjCxg&s=10',
    stock: 25,
    reserved: 3
  },
  {
    productId: 20,
    name: 'Adjustable Bench',
    brand: 'IronGrip',
    category: 'Equipment',
    price: 4999,
    originalPrice: 6499,
    rating: 4.8,
    reviews: 189,
    badge: null,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwjpqhlyDthLP_4l5rdIwd7YBn0Ylnr357F9bj2zgbMQ&s=10',
    stock: 30,
    reserved: 4
  },
  {
    productId: 21,
    name: 'Peanut Butter',
    brand: 'NutriCore',
    category: 'Nutrition',
    price: 399,
    originalPrice: null,
    rating: 4.9,
    reviews: 445,
    badge: 'Best Seller',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUiz4GdC5FuAD4O0LXLRBtTUJggQQ9sDk4YqRaQUFNlQ&s',
    stock: 150,
    reserved: 18
  },
  {
    productId: 22,
    name: 'Biozyme Performance Whey',
    brand: 'MuscleBlaze',
    category: 'Whey Protein',
    weight: '1 kg',
    flavor: 'Rich Chocolate',
    price: 3899,
    originalPrice: 4999,
    rating: 4.5,
    image: 'https://img10.hkrtcdn.com/42058/prd_4205719-MuscleBlaze-Biozyme-Performance-Whey-2.2-lb-Kesar-Thandai_o.jpg',
    stock: 50,
    reserved: 0
  },
  {
    productId: 23,
    name: 'Micronised Creatine Monohydrate',
    brand: 'MuscleBlaze',
    category: 'Creatine',
    weight: '250 g',
    flavor: 'Unflavoured',
    price: 999,
    originalPrice: 1499,
    rating: 4.3,
    image: 'https://img2.hkrtcdn.com/38900/prd_3889981-MuscleBlaze-Micronised-Creatine-Monohydrate-Unflavoured-250-g_o.jpg',
    stock: 50,
    reserved: 0
  },
  {
    productId: 24,
    name: 'Biozyme Performance Whey',
    brand: 'MuscleBlaze',
    category: 'Whey Protein',
    weight: '2 kg',
    flavor: 'Rich Chocolate',
    price: 7599,
    originalPrice: 7799,
    rating: 4.5,
    image: 'https://img8.hkrtcdn.com/39078/prd_3907787-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg',
    stock: 50,
    reserved: 0
  },
  {
    productId: 25,
    name: 'Biozyme Performance Whey',
    brand: 'MuscleBlaze',
    category: 'Whey Protein',
    weight: '4 kg',
    flavor: 'Choco Crispers',
    price: 14399,
    originalPrice: 18999,
    rating: 4.5,
    image: 'https://img10.hkrtcdn.com/35778/prd_3577749-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Choco-Crispers_o.jpg',
    stock: 50,
    reserved: 0
  },
  {
    productId: 26,
    name: 'Micronised Creatine Monohydrate CreAMP Powder',
    brand: 'MuscleBlaze',
    category: 'Creatine',
    weight: '100 g',
    flavor: 'Unflavoured',
    price: 529,
    originalPrice: 699,
    rating: 4.2,
    reviews: 24635,
    badge: 'Top Brand',
    image: 'https://m.media-amazon.com/images/I/711l1FkCLaL._SY450_.jpg',
    productUrl: 'https://www.amazon.in/dp/B00LLZ82O4',
    stock: 50,
    reserved: 0
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, process.env.MONGO_DB ? { dbName: process.env.MONGO_DB } : undefined);
    console.log('Connected —', 'database:', mongoose.connection.name, 'host:', mongoose.connection.host, ' — seeding products');

    await Product.deleteMany({});
    const res = await Product.insertMany(PRODUCTS);
    console.log(`Inserted ${res.length} products`);

    await mongoose.disconnect();
    console.log('Disconnected. Seed complete.');
    // Clear product cache if available
    try {
      const cache = require('./lib/cache');
      if (cache && cache.clearAll) await cache.clearAll();
      console.log('Cleared product cache');
    } catch (err) {
      // ignore
    }
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    try { await mongoose.disconnect(); } catch (e) { }
    process.exit(1);
  }
}

if (require.main === module) {
  seed();
}

module.exports = { PRODUCTS };
