import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProductsAPI } from '../../api/productAPI';
import { createProductAPI, updateProductAPI, deleteProductAPI } from '../../api/adminAPI';

const CATS = ['Electronics','Fashion','Home','Sports','Books','Beauty'];
const EMPTY = {
  name:'', description:'', price:'', originalPrice:'',
  category:'Electronics', brand:'', stock:'', images:[''],
};

export default function AdminProducts() {
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(EMPTY);
  const [editId,     setEditId]     = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProductsAPI({});
      setProducts(data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };

  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description,
      price: p.price, originalPrice: p.originalPrice || '',
      category: p.category, brand: p.brand, stock: p.stock,
      images: p.images?.length ? p.images : [''],
    });
    setEditId(p._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProductAPI(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.brand || !form.stock)
      return toast.error('Fill all required fields');
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock),
        images: form.images.filter(Boolean),
      };
      if (editId) {
        await updateProductAPI(editId, payload);
        toast.success('Product updated!');
      } else {
        await createProductAPI(payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      setEditId(null);
      setForm(EMPTY);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const fc = (name, val) => setForm(f => ({ ...f, [name]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {products.length} products total
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                     rounded-xl text-[13px] font-medium hover:opacity-90
                     transition-opacity">
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={15} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px]
                     bg-white dark:bg-[#0E0E22]
                     border border-gray-200 dark:border-white/[0.08]
                     text-gray-800 dark:text-gray-200
                     placeholder-gray-400 outline-none
                     focus:border-primary transition-colors" />
      </div>

      {/* Products table */}
      <div className="bg-white dark:bg-[#0E0E22] rounded-2xl
                      border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent
                            rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 dark:border-white/[0.06]">
                <tr>
                  {['Product','Category','Price','Orig. Price','Stock','Actions'].map(h => (
                    <th key={h}
                      className="text-left py-3 px-4 text-[11px] font-medium
                                 text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}
                    className="border-b border-gray-50 dark:border-white/[0.03]
                               hover:bg-gray-50 dark:hover:bg-white/[0.02]
                               transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-[#14142A]
                                        rounded-lg flex items-center justify-center
                                        shrink-0 overflow-hidden">
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt={p.name}
                                className="w-full h-full object-cover" />
                            : <span className="text-lg">🛍️</span>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-gray-900
                                        dark:text-white line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] bg-primary/10 text-primary
                                       px-2 py-0.5 rounded-full font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[13px] font-medium
                                   text-gray-900 dark:text-white">
                      ₹{p.price?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-[12px] text-gray-400 line-through">
                      {p.originalPrice ? `₹${p.originalPrice?.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[12px] font-medium
                        ${p.stock > 10 ? 'text-green-500' :
                          p.stock > 0  ? 'text-amber-500' : 'text-red-500'}`}>
                        {p.stock > 0 ? p.stock : 'Out'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center
                                     text-gray-400 hover:text-primary
                                     hover:bg-primary/10 transition-all">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(p._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center
                                     text-gray-400 hover:text-red-500
                                     hover:bg-red-50 dark:hover:bg-red-900/20
                                     transition-all">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center py-10 text-[13px] text-gray-400">
                No products found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center
                        bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#0E0E22] rounded-2xl w-full max-w-lg
                          border border-gray-100 dark:border-white/[0.06]
                          max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between p-5
                            border-b border-gray-100 dark:border-white/[0.06]">
              <h2 className="text-[15px] font-medium text-gray-900 dark:text-white">
                {editId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-gray-400 hover:text-gray-600
                           hover:bg-gray-100 dark:hover:bg-white/[0.06]
                           transition-all">
                <FiX size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label">Product Name *</label>
                  <input value={form.name} onChange={e => fc('name', e.target.value)}
                    placeholder="e.g. iPhone 16 Pro" className="field-input" />
                </div>

                <div>
                  <label className="label">Category *</label>
                  <select value={form.category}
                    onChange={e => fc('category', e.target.value)}
                    className="field-input">
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Brand *</label>
                  <input value={form.brand} onChange={e => fc('brand', e.target.value)}
                    placeholder="e.g. Apple" className="field-input" />
                </div>

                <div>
                  <label className="label">Price (₹) *</label>
                  <input type="number" value={form.price}
                    onChange={e => fc('price', e.target.value)}
                    placeholder="79999" className="field-input" />
                </div>

                <div>
                  <label className="label">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice}
                    onChange={e => fc('originalPrice', e.target.value)}
                    placeholder="89999 (optional)" className="field-input" />
                </div>

                <div>
                  <label className="label">Stock *</label>
                  <input type="number" value={form.stock}
                    onChange={e => fc('stock', e.target.value)}
                    placeholder="50" className="field-input" />
                </div>

                <div>
                  <label className="label">Image URL</label>
                  <input value={form.images[0]}
                    onChange={e => fc('images', [e.target.value])}
                    placeholder="https://..." className="field-input" />
                </div>

                <div className="col-span-2">
                  <label className="label">Description *</label>
                  <textarea value={form.description}
                    onChange={e => fc('description', e.target.value)}
                    placeholder="Product description..."
                    rows={3}
                    className="field-input resize-none" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-medium
                             border border-gray-200 dark:border-white/[0.08]
                             text-gray-500 dark:text-gray-400
                             hover:border-gray-300 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl
                             text-[13px] font-medium hover:opacity-90
                             transition-opacity disabled:opacity-60">
                  {submitting ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}