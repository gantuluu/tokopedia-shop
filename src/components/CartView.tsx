import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Star, 
  ShoppingBag, 
  Check, 
  ChevronRight,
  Sparkles,
  Edit2
} from 'lucide-react';

export interface CartItem {
  id: string; // unique cart item id (productId + color + storage)
  productId: string;
  title: string;
  price: number;
  image: string;
  shopName: string;
  shopLocation: string;
  shopImage: string;
  isOfficial: boolean;
  color?: string;
  storage?: string;
  quantity: number;
  selected: boolean;
  note?: string;
  productUrl?: string;
}

interface ExternalProduct {
  title: string;
  image: string;
  price: string;
  sold: string;
  reviews: string;
  location: string;
}

interface CartViewProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  externalProducts: ExternalProduct[];
  formatCurrency: (amount: number) => string;
}

const CartView: React.FC<CartViewProps> = ({
  isOpen,
  onClose,
  cartItems,
  setCartItems,
  externalProducts,
  formatCurrency
}) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Group items by shopName
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.shopName]) {
      acc[item.shopName] = [];
    }
    acc[item.shopName].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const selectAll = () => {
    const allSelected = cartItems.every(i => i.selected);
    const updated = cartItems.map(item => ({ ...item, selected: !allSelected }));
    setCartItems(updated);
    localStorage.setItem('tokopedia_cart', JSON.stringify(updated));
  };

  const selectShop = (shopName: string, selected: boolean) => {
    const updated = cartItems.map(item => {
      if (item.shopName === shopName) {
        return { ...item, selected };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('tokopedia_cart', JSON.stringify(updated));
  };

  const toggleItem = (id: string) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('tokopedia_cart', JSON.stringify(updated));
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('tokopedia_cart', JSON.stringify(updated));
  };

  const deleteItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('tokopedia_cart', JSON.stringify(updated));
  };

  const deleteSelected = () => {
    const updated = cartItems.filter(item => !item.selected);
    setCartItems(updated);
    localStorage.setItem('tokopedia_cart', JSON.stringify(updated));
  };

  const startEditNote = (item: CartItem) => {
    setEditingNoteId(item.id);
    setTempNote(item.note || '');
  };

  const saveNote = (id: string) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, note: tempNote };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('tokopedia_cart', JSON.stringify(updated));
    setEditingNoteId(null);
  };

  // Calculations
  const selectedItems = cartItems.filter(item => item.selected);
  const totalSelectedCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const allSelected = cartItems.length > 0 && cartItems.every(i => i.selected);
  const someSelected = cartItems.some(i => i.selected);

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    
    // Open the Tokopedia URL for selected items
    selectedItems.forEach(item => {
      const url = item.productUrl || `https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(item.title)}`;
      window.open(url, '_blank');
    });

    // Remove checked items from cart
    const remaining = cartItems.filter(item => !item.selected);
    setCartItems(remaining);
    localStorage.setItem('tokopedia_cart', JSON.stringify(remaining));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] max-w-md mx-auto bg-gray-50 flex flex-col font-sans text-gray-900 shadow-2xl overflow-hidden select-none">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-extrabold text-gray-900">Keranjang</h1>
        </div>
        {someSelected && (
          <button 
            onClick={deleteSelected}
            className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        )}
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        
        {/* Banner Promo */}
        {cartItems.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2.5 flex items-center justify-between border-b border-emerald-100">
            <div className="flex items-center gap-2 min-w-0">
              <img 
                src="https://png.pngtree.com/png-clipart/20220221/original/pngtree-bebas-ongkir-for-online-shopping-delivery-png-image_7284799.png" 
                alt="Bebas Ongkir" 
                className="h-5 w-auto shrink-0 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-[11px] font-bold text-emerald-800 truncate">Gunakan promo Tokopedia biar belanjaan makin hemat!</span>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>
        )}

        {cartItems.length > 0 ? (
          <div className="space-y-3">
            
            {/* Select All Bar */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={allSelected} 
                  onChange={selectAll}
                  className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500 accent-[#00AA5B] cursor-pointer"
                />
                <span className="text-sm font-bold text-gray-800">Pilih Semua</span>
              </label>
              <span className="text-xs text-gray-400">({cartItems.length} barang)</span>
            </div>

            {/* Shop and Items Lists */}
            {Object.keys(groupedItems).map(shopName => {
              const shopItems = groupedItems[shopName];
              const shopSelected = shopItems.every(i => i.selected);
              const firstItem = shopItems[0];

              return (
                <div key={shopName} className="bg-white border-y border-gray-100">
                  
                  {/* Shop Header */}
                  <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 bg-gray-50/50">
                    <input 
                      type="checkbox" 
                      checked={shopSelected}
                      onChange={(e) => selectShop(shopName, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500 accent-[#00AA5B] cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <img 
                        src="https://p16-images-comn-sg.tokopedia-static.net/tos-alisg-i-zr7vqa5nfb-sg/img/official_store/badge_os.png~tplv-zr7vqa5nfb-image.image" 
                        alt="Official Store" 
                        className="h-3.5 w-auto shrink-0" 
                      />
                      <span className="text-xs font-bold text-gray-900 truncate">{shopName}</span>
                      <span className="text-[10px] text-gray-400">•</span>
                      <span className="text-[10px] text-gray-500 truncate">{firstItem?.shopLocation}</span>
                    </div>
                  </div>

                  {/* Shop Items */}
                  <div className="divide-y divide-gray-100">
                    {shopItems.map(item => (
                      <div key={item.id} className="p-4 space-y-3">
                        <div className="flex gap-3">
                          
                          {/* Checkbox */}
                          <div className="pt-8">
                            <input 
                              type="checkbox" 
                              checked={item.selected}
                              onChange={() => toggleItem(item.id)}
                              className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-500 accent-[#00AA5B] cursor-pointer"
                            />
                          </div>

                          {/* Image */}
                          <div className="w-20 h-20 rounded-lg border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight mb-1">
                              {item.title}
                            </h3>
                            
                            {/* Variant Badge */}
                            {(item.color || item.storage) && (
                              <div className="inline-flex bg-gray-100 text-[10px] text-gray-500 font-medium px-2 py-0.5 rounded-full mb-2">
                                {[item.color, item.storage].filter(Boolean).join(' - ')}
                              </div>
                            )}

                            {/* Price */}
                            <p className="text-[14px] font-extrabold text-gray-900">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>

                        {/* Note & Quantity Selector Row */}
                        <div className="flex items-center justify-between pt-1 gap-2 pl-7">
                          
                          {/* Note Button / Note Form */}
                          <div className="flex-1 min-w-0">
                            {editingNoteId === item.id ? (
                              <div className="flex gap-1.5 items-center bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                                <input 
                                  type="text" 
                                  value={tempNote}
                                  onChange={(e) => setTempNote(e.target.value)}
                                  placeholder="Tulis catatan di sini..."
                                  className="bg-transparent text-[11px] outline-none flex-1 font-medium text-gray-700 placeholder-gray-400"
                                  autoFocus
                                />
                                <button 
                                  onClick={() => saveNote(item.id)}
                                  className="text-[10px] font-extrabold text-green-500 hover:text-green-600 px-1.5 py-0.5 shrink-0 bg-white shadow-sm border border-gray-100 rounded"
                                >
                                  Simpan
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => startEditNote(item)}
                                className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-green-500 transition-colors truncate max-w-full"
                              >
                                <Edit2 className="w-3 h-3 shrink-0" />
                                <span className="truncate">
                                  {item.note ? `Catatan: "${item.note}"` : "Tulis catatan..."}
                                </span>
                              </button>
                            )}
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-200 rounded-full bg-white shrink-0 shadow-sm">
                            <button 
                              onClick={() => item.quantity === 1 ? deleteItem(item.id) : updateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                              ) : (
                                <Minus className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <span className="text-xs font-bold text-gray-800 px-2 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          /* Empty State */
          <div className="px-6 py-12 flex flex-col items-center text-center">
            <img 
              src="https://p16-images-comn-sg.tokopedia-static.net/tos-alisg-i-zr7vqa5nfb-sg/assets-unify/img/il-error-not-found.png~tplv-zr7vqa5nfb-image.image" 
              alt="Keranjang Kosong" 
              className="w-48 h-auto opacity-85 mb-4"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-base font-bold text-gray-900 mb-1">Keranjang belanjaanmu kosong</h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[260px] mb-6">
              Yuk, isi dengan barang-barang berkualitas dari iBox Official Shop!
            </p>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-[#00AA5B] hover:bg-[#009650] text-white font-extrabold rounded-full text-xs shadow-md transition-colors"
            >
              Mulai Belanja
            </button>
          </div>
        )}

        {/* Recommended Products section */}
        {externalProducts.length > 0 && (
          <div className="mt-6 px-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-[15px] text-gray-900">Rekomendasi Untukmu</h3>
              <span className="text-[11px] font-bold text-[#00AA5B]">Lihat Semua</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {externalProducts.slice(0, 4).map((p, idx) => (
                <div 
                  key={`cart-rec-${idx}`}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col cursor-pointer active:scale-95 transition-transform shadow-sm"
                  onClick={() => {
                    window.open(`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(p.title)}`, '_blank');
                  }}
                >
                  <div className="aspect-square w-full relative bg-gray-50">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-2 flex flex-col flex-1 gap-1">
                    <h4 className="text-[11px] text-gray-800 line-clamp-2 leading-tight h-[2.4em] font-medium">{p.title}</h4>
                    <p className="text-[12px] font-extrabold text-gray-900">{formatCurrency(parseInt(p.price))}</p>
                    <div className="flex items-center gap-1 mt-auto">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                      <p className="text-[9px] text-gray-500 truncate">{p.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer sticky checkout */}
      {cartItems.length > 0 && (
        <footer className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between z-50 shadow-lg">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Total Harga</span>
            <span className="text-base font-extrabold text-gray-900 leading-tight">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <button 
            disabled={selectedItems.length === 0}
            onClick={handleCheckout}
            className={`px-8 py-3 rounded-xl font-extrabold text-xs tracking-wide shadow-md transition-all active:scale-[0.98] ${
              selectedItems.length > 0 
                ? 'bg-[#00AA5B] text-white hover:bg-[#009650]' 
                : 'bg-gray-150 text-gray-400 cursor-not-allowed'
            }`}
          >
            Beli ({totalSelectedCount})
          </button>
        </footer>
      )}



    </div>
  );
};

export default CartView;
