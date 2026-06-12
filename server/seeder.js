require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');

const products = [
  // ── Electronics (MacBook, iPhone 16, Samsung S25 = small discounts | Sony = 30%+ deal)
  {
    name: 'MacBook Air M5',
    description: 'Apple MacBook Air with M5 chip, 13.6-inch Liquid Retina display, 16GB RAM, 512GB SSD. 18-hour battery life.',
    price: 110290, originalPrice: 119900,
    category: 'Electronics', brand: 'Apple', stock: 25,
    images: ['https://placehold.co/400x400/111827/white?text=MacBook+Air+M5'],
  },
  {
    name: 'iPhone 16 Pro',
    description: 'Apple iPhone 16 Pro with A18 Pro chip, 48MP Fusion camera, ProMotion display and titanium design.',
    price: 119900, originalPrice: 134900,
    category: 'Electronics', brand: 'Apple', stock: 50,
    images: ['https://placehold.co/400x400/6366F1/white?text=iPhone+16+Pro'],
  },
  {
    name: 'Samsung Galaxy S25 Ultra',
    description: 'Samsung flagship with Snapdragon 8 Elite, 200MP camera, built-in S Pen and 5000mAh battery.',
    price: 134999, originalPrice: 149999,
    category: 'Electronics', brand: 'Samsung', stock: 40,
    images: ['https://placehold.co/400x400/3B82F6/white?text=Galaxy+S25+Ultra'],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancelling wireless headphones. 30-hour battery, multipoint connection, crystal clear calls.',
    price: 24500, originalPrice: 34999,   // 30% off — DEAL
    category: 'Electronics', brand: 'Sony', stock: 35,
    images: ['https://rukminim1.flixcart.com/image/1490/1490/xif0q/headphone/d/5/v/-original-imahgr29e7fzcfgn.jpeg?q=90'],
  },

  // ── Fashion (Nike = 30%+ deal | others small discount)
  {
    name: 'Nike Air Max 270',
    description: 'Lightweight running shoes with Max Air heel unit providing all-day comfort for any activity.',
    price: 6999, originalPrice: 9999,     // 30% off — DEAL
    category: 'Fashion', brand: 'Nike', stock: 100,
    images: ['https://placehold.co/400x400/EF4444/white?text=Nike+Air+Max+270'],
  },
  {
    name: "Levi's 501 Original Jeans",
    description: 'The original straight fit jean in classic stonewash blue since 1873. A true wardrobe essential.',
    price: 3499, originalPrice: 4999,
    category: 'Fashion', brand: "Levi's", stock: 80,
    images: ['https://placehold.co/400x400/1D4ED8/white?text=Levis+501'],
  },
  {
    name: 'Zara Floral Midi Dress',
    description: 'Elegant floral print midi dress with V-neckline, perfect for casual and semi-formal occasions.',
    price: 2999, originalPrice: 4500,
    category: 'Fashion', brand: 'Zara', stock: 60,
    images: ['https://placehold.co/400x400/EC4899/white?text=Zara+Dress'],
  },

  // ── Home (Philips = 30%+ deal | others small discount)
  {
    name: 'Philips Air Fryer HD9200',
    description: '4.1L digital air fryer with Rapid Air technology. Cook crispy meals with 90% less oil.',
    price: 6999, originalPrice: 9999,     // 30% off — DEAL
    category: 'Home', brand: 'Philips', stock: 35,
    images: ['https://placehold.co/400x400/F59E0B/white?text=Philips+Air+Fryer'],
  },
  {
    name: 'IKEA MICKE Study Desk',
    description: 'Modern minimalist study desk with drawer storage, 105x50cm. Easy home assembly.',
    price: 9999, originalPrice: 11999,
    category: 'Home', brand: 'IKEA', stock: 20,
    images: ['https://placehold.co/400x400/10B981/white?text=IKEA+Study+Desk'],
  },
  {
    name: 'Prestige Induction Cooktop',
    description: '1600W induction cooktop with 7 power levels, auto-off safety and feather touch controls.',
    price: 3499, originalPrice: 4999,
    category: 'Home', brand: 'Prestige', stock: 45,
    images: ['https://placehold.co/400x400/6B7280/white?text=Induction+Cooktop'],
  },

  // ── Sports (Yonex = 30%+ deal | others small discount)
  {
    name: 'Yonex Arcsaber 11 Badminton Racket',
    description: 'High-flex graphite shaft for aggressive attacking play. Pre-strung and ready to play.',
    price: 2449, originalPrice: 3499,     // 30% off — DEAL
    category: 'Sports', brand: 'Yonex', stock: 50,
    images: ['https://placehold.co/400x400/065F46/white?text=Yonex+Arcsaber'],
  },
  {
    name: 'SG Scorer Classic Cricket Bat',
    description: 'Kashmir willow bat for intermediate players. Full size with English leather ball grip.',
    price: 2499, originalPrice: 2999,
    category: 'Sports', brand: 'SG', stock: 30,
    images: ['https://placehold.co/400x400/78350F/white?text=SG+Cricket+Bat'],
  },
  {
    name: 'Lifelong Yoga Mat 6mm',
    description: 'Anti-slip EVA foam yoga mat with body alignment lines and carry strap. 183cm x 61cm.',
    price: 999, originalPrice: 1299,
    category: 'Sports', brand: 'Lifelong', stock: 100,
    images: ['https://placehold.co/400x400/7C3AED/white?text=Yoga+Mat'],
  },

  // ── Books (Atomic Habits = 30%+ deal | others small discount)
  {
    name: 'Atomic Habits',
    description: 'An Easy and Proven Way to Build Good Habits and Break Bad Ones. #1 New York Times bestseller.',
    price: 549, originalPrice: 799,       // 30% off — DEAL
    category: 'Books', brand: 'Penguin', stock: 200,
    images: ['https://placehold.co/400x400/0EA5E9/white?text=Atomic+Habits'],
  },
  {
    name: 'Rich Dad Poor Dad',
    description: "What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not.",
    price: 399, originalPrice: 599,
    category: 'Books', brand: 'Simon & Schuster', stock: 150,
    images: ['https://placehold.co/400x400/DC2626/white?text=Rich+Dad'],
  },
  {
    name: 'The Alchemist',
    description: "Paulo Coelho's legendary fable about following your dream and listening to your heart.",
    price: 399, originalPrice: 499,
    category: 'Books', brand: 'HarperCollins', stock: 180,
    images: ['https://placehold.co/400x400/D97706/white?text=Alchemist'],
  },

  // ── Beauty (Lakme = 30%+ deal | others small discount)
  {
    name: 'Lakme Absolute Foundation',
    description: 'Full coverage matte liquid foundation with SPF 20. Available in 12 shades for Indian skin tones.',
    price: 910, originalPrice: 1299,      // 30% off — DEAL
    category: 'Beauty', brand: 'Lakme', stock: 80,
    images: ['https://placehold.co/400x400/F472B6/white?text=Lakme+Foundation'],
  },
  {
    name: 'Himalaya Purifying Neem Face Wash',
    description: '200ml natural neem and turmeric face wash. Controls oil, removes impurities gently.',
    price: 299, originalPrice: 399,
    category: 'Beauty', brand: 'Himalaya', stock: 120,
    images: ['https://placehold.co/400x400/4ADE80/black?text=Face+Wash'],
  },
  {
    name: 'Dove Damage Repair Shampoo',
    description: '650ml keratin nourishment shampoo for dry, damaged and colour-treated hair.',
    price: 449, originalPrice: 549,
    category: 'Beauty', brand: 'Dove', stock: 90,
    images: ['https://placehold.co/400x400/60A5FA/white?text=Dove+Shampoo'],
  },
];

connectDB().then(async () => {
  await Product.deleteMany({});
  console.log('🗑️  Cleared existing products');
  const created = await Product.insertMany(products);
  console.log(`✅ ${created.length} products seeded!`);
  created.forEach(p => console.log(`  • ${p.name} — ₹${p.price}`));
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });