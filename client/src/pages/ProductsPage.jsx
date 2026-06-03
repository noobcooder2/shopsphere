import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiHeart, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProductsAPI } from '../api/productAPI';
import { addToCartAPI } from '../api/cartAPI';
import { toggleWishlistAPI } from '../api/wishlistAPI';
import { setCart } from '../slices/cartSlice';

const CATS = ['Electronics','Fashion','Home','Sports','Books','Beauty'];
const SORTS = [
  { label: 'Newest',            value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
];

const SkeletonCard = () => (
  <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                  border border-gray-100 dark:border-white/[0.06]
                  overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-100 dark:bg-[#14142A]" />
    <div className="p-4 space-y-2">
      <div className="h-2.5 bg-gray-100 dark:bg-[#14142A] rounded w-1/3" />
      <div className="h-3.5 bg-gray-100 dark:bg-[#14142A] rounded w-2/3" />
      <div className="h-3 bg-gray-100 dark:bg-[#14142A] rounded w-1/4" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-5 bg-gray-100 dark:bg-[#14142A] rounded w-1/3" />
        <div className="h-9 w-9 bg-gray-100 dark:bg-[#14142A] rounded-xl" />
      </div>
    </div>
  </div>
);

export default function ProductsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [searchParams] = useSearchParams();

  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [addingId,  setAddingId]  = useState(null);
  const [search,    setSearch]    = useState(searchParams.get('search') || '');
  const [category,  setCategory]  = useState(searchParams.get('category') || '');
  const [sort,      setSort]      = useState('newest');

  useEffect(() => { fetchProducts(); }, [category, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search)   params.keyword  = search;
      if (category) params.category = category;
      if (sort)     params.sort     = sort;
      const { data } = await getProductsAPI(params);
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally { setLoading(false); }
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

  const handleWishlist = async (productId, e) => {
    e.stopPropagation();
    if (!user) { toast.error('Please login first'); return navigate('/login'); }
    try {
      const { data } = await toggleWishlistAPI(productId);
      toast.success(data.action === 'added' ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  return (
    <div className="page-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-gray-900 dark:text-white">
            All Products
          </h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <form onSubmit={e => { e.preventDefault(); fetchProducts(); }}
            className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2
                                   text-gray-400" size={15} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px]
                           bg-white dark:bg-[#0E0E22]
                           border border-gray-200 dark:border-white/[0.08]
                           text-gray-800 dark:text-gray-200
                           placeholder-gray-400 outline-none
                           focus:border-primary transition-colors" />
            </div>
            <button type="submit"
              className="px-4 py-2.5 bg-primary text-white rounded-xl text-[13px]
                         font-medium hover:opacity-90 transition-opacity">
              Search
            </button>
          </form>

          <select value={sort} onChange={e => setSort(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-[13px]
                       bg-white dark:bg-[#0E0E22]
                       border border-gray-200 dark:border-white/[0.08]
                       text-gray-700 dark:text-gray-300
                       outline-none focus:border-primary transition-colors">
            {SORTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="hidden md:block w-44 shrink-0">
            <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                            border border-gray-100 dark:border-white/[0.06] p-4 sticky top-20">
              <p className="text-[12px] font-medium text-gray-900 dark:text-white
                            uppercase tracking-wider mb-3">Category</p>
              <div className="flex flex-col gap-0.5">
                {['', ...CATS].map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`text-left px-3 py-2 rounded-xl text-[12px] font-medium
                                transition-colors
                      ${category === cat
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]'}`}>
                    {cat || 'All'}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-[16px] font-medium text-gray-900 dark:text-white mb-1">
                  No products found
                </p>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                  Try a different keyword or category
                </p>
                <button onClick={() => { setSearch(''); setCategory(''); }}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-xl
                             text-[13px] font-medium hover:opacity-90 transition-opacity">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map(p => (
                  <div key={p._id}
                    onClick={() => navigate(`/products/${p._id}`)}
                    className="bg-white dark:bg-[#0E0E22] rounded-2xl
                               border border-gray-100 dark:border-white/[0.06]
                               overflow-hidden cursor-pointer group
                               hover:border-primary/40 hover:shadow-lg
                               hover:shadow-primary/5 transition-all duration-300">

                    {/* Image */}
                    <div className="bg-gray-50 dark:bg-[#14142A] h-44 relative
                                    flex items-center justify-center overflow-hidden">
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.name}
                            className="w-full h-full object-cover
                                       group-hover:scale-105 transition-transform duration-300" />
                        : <span className="text-5xl group-hover:scale-110
                                           transition-transform duration-300">🛍️</span>
                      }
                      <button onClick={e => handleWishlist(p._id, e)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full
                                   bg-white/80 dark:bg-black/50 backdrop-blur-sm
                                   flex items-center justify-center text-gray-400
                                   hover:text-red-500 transition-all duration-200
                                   opacity-0 group-hover:opacity-100">
                        <FiHeart size={13} />
                      </button>
                      {p.stock === 0 && (
                        <div className="absolute inset-0 bg-white/70 dark:bg-black/60
                                        flex items-center justify-center">
                          <span className="text-[11px] font-medium text-gray-500
                                           dark:text-gray-400">Out of stock</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-[10px] text-primary font-medium uppercase
                                    tracking-wide mb-1">{p.category}</p>
                      <p className="text-[14px] font-medium text-gray-900 dark:text-white
                                    line-clamp-1 mb-1">{p.name}</p>
                      <div className="flex items-center gap-1 mb-3">
                        <span style={{ color:'#F59E0B' }}>★</span>
                        <span className="text-[12px] text-gray-400">
                          {p.rating || '4.5'} ({p.numReviews || 0})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[16px] font-medium text-gray-900 dark:text-white">
                          ₹{p.price?.toLocaleString('en-IN')}
                        </p>
                        <button onClick={e => handleAddToCart(p._id, e)}
                          disabled={p.stock === 0 || addingId === p._id}
                          className="w-9 h-9 rounded-xl bg-red-500 text-white flex
                                     items-center justify-center hover:bg-red-600
                                     transition-colors disabled:opacity-40
                                     disabled:cursor-not-allowed">
                          {addingId === p._id
                            ? <span className="w-3 h-3 border-2 border-white
                                               border-t-transparent rounded-full animate-spin" />
                            : <span className="text-xl font-light">+</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}