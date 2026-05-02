import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Package, 
  Store, 
  Image as ImageIcon,
  ChevronLeft,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Product, ColorVariant, StorageVariant } from '../types';

const generateProdukId = () => {
  const chars = 'asdf0123456789';
  let n = Date.now();
  let res = '';
  for (let i = 0; i < 8; i++) {
    const r = Math.floor(Math.random() * chars.length);
    res += chars[(n + r) % chars.length];
    n = Math.floor(n / chars.length);
  }
  return res;
};

interface AdminDashboardProps {
  produks: Product[];
  onAdd: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ produks, onAdd, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  const emptyProduct: Product = {
    produks_id: '',
    title: '',
    description: '',
    category: 'Elektronik',
    brand: '',
    media: [''],
    stock_total: 0,
    stock_sold: 0,
    price: 0,
    sale_price: 0,
    colors: '[]',
    variants: '[]',
    shop_name: 'iBox Official Shop',
    shop_rating: 4.9,
    shop_followers: 1200000,
    shop_location: 'Jakarta Pusat',
    shop_response_time: '± 2 jam',
    shop_image: 'https://images.tokopedia.net/img/cache/215-square/shops-1/2020/1/22/7516801/7516801_f4f165e0-5cf0-43a5-bdfc-851f618a80d4.jpg',
    shop_verified: true,
    reviews_average: 5,
    reviews_total: 0,
    url: 'https://www.tokopedia.com'
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.produks_id);
    setIsAdding(false);
  };

  const handleAddNew = () => {
    setFormData({ ...emptyProduct, produks_id: generateProdukId() });
    setIsAdding(true);
    setEditingId(null);
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', 'webflow');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/daj5cu840/image/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await response.json();
      if (data.secure_url) {
        updateField('media', [...(formData.media || []), data.secure_url]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Gagal mengunggah gambar');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleSave = () => {
    if (!formData.produks_id || !formData.title) {
      alert("ID and Title are required!");
      return;
    }

    if (isAdding) {
      onAdd(formData as Product);
    } else {
      onEdit(formData as Product);
    }
    setEditingId(null);
    setIsAdding(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...(prev as any)[parent], [field]: value }
    }));
  };

  if (editingId || isAdding) {
    return (
      <div className="min-h-full bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-y-auto pb-20">
        <header className="p-4 bg-white border-b sticky top-0 z-10 flex items-center gap-3">
          <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-black text-gray-900">{isAdding ? 'Tambah Produk' : 'Edit Produk'}</h1>
        </header>

        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Informasi Utama</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 text-[#00AA5B]">ID Produk (Unik)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={formData.produks_id || ''} 
                    onChange={e => updateField('produks_id', e.target.value.replace(/[^asdf0123456789]/g, '').slice(0, 8))}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 font-mono tracking-wider transition-all placeholder:text-gray-300"
                    placeholder="a1s2d3f4"
                    maxLength={8}
                  />
                  <button 
                    onClick={() => updateField('produks_id', generateProdukId())}
                    className="px-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all active:scale-95 border border-green-100"
                    title="Generate ID Baru"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Judul Produk</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={e => updateField('title', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Harga Normal</label>
                  <input 
                    type="number" 
                    value={formData.price || 0} 
                    onChange={e => updateField('price', Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Harga Jual</label>
                  <input 
                    type="number" 
                    value={formData.sale_price || 0} 
                    onChange={e => updateField('sale_price', Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Stock Total</label>
                  <input 
                    type="number" 
                    value={formData.stock_total || 0} 
                    onChange={e => updateField('stock_total', Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Terjual</label>
                  <input 
                    type="number" 
                    value={formData.stock_sold || 0} 
                    onChange={e => updateField('stock_sold', Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Deskripsi</label>
                <textarea 
                  rows={4}
                  value={formData.description || ''} 
                  onChange={e => updateField('description', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Media & Varian</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Media (URL Gambar)</label>
                <div className="space-y-2">
                  {(formData.media || []).map((url, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        value={url} 
                        onChange={e => {
                          const newMedia = [...(formData.media || [])];
                          newMedia[idx] = e.target.value;
                          updateField('media', newMedia);
                        }}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                        placeholder="URL Gambar"
                      />
                      <button onClick={() => {
                        const newMedia = (formData.media || []).filter((_, i) => i !== idx);
                        updateField('media', newMedia);
                      }} className="p-3 text-red-500 hover:bg-red-50 rounded-xl">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`cursor-pointer py-3 border-2 border-dashed rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${uploading ? 'bg-gray-50 border-gray-200 text-gray-400' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                      <ImageIcon size={14} /> 
                      {uploading ? 'Mengunggah...' : 'Upload File'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                    <button 
                      onClick={() => updateField('media', [...(formData.media || []), ''])}
                      className="py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                    >
                      <Plus size={14} /> Tambah URL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Informasi Toko & Review</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Nama Toko</label>
                <input 
                  type="text" 
                  value={formData.shop_name || ''} 
                  onChange={e => updateField('shop_name', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Lokasi Toko</label>
                <input 
                  type="text" 
                  value={formData.shop_location || ''} 
                  onChange={e => updateField('shop_location', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Rating Toko</label>
                  <input 
                    type="number" step="0.1"
                    value={formData.shop_rating || 0} 
                    onChange={e => updateField('shop_rating', Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Review Average</label>
                  <input 
                    type="number" step="0.1"
                    value={formData.reviews_average || 0} 
                    onChange={e => updateField('reviews_average', Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">URL Produk (Tokopedia)</label>
                <input 
                  type="text" 
                  value={formData.url || ''} 
                  onChange={e => updateField('url', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>

          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t p-4 flex gap-3 z-20">
            <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500">Batal</button>
            <button onClick={handleSave} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-black shadow-lg shadow-green-100 flex items-center justify-center gap-2">
              <Save size={18} /> Simpan
            </button>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl relative">
      <header className="p-4 bg-white border-b sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <button onClick={() => window.location.href = '/'} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Katalog Admin</h1>
        </div>
        <button onClick={handleAddNew} className="p-2.5 bg-green-500 text-white rounded-full shadow-lg shadow-green-100">
          <Plus size={20} />
        </button>
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar">
        {produks.map((p, idx) => (
          <div key={p.produks_id || `admin-prod-${idx}`} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-start group">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-50 transition-transform group-hover:scale-105">
              {p.media?.[0] ? (
                <img src={p.media[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                  <ImageIcon size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{p.brand}</p>
              <h3 className="text-[14px] font-bold text-gray-900 leading-tight line-clamp-2 mb-2">{p.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-black text-green-600">Rp {(p.sale_price/1000000).toFixed(1)}jt</span>
                <span className="text-[10px] text-gray-400 line-through">Rp {(p.price/1000000).toFixed(1)}jt</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => window.open(`/?produks_id=${p.produks_id}`, '_blank')} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition" title="Buka Produk">
                <ExternalLink size={18} />
              </button>
              <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition" title="Edit Produk">
                <Edit3 size={18} />
              </button>
              <button onClick={() => { if(confirm('Hapus produk ini?')) onDelete(p.produks_id) }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition" title="Hapus Produk">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {produks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Package size={40} className="text-gray-300" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Belum ada produk</p>
              <p className="text-sm text-gray-500">Klik tombol + untuk menambah produk baru</p>
            </div>
          </div>
        )}
      </main>

      <div className="p-4 shrink-0 bg-white border-t">
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full py-4 bg-gray-100 text-gray-600 font-black rounded-2xl text-sm transition hover:bg-gray-200 active:scale-95"
        >
          Lihat Shop
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
