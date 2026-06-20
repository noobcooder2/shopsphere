require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');

const products = [
  // ── Electronics
  {
    name: 'MacBook Air M5',
    description: 'Apple MacBook Air with M5 chip, 13.6-inch Liquid Retina display, 16GB RAM, 512GB SSD. 18-hour battery life, fanless design.',
    price: 110290, originalPrice: 119900,
    category: 'Electronics', brand: 'Apple', stock: 25,
    images: ['https://images.unsplash.com/photo-1611186871525-7f926b7f1d28?w=600&q=80'],
  },
  {
    name: 'iPhone 16 Pro',
    description: 'Apple iPhone 16 Pro with A18 Pro chip, 48MP Fusion camera, ProMotion display and titanium design.',
    price: 119900, originalPrice: 134900,
    category: 'Electronics', brand: 'Apple', stock: 50,
    images: ['https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-1.jpg'],
  },
  {
    name: 'Samsung Galaxy S25 Ultra',
    description: 'Samsung flagship with Snapdragon 8 Elite, 200MP camera, built-in S Pen and 5000mAh battery.',
    price: 134999, originalPrice: 149999,
    category: 'Electronics', brand: 'Samsung', stock: 40,
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80'],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancelling wireless headphones. 30-hour battery, multipoint connection, crystal clear calls.',
    price: 24500, originalPrice: 34999,
    category: 'Electronics', brand: 'Sony', stock: 35,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'],
  },

  // ── Fashion
  {
    name: 'Nike Air Max 270',
    description: 'Lightweight running shoes with Max Air heel unit providing all-day comfort for any activity.',
    price: 6999, originalPrice: 9999,
    category: 'Fashion', brand: 'Nike', stock: 100,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
  },
  {
    name: "Levi's 501 Original Jeans",
    description: 'The original straight fit jean in classic stonewash blue since 1873. A true wardrobe essential.',
    price: 3999, originalPrice: 4999,
    category: 'Fashion', brand: "Levi's", stock: 80,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'],
  },
  {
    name: 'Zara Floral Midi Dress',
    description: 'Elegant floral print midi dress with V-neckline, perfect for casual and semi-formal occasions.',
    price: 2999, originalPrice: 4500,
    category: 'Fashion', brand: 'Zara', stock: 60,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80'],
  },

  // ── Home
  {
    name: 'Philips Air Fryer HD9200',
    description: '4.1L digital air fryer with Rapid Air technology. Cook crispy meals with 90% less oil.',
    price: 6999, originalPrice: 9999,
    category: 'Home', brand: 'Philips', stock: 35,
    images: ['https://images.unsplash.com/photo-1648566787428-d5c82c9c5879?w=600&q=80'],
  },
  {
    name: 'IKEA MICKE Study Desk',
    description: 'Modern minimalist study desk with drawer storage, 105x50cm. Easy home assembly.',
    price: 9999, originalPrice: 11999,
    category: 'Home', brand: 'IKEA', stock: 20,
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80'],
  },
  {
    name: 'Prestige Induction Cooktop',
    description: '1600W induction cooktop with 7 power levels, auto-off safety and feather touch controls.',
    price: 3999, originalPrice: 4999,
    category: 'Home', brand: 'Prestige', stock: 45,
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'],
  },

  // ── Sports
  {
    name: 'Yonex Arcsaber 11 Badminton Racket',
    description: 'High-flex graphite shaft for aggressive attacking play. Pre-strung and ready to play.',
    price: 2449, originalPrice: 3499,
    category: 'Sports', brand: 'Yonex', stock: 50,
    images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'],
  },
  {
    name: 'SG Scorer Classic Cricket Bat',
    description: 'Kashmir willow bat for intermediate players. Full size with English leather ball grip.',
    price: 2499, originalPrice: 2999,
    category: 'Sports', brand: 'SG', stock: 30,
    images: ['https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600&q=80'],
  },
  {
    name: 'Lifelong Yoga Mat 6mm',
    description: 'Anti-slip EVA foam yoga mat with body alignment lines and carry strap. 183cm x 61cm.',
    price: 999, originalPrice: 1299,
    category: 'Sports', brand: 'Lifelong', stock: 100,
    images: ['https://images.unsplash.com/photo-1601925228130-f70e0eba2c68?w=600&q=80'],
  },

  // ── Books
  {
    name: 'Atomic Habits',
    description: 'An Easy and Proven Way to Build Good Habits and Break Bad Ones. #1 NYT bestseller by James Clear.',
    price: 499, originalPrice: 799,
    category: 'Books', brand: 'Penguin', stock: 200,
    images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80'],
  },
  {
    name: 'Rich Dad Poor Dad',
    description: "What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not.",
    price: 399, originalPrice: 599,
    category: 'Books', brand: 'Simon & Schuster', stock: 150,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80'],
  },
  {
    name: 'The Alchemist',
    description: "Paulo Coelho's legendary fable about following your dream and listening to your heart.",
    price: 399, originalPrice: 499,
    category: 'Books', brand: 'HarperCollins', stock: 180,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80'],
  },

  // ── Beauty
  {
    name: 'Lakme Absolute Foundation',
    description: 'Full coverage matte liquid foundation with SPF 20. Available in 12 shades for Indian skin tones.',
    price: 899, originalPrice: 1299,
    category: 'Beauty', brand: 'Lakme', stock: 80,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80'],
  },
  {
    name: 'Himalaya Purifying Neem Face Wash',
    description: '200ml natural neem and turmeric face wash. Controls oil, removes impurities gently.',
    price: 299, originalPrice: 399,
    category: 'Beauty', brand: 'Himalaya', stock: 120,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80'],
  },
  {
    name: 'Dove Damage Repair Shampoo',
    description: '650ml keratin nourishment shampoo for dry, damaged and colour-treated hair.',
    price: 449, originalPrice: 549,
    category: 'Beauty', brand: 'Dove', stock: 90,
    images: ['https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=600&q=80'],
  },
];

connectDB().then(async () => {
  await Product.deleteMany({});
  console.log('🗑️  Cleared existing products');
  const created = await Product.insertMany(products);
  console.log(`✅ ${created.length} products seeded!`);
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });