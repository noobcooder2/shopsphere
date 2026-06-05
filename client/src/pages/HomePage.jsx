import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getProductsAPI } from '../api/productAPI';
import { addToCartAPI } from '../api/cartAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../slices/cartSlice';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { emoji:'📱', label:'Electronics', color:'bg-blue-50 dark:bg-blue-950/40' },
  { emoji:'👗', label:'Fashion',     color:'bg-pink-50 dark:bg-pink-950/40' },
  { emoji:'🏠', label:'Home',        color:'bg-orange-50 dark:bg-orange-950/40' },
  { emoji:'⚽', label:'Sports',      color:'bg-green-50 dark:bg-green-950/40' },
  { emoji:'📚', label:'Books',       color:'bg-yellow-50 dark:bg-yellow-950/40' },
  { emoji:'💄', label:'Beauty',      color:'bg-purple-50 dark:bg-purple-950/40' },
];

const CAT_EMOJI = { Electronics:'📱', Fashion:'👟', Home:'🏠', Sports:'⚽', Books:'📚', Beauty:'💄' };

const TRUST = [
  { emoji:'🚚', title:'Free Delivery',  desc:'On orders above ₹499' },
  { emoji:'↩️', title:'Easy Returns',   desc:'30-day hassle-free returns' },
  { emoji:'🔒', title:'Secure Payment', desc:'100% safe & encrypted' },
  { emoji:'💬', title:'24/7 Support',   desc:'Always here to help' },
];

export default function HomePage() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector(s => s.auth);

  const [query,    setQuery]    = useState('');
  const [secs,     setSecs]     = useState(42443);
  const [featured, setFeatured] = useState([]);
  const [heroProds,setHeroProds]= useState([]);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setSecs(s => s > 0 ? s - 1 : 86399), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    getProductsAPI({}).then(({ data }) => {
      // Specific products for floating cards
      const macbook  = data.find(p => p.name.toLowerCase().includes('macbook'));
      const sony     = data.find(p => p.name.toLowerCase().includes('sony'));
      const nike     = data.find(p => p.name.toLowerCase().includes('nike'));
      setHeroProds([macbook, sony, nike].filter(Boolean));
  
      // Featured: one from each of 4 categories
      const cats = ['Electronics', 'Fashion', 'Home', 'Sports'];
      const feat = cats.map(cat => data.find(p => p.category === cat)).filter(Boolean);
      setFeatured(feat);
    }).catch(() => {});
  }, []);

  const fmt = (s) => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?search=${query}`);
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    if (!user) { toast.error('Please login first'); return navigate('/login'); }
    try {
      setAddingId(productId);
      const { data } = await addToCartAPI(productId, 1);
      dispatch(setCart(data));
      toast.success('Added to cart! 🛒');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    } finally { setAddingId(null); }
  };

  // Floating card positions
  const POSITIONS = [
    'top-3 left-0 w-40 animate-float-1',
    'top-0 right-0 w-40 animate-float-2',
    'bottom-2 left-12 w-44 animate-float-3',
  ];

  return (
    <div className="page-bg min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[520px] flex flex-col">

        {/* Blobs */}
        <div className="absolute w-[440px] h-[440px] rounded-full -top-28 -left-20
                        bg-[rgba(99,102,241,0.35)] dark:bg-[rgba(99,102,241,0.42)]
                        blur-[88px] animate-blob-1 pointer-events-none" />
        <div className="absolute w-[330px] h-[330px] rounded-full top-16 -right-16
                        bg-[rgba(245,158,11,0.28)] dark:bg-[rgba(245,158,11,0.3)]
                        blur-[88px] animate-blob-2 pointer-events-none" />
        <div className="absolute w-[370px] h-[370px] rounded-full -bottom-28 left-[28%]
                        bg-[rgba(236,72,153,0.22)] dark:bg-[rgba(236,72,153,0.28)]
                        blur-[88px] animate-blob-3 pointer-events-none" />

        <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full
                        px-4 pt-10 pb-0 flex items-center gap-6">

          {/* Left */}
          <div className="flex-1 animate-fade-up">
            <div className="inline-flex items-center gap-2 glass px-3 py-1.5
                            rounded-full text-[11px] font-medium text-primary mb-4
                            border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              New arrivals this week
            </div>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight
                           text-gray-900 dark:text-white leading-[1.18] mb-3">
              Shop smarter,<br />live <span className="text-primary">better.</span>
            </h1>
            <p className="text-[15px] text-gray-500 dark:text-gray-400
                          leading-relaxed max-w-md mb-6">
              Discover thousands of products across Electronics, Fashion,
              Home &amp; more — delivered to your door.
            </p>
            <form onSubmit={handleSearch}
              className="flex gap-2 max-w-[380px] glass rounded-xl p-1.5 mb-6">
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="flex-1 bg-transparent text-[13px] text-gray-800
                           dark:text-gray-200 placeholder-gray-400
                           dark:placeholder-gray-500 outline-none px-2 min-w-0" />
              <button type="submit"
                className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white
                           rounded-lg text-[13px] font-medium hover:opacity-90
                           transition-opacity shrink-0">
                <FiSearch size={14} /> Search
              </button>
            </form>
            <div className="flex gap-6">
              {[
                { num:'10K', suffix:'+', color:'#EF4444', label:'Products' },
                { num:'50K', suffix:'+', color:'#EF4444', label:'Customers' },
                { num:'4.9', suffix:'★', color:'#F59E0B', label:'Rating' },
              ].map(({ num, suffix, color, label }) => (
                <div key={label}>
                  <p className="text-[20px] font-medium text-gray-900 dark:text-white">
                    {num}<span style={{ color }}>{suffix}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

        {/* Floating cards — specific products with custom tags */}
        <div className="hidden lg:block relative w-[320px] h-[300px] shrink-0">
          {heroProds.map((product, i) => {
            const positions = [
              'top-3 left-0 w-40 animate-float-1',
              'top-0 right-0 w-40 animate-float-2',
              'bottom-2 left-12 w-44 animate-float-3',
            ];
            // Tag config per card
            const tags = [
              null, // MacBook — no special tag
              { label: '✦ New Arrival', cls: 'bg-green-500 text-white' },
              { label: '-30% off', cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
            ];
            const tag = tags[i];
            const disc = product.originalPrice > product.price
              ? Math.round((1 - product.price / product.originalPrice) * 100)
              : 0;
        
            return (
              <div key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                className={`absolute glass-card rounded-2xl p-3 cursor-pointer
                            hover:border-primary/50 transition-all duration-300
                            hover:scale-105 ${positions[i]}`}>
                <div className="mb-2">
                  {product.images?.[0]
                    ? <img src={product.images[0]} alt={product.name}
                        className="w-10 h-10 object-contain rounded-lg" />
                    : <span className="text-3xl">🛍️</span>}
                </div>
                <p className="text-[11px] font-medium text-gray-800 dark:text-gray-200
                              line-clamp-1">{product.name}</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <p className="text-[12px] font-medium text-primary">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </p>
                  {disc > 0 && (
                    <p className="text-[9px] text-gray-400 line-through">
                      ₹{product.originalPrice?.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
                {tag && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded mt-1
                                    inline-block font-medium ${tag.cls}`}>
                    {tag.label}
                  </span>
                )}
                {!tag && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded mt-1
                                   inline-block font-medium bg-primary/10 text-primary">
                    {product.category}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

        {/* Promo banner */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 pb-6 mt-6">
          <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
            <span className="bg-red-500 text-white text-[10px] font-medium
                             px-2 py-0.5 rounded-md shrink-0">🔥 Flash Sale</span>
            <p className="text-[12px] font-medium text-gray-800 dark:text-gray-200 flex-1">
              Up to <strong>50% off</strong> on Electronics &amp; Fashion
              <span className="text-gray-400 font-normal"> · Limited time only</span>
            </p>
            <p className="text-[12px] font-medium text-primary shrink-0 tabular-nums">
              {fmt(secs)}
            </p>
            <button onClick={() => navigate('/deals')}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white
                         text-[11px] font-medium rounded-lg hover:opacity-90
                         transition-opacity shrink-0">
              Shop Now <FiArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
            Shop by Category
          </h2>
          <Link to="/categories"
            className="text-[13px] text-primary hover:opacity-80 transition-opacity
                       flex items-center gap-1">
            View all <FiArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {CATEGORIES.map(({ emoji, label, color }) => (
            <Link key={label} to={`/products?category=${label}`}
              className={`${color} rounded-2xl p-4 flex flex-col items-center gap-2
                          hover:scale-105 transition-transform duration-200
                          border border-transparent hover:border-primary/20`}>
              <span className="text-3xl">{emoji}</span>
              <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products — real data ── */}
      <section className="max-w-7xl mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
            Featured Products
          </h2>
          <Link to="/products"
            className="text-[13px] text-primary hover:opacity-80 transition-opacity
                       flex items-center gap-1">
            View all <FiArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.length === 0
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#0E0E22] rounded-2xl
                                        border border-gray-100 dark:border-white/[0.06]
                                        overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-100 dark:bg-[#14142A]" />
                  <div className="p-4 space-y-2">
                    <div className="h-2.5 bg-gray-100 dark:bg-[#14142A] rounded w-1/3" />
                    <div className="h-4 bg-gray-100 dark:bg-[#14142A] rounded w-2/3" />
                    <div className="h-4 bg-gray-100 dark:bg-[#14142A] rounded w-1/2" />
                  </div>
                </div>
              ))
            : featured.map(product => (
                <div key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="bg-white dark:bg-[#0E0E22] rounded-2xl
                             border border-gray-100 dark:border-white/[0.06]
                             overflow-hidden cursor-pointer group
                             hover:border-primary/40 hover:shadow-lg
                             hover:shadow-primary/5 transition-all duration-300">
                  <div className="bg-gray-50 dark:bg-[#14142A] h-44 flex items-center
                                  justify-center overflow-hidden">
                    {product.images?.[0]
                      ? <img src={product.images[0]} alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105
                                     transition-transform duration-300" />
                      : <span className="text-5xl group-hover:scale-110
                                         transition-transform duration-300">
                          {CAT_EMOJI[product.category] || '🛍️'}
                        </span>}
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] text-primary font-medium uppercase
                                  tracking-wide mb-1">{product.category}</p>
                    <p className="text-[14px] font-medium text-gray-900 dark:text-white
                                  line-clamp-1 mb-1">{product.name}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <span style={{ color:'#F59E0B' }}>★</span>
                      <span className="text-[12px] text-gray-400">
                        {product.rating || '4.5'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[16px] font-medium text-gray-900 dark:text-white">
                          ₹{product.price?.toLocaleString('en-IN')}
                        </p>
                        {product.originalPrice > product.price && (
                          <p className="text-[11px] text-gray-400 line-through">
                            ₹{product.originalPrice?.toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                      <button onClick={e => handleAddToCart(product._id, e)}
                        className="w-9 h-9 rounded-xl bg-red-500 text-white flex
                                   items-center justify-center hover:bg-red-600
                                   transition-colors">
                        {addingId === product._id
                          ? <span className="w-3 h-3 border-2 border-white
                                             border-t-transparent rounded-full animate-spin" />
                          : <span className="text-xl font-light">+</span>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="border-t border-gray-100 dark:border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST.map(({ emoji, title, desc }) => (
              <div key={title}
                className="flex items-start gap-4 p-4 rounded-2xl
                           hover:bg-gray-50 dark:hover:bg-white/[0.03]
                           transition-colors duration-200">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center
                                justify-center text-xl shrink-0">{emoji}</div>
                <div>
                  <p className="text-[14px] font-medium text-gray-900 dark:text-white mb-0.5">
                    {title}
                  </p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute w-64 h-64 rounded-full bg-primary/20 blur-3xl
                          -top-20 -left-20 pointer-events-none" />
          <div className="absolute w-64 h-64 rounded-full bg-accent/15 blur-3xl
                          -bottom-20 -right-20 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[12px] font-medium text-primary uppercase tracking-widest mb-3">
              Stay in the loop
            </p>
            <h2 className="text-3xl font-medium text-gray-900 dark:text-white mb-3">
              Get exclusive deals first
            </h2>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Subscribe and never miss a sale, new arrival or exclusive offer.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input type="email" placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-xl text-[13px]
                           bg-white dark:bg-[#14142A]
                           border border-gray-200 dark:border-white/10
                           text-gray-800 dark:text-gray-200
                           placeholder-gray-400 outline-none
                           focus:border-primary transition-colors" />
              <button className="px-5 py-2.5 bg-primary text-white rounded-xl
                                 text-[13px] font-medium hover:opacity-90
                                 transition-opacity whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}