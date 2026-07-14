import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ShoppingCart, 
  MessageSquare, 
  ChevronLeft, 
  ArrowLeft,
  Share2, 
  ShieldCheck, 
  MoreVertical, 
  ChevronRight, 
  Truck, 
  Search, 
  Package,
  ThumbsUp,
  Image as ImageIcon,
  Check,
  X,
  Minus,
  Plus
} from 'lucide-react';
import { Product } from '../types';
import CartView, { CartItem } from './CartView';

interface ProductDetailProps {
  produks: Product[];
}

interface ExternalProduct {
  title: string;
  image: string;
  price: string;
  sold: string;
  reviews: string;
  location: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ produks }) => {
  const [product, setProduct] = useState<any>(null);
  const [externalProducts, setExternalProducts] = useState<ExternalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Cart and Variant state variables
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tokopedia_cart') || '[]');
    } catch {
      return [];
    }
  });
  const [showCart, setShowCart] = useState(false);
  const [showVariantSheet, setShowVariantSheet] = useState(false);
  const [variantAction, setVariantAction] = useState<'cart' | 'buy'>('cart');
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedStorage, setSelectedStorage] = useState<any>(null);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);


  useEffect(() => {
    const fetchProductAndExternal = async () => {
      try {
        setLoading(true);
        const externalPromise = fetch('https://opensheet.elk.sh/1nC4LmJylqWXumCX8yqNzE03dYgXaxKXIxuAY56vAk8Q/Sheet2').then(res => res.json());
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const params = new URLSearchParams(window.location.search);
        const produksId = params.get('produks_id') || produks[0]?.produks_id;
        
        const data = produks.find(p => p.produks_id === produksId);
        
        if (!data) {
          throw new Error("Produk tidak ditemukan");
        }

        const [extData] = await Promise.all([externalPromise]);
        setExternalProducts(extData);

        const mappedProduct = {
          id: data.produks_id,
          title: data.title,
          description: data.description,
          category: data.category,
          brand: data.brand,
          media: Array.isArray(data.media) ? data.media : [],
          stock_total: data.stock_total || 0,
          stock_sold: data.stock_sold || 0,
          price: data.price,
          sale_price: data.sale_price,
          variants: {
            colors: (data.colors && typeof data.colors === 'string') ? JSON.parse(data.colors) : ((data.colors && data.colors.length > 0) ? data.colors : [
              { name: "Default", hex: "#000000", image: "" }
            ]),
            storage: (data.variants && typeof data.variants === 'string') ? JSON.parse(data.variants) : ((data.variants && data.variants.length > 0) ? data.variants : ["Default"])
          },
          shop: {
            name: data.shop_name,
            rating: data.shop_rating || 0,
            followers: data.shop_followers && data.shop_followers >= 1000 ? `${(data.shop_followers / 1000).toFixed(1)}rb` : (data.shop_followers || 0),
            location: data.shop_location,
            responseTime: data.shop_response_time,
            image: data.shop_image,
            isOfficial: !!data.shop_verified
          },
          reviews: [
            { id: 1, user: "Budi S.", rating: 5, comment: "Barang original, sampai dengan selamat. Packing kayu aman banget!", date: "2 hari lalu" },
            { id: 2, user: "Andi R.", rating: 5, comment: "Admin responsif, pengiriman cepat pake instant langsung sampai.", date: "5 hari lalu" }
          ],
          rating_average: data.reviews_average || 0,
          total_reviews: data.reviews_total || 0,
          url_tokopedia: data.url
        };

        setProduct(mappedProduct);
        if (mappedProduct.variants.colors && mappedProduct.variants.colors.length > 0) {
          setSelectedColor(mappedProduct.variants.colors[0]);
        }
        if (mappedProduct.variants.storage && mappedProduct.variants.storage.length > 0) {
          setSelectedStorage(mappedProduct.variants.storage[0]);
        }
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndExternal();
  }, [produks]);

  // Prevent Zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  const handleMainScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const isScrolled = target.scrollTop > 50;
    if (isScrolled !== scrolled) setScrolled(isScrolled);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleOpenVariantSheet = (action: 'cart' | 'buy') => {
    setVariantAction(action);
    setCartQuantity(1);
    
    // Set first options if not already set
    if (product) {
      if (product.variants.colors && product.variants.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.variants.colors[0]);
      }
      if (product.variants.storage && product.variants.storage.length > 0 && !selectedStorage) {
        setSelectedStorage(product.variants.storage[0]);
      }
    }
    
    setShowVariantSheet(true);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const colorName = selectedColor?.name || 'Default';
    
    // Check if selectedStorage is a string or a StorageVariant object
    let storageName = 'Default';
    let storagePrice = product.sale_price;

    if (selectedStorage) {
      if (typeof selectedStorage === 'string') {
        storageName = selectedStorage;
      } else if (typeof selectedStorage === 'object') {
        storageName = selectedStorage.storage || 'Default';
        storagePrice = selectedStorage.sale_price || selectedStorage.price || product.sale_price;
      }
    }

    const itemId = `${product.id}-${colorName}-${storageName}`;
    const itemImage = selectedColor?.imgUrl || selectedColor?.image || (product.media && product.media[0]) || '';

    const newCartItem: CartItem = {
      id: itemId,
      productId: product.id,
      title: product.title,
      price: storagePrice,
      image: itemImage,
      shopName: product.shop.name,
      shopLocation: product.shop.location,
      shopImage: product.shop.image,
      isOfficial: product.shop.isOfficial,
      color: colorName !== 'Default' ? colorName : undefined,
      storage: storageName !== 'Default' ? storageName : undefined,
      quantity: cartQuantity,
      selected: true,
      productUrl: product.url_tokopedia
    };

    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.id === itemId);
      let updated;
      if (existingIdx > -1) {
        updated = prev.map((item, idx) => 
          idx === existingIdx ? { ...item, quantity: item.quantity + cartQuantity } : item
        );
      } else {
        updated = [...prev, newCartItem];
      }
      localStorage.setItem('tokopedia_cart', JSON.stringify(updated));
      return updated;
    });

    setShowVariantSheet(false);

    if (variantAction === 'buy') {
      setShowCart(true);
    } else {
      setIsAddingToCart(true);
      setTimeout(() => {
        setIsAddingToCart(false);
        setShowCart(true);
      }, 2000);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white max-w-md mx-auto shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-500">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-full bg-white px-6 text-center max-w-md mx-auto shadow-2xl py-12 overflow-y-auto">
        <div className="flex flex-col items-center gap-6 w-full py-10">
          <img 
            src="https://p16-images-comn-sg.tokopedia-static.net/tos-alisg-i-zr7vqa5nfb-sg/assets-unify/img/il-error-not-found.png~tplv-zr7vqa5nfb-image.image" 
            alt="Produk Tidak Ditemukan" 
            className="w-64 h-auto"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Waduh, tujuanmu nggak ada!</h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[280px]">
              Mungkin kamu salah jalan atau alamat. Ayo balik sebelum gelap!
            </p>
          </div>
          
          <div className="w-full pt-4">
            <button 
              onClick={() => window.location.href = 'https://www.tokopedia.com/'} 
              className="w-full py-3.5 bg-green-500 text-white font-black rounded-xl text-sm shadow-lg shadow-green-100 active:scale-[0.98] transition-all"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = product.price;
  const currentSalePrice = product.sale_price;
  const discountPercentage = currentPrice > 0 ? Math.round(((currentPrice - currentSalePrice) / currentPrice) * 100) : 0;

  return (
    <div className="max-w-md mx-auto h-full flex flex-col bg-white font-sans text-gray-900 relative shadow-2xl overflow-hidden select-none" style={{ touchAction: 'pan-x pan-y' }}>
      <header className={`w-full z-50 transition-all duration-300 px-4 py-3 flex items-center justify-between shrink-0 absolute top-0 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => window.location.href = 'https://www.tokopedia.com/'} className={`p-2 rounded-full transition ${scrolled ? 'bg-gray-100' : 'bg-black/20 text-white backdrop-blur-sm'}`}><ArrowLeft className="w-5 h-5" /></button>
          {scrolled && (
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 flex-1 max-w-[180px]">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Cari di toko..." className="bg-transparent text-xs outline-none w-full" />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button className={`p-2 rounded-full transition ${scrolled ? 'bg-gray-100' : 'bg-black/20 text-white backdrop-blur-sm'}`}><Share2 className="w-5 h-5" /></button>
          <button 
            id="header-cart-button"
            onClick={() => setShowCart(true)}
            className={`p-2 rounded-full transition relative ${scrolled ? 'bg-gray-100' : 'bg-black/20 text-white backdrop-blur-sm'}`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItems.reduce((acc, i) => acc + i.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-scale-in">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-10" onScroll={handleMainScroll}>
        <div className="relative aspect-square bg-white overflow-hidden group touch-none">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100 && activeImage > 0) {
                  setActiveImage(activeImage - 1);
                } else if (info.offset.x < -100 && activeImage < (product.media?.length || 1) - 1) {
                  setActiveImage(activeImage + 1);
                }
              }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            >
              {product.media && product.media[activeImage] ? (
                <img 
                  src={product.media[activeImage]} 
                  alt={product.title} 
                  className="w-full h-full object-cover pointer-events-none select-none" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon size={48} className="text-gray-300" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {product.media?.map((_: any, idx: number) => (
              <button key={`media-dot-${idx}`} onClick={() => setActiveImage(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeImage ? 'w-6 bg-green-500' : 'w-1.5 bg-gray-300/60'}`} />
            ))}
          </div>
          <div className="absolute bottom-6 right-6 bg-black/40 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-md font-bold tracking-wider z-10">{activeImage + 1} / {product.media?.length || 0}</div>
        </div>

        <div className="px-4 py-5 space-y-5">
          <section>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-gray-900">{formatCurrency(currentSalePrice)}</span>
                {discountPercentage > 0 && <span className="text-sm text-gray-400 line-through font-medium">{formatCurrency(currentPrice)}</span>}
              </div>
              {discountPercentage > 0 && <span className="bg-red-50 text-red-600 font-bold px-2 py-1 rounded text-xs">DISKON {discountPercentage}%</span>}
            </div>
            <h1 className="text-lg text-gray-800 leading-tight mt-2 font-semibold">{product.title}</h1>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-gray-800">{product.rating_average}</span>
                <span className="text-xs text-gray-400">({product.total_reviews} ulasan)</span>
              </div>
              <span className="text-gray-200 h-4 w-[1px] bg-gray-300" />
              <span className="text-sm text-gray-500">Terjual <span className="font-semibold text-gray-800">{product.stock_sold}+</span></span>
            </div>
          </section>

          <div className="h-[8px] bg-gray-50 -mx-4 border-y border-gray-100" />

          <section className="space-y-4 py-2">
            <div className="flex items-start gap-3"><Truck className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1 text-sm"><p className="font-bold">Pengiriman</p><p className="text-xs text-gray-500">Dikirim dari <span className="font-semibold text-gray-700">{product.shop.location}</span></p><p className="text-xs text-green-600 font-medium mt-1">Estimasi tiba besok</p></div>
            </div>
            <div className="flex items-start gap-3"><ShieldCheck className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="flex-1 text-sm"><p className="font-bold">Proteksi Gadget</p><p className="text-xs text-gray-500">Melindungi dari kerusakan fisik & cairan</p></div>
            </div>
          </section>

          <div className="h-[8px] bg-gray-50 -mx-4 border-y border-gray-100" />

          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0"><div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#8DD5CF] to-[#00AA5B]"><div className="w-full h-full rounded-full bg-white p-[2px]"><img src="https://images.tokopedia.net/img/cache/100-square/tPxBYm/2023/1/20/cf438cd7-a9f8-435f-910d-726100b587db.jpg" alt="Shop Logo" className="w-full h-full rounded-full object-contain" referrerPolicy="no-referrer" /></div></div></div>
              <div className="flex-1"><div className="flex items-center gap-1 mb-0.5"><img src="https://p16-images-comn-sg.tokopedia-static.net/tos-alisg-i-zr7vqa5nfb-sg/img/official_store/badge_os.png~tplv-zr7vqa5nfb-image.image" alt="Official Store" className="h-4 w-auto" referrerPolicy="no-referrer" /><h2 className="text-[16px] font-bold truncate leading-tight">{product.shop.name}</h2></div><p className="text-[12px] text-gray-500">{product.shop.location}</p></div>
            </div>
            <div className="flex items-center justify-between mt-1"><div className="flex gap-4"><div className="flex items-center gap-1.5"><Star size={16} fill="#FACC15" className="text-yellow-400" /><span className="text-[13px] font-bold">{product.rating_average}</span></div><div className="flex items-center gap-1.5"><Package size={16} className="text-gray-400" /><span className="text-[13px] font-bold text-gray-900">{product.stock_total}</span><span className="text-[13px] text-gray-500">total barang</span></div></div><button className="px-6 py-1.5 rounded-lg font-bold text-[13px] border border-gray-300 text-gray-800">Follow</button></div>
            
            <div className="flex items-center overflow-x-auto no-scrollbar whitespace-nowrap w-full py-2 gap-0">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <img className="w-5 h-5 object-contain" alt="Pasti Ori" referrerPolicy="no-referrer" src="https://images.tokopedia.net/img/pdp/trust-markers/badge_verified.png" />
                <span className="text-[11px] font-bold text-gray-800">Pasti Ori</span>
              </div>
              <span className="px-3 text-gray-300 font-bold flex-shrink-0">•</span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <img className="w-5 h-5 object-contain" alt="Pembayaran Aman" referrerPolicy="no-referrer" src="https://images.tokopedia.net/img/pdp/trust-markers/verified_payment.png" />
                <span className="text-[11px] font-bold text-gray-800">Pembayaran Aman</span>
              </div>
              <span className="px-3 text-gray-300 font-bold flex-shrink-0">•</span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <img className="w-5 h-5 object-contain" alt="Tokopedia Care" referrerPolicy="no-referrer" src="https://images.tokopedia.net/img/pdp/trust-markers/help_center.png" />
                <span className="text-[11px] font-bold text-gray-800">Tokopedia Care 24 Jam</span>
              </div>
            </div>
          </section>

          <div className="h-[8px] bg-gray-50 -mx-4 border-y border-gray-100" />

          <section className="space-y-3 text-sm">
            <h3 className="font-bold text-base">Detail Produk</h3>
            <div className="space-y-2"><div className="flex justify-between pb-2"><span className="text-gray-400">Kondisi</span><span className="font-semibold">Baru</span></div><div className="flex justify-between pb-2"><span className="text-gray-400">Etalase</span><span className="text-green-500 font-bold">{product.brand}</span></div></div>
            <p className="text-gray-600 leading-relaxed mt-2">{product.description}</p>
          </section>

          <div className="h-[8px] bg-gray-50 -mx-4 border-y border-gray-100" />

          <section className="space-y-4 pb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base">Ulasan Pembeli</h3>
              <button className="text-green-500 text-xs font-bold">Lihat Semua</button>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="text-center bg-gray-50 rounded-2xl p-4 min-w-[100px]">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-black">4.9</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">Dari 856 Rating</p>
              </div>
              
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((num, i) => (
                  <div key={`rating-bar-${num}`} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold w-2 text-gray-600">{num}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400" style={{ width: i === 0 ? '85%' : i === 1 ? '10%' : '2%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="border-b border-gray-50 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={`star-1-${i}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">2 hari lalu</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[8px] font-bold text-blue-500">B</div>
                  <p className="text-xs font-bold">Budi S.</p>
                </div>
                <p className="text-xs text-gray-600 italic">"Barang original, sampai dengan selamat. Mantap buat seller."</p>
                <div className="mt-2">
                  <button className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-green-500 transition">
                    <ThumbsUp className="w-3 h-3" /> Membantu
                  </button>
                </div>
              </div>

              <div className="border-b border-gray-50 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={`star-2-${i}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">4 hari lalu</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[8px] font-bold text-blue-500">A</div>
                  <p className="text-xs font-bold">Andi W.</p>
                </div>
                <p className="text-xs text-gray-600 italic">"Box mulus segel greenpeel."</p>
                <div className="mt-2">
                  <button className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-green-500 transition">
                    <ThumbsUp className="w-3 h-3" /> Membantu
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="h-[8px] bg-gray-50 -mx-4 border-y border-gray-100" />

          {/* New External Products Section */}
          <section className="space-y-4 pb-8">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base">Produk Lainnya</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {externalProducts.map((p, idx) => (
                <div 
                  key={`ext-${idx}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
                  onClick={() => window.open(`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(p.title)}`, '_blank')}
                >
                  <div className="aspect-square w-full relative">
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-2.5 flex flex-col flex-1 gap-1">
                    <h4 className="text-[11px] text-gray-800 line-clamp-2 leading-tight h-[2.4em] font-medium">{p.title}</h4>
                    <p className="text-[13px] font-bold text-gray-900 mt-0.5">{formatCurrency(parseInt(p.price))}</p>
                    <div className="flex items-center gap-1 mt-auto">
                      <p className="text-[10px] text-gray-400">{p.location}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex items-center gap-0.5">
                         <Star size={10} fill="#FACC15" className="text-yellow-400" />
                         <span className="text-[10px] text-gray-500">{p.reviews}</span>
                      </div>
                      <span className="text-[10px] text-gray-300">|</span>
                      <p className="text-[10px] text-gray-500">Terjual {p.sold}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="h-[8px] bg-gray-50 -mx-4 border-y border-gray-100" />

          {externalProducts.length > 0 && (
            <section className="space-y-4 pb-8 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[16px]">Produk Lainnya</h3>
                <button className="text-green-500 text-[12px] font-bold">Lihat Semua</button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {externalProducts.map((p, idx) => (
                  <div 
                    key={`ext-${idx}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col active:scale-[0.98] transition-transform"
                    onClick={() => window.open(`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(p.title)}`, '_blank')}
                  >
                    <div className="aspect-square w-full relative">
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2.5 flex flex-col flex-1 gap-1">
                      <h4 className="text-[12px] text-gray-800 line-clamp-2 leading-tight h-[2.5em] font-medium">{p.title}</h4>
                      <p className="text-[14px] font-black text-gray-900 mt-0.5">{"Rp " + parseInt(p.price).toLocaleString('id-ID')}</p>
                      
                      <div className="flex items-center gap-1 mt-auto">
                        <img src="https://p16-images-comn-sg.tokopedia-static.net/tos-alisg-i-zr7vqa5nfb-sg/img/official_store/badge_os.png~tplv-zr7vqa5nfb-image.image" alt="Shop Icon" className="h-3 w-auto" />
                        <p className="text-[10px] text-gray-500 truncate">{p.location}</p>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex items-center gap-0.5">
                           <Star size={10} fill="#FACC15" className="text-yellow-400" />
                           <span className="text-[10px] text-gray-500 font-medium">{p.reviews}</span>
                        </div>
                        <span className="text-[10px] text-gray-200">|</span>
                        <p className="text-[10px] text-gray-500 font-medium">{p.sold} terjual</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="px-4 py-8 border-t border-gray-100 -mx-4">
            <img 
              alt="Tokopedia Logo" 
              className="w-[30%] mb-4 object-contain" 
              referrerPolicy="no-referrer" 
              src="https://www.ethic.ninja/wp-content/uploads/2017/11/logo-tokopedia.png" 
            />
            <h3 className="font-bold text-base mb-4">Jelajah Tokopedia</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://www.tokopedia.com/official-store?t_id=1777513306107&t_st=5&t_pp=product_detail&t_efo=search_pure_goods_card&t_ef=goods_search&t_sm=&t_spt=search_result" className="text-sm text-gray-600 font-medium hover:text-green-500 block">Mall</a>
              </li>
              <li>
                <a href="https://www.tokopedia.com/salam?t_id=1777513306107&t_st=5&t_pp=product_detail&t_efo=search_pure_goods_card&t_ef=goods_search&t_sm=&t_spt=search_result" className="text-sm text-gray-600 font-medium hover:text-green-500 block">Tokopedia Salam</a>
              </li>
              <li>
                <a href="https://www.tokopedia.com/p?t_id=1777513306107&t_st=5&t_pp=product_detail&t_efo=search_pure_goods_card&t_ef=goods_search&t_sm=&t_spt=search_result" className="text-sm text-gray-600 font-medium hover:text-green-500 block">Kategori</a>
              </li>
            </ul>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-10 mb-10">
              {[
                { title: "Tokopedia Care", url: "https://www.tokopedia.com/help" },
                { title: "Syarat & Ketentuan", url: "https://www.tokopedia.com/terms" },
                { title: "Kebijakan Privasi", url: "https://www.tokopedia.com/privacy" },
                { title: "Tentang Tokopedia", url: "https://www.tokopedia.com/about" },
                { title: "Karier", url: "https://www.tokopedia.com/careers" },
                { title: "Blog", url: "https://www.tokopedia.com/blog" },
                { title: "Affiliate Program", url: "https://www.tokopedia.com/affiliate" },
                { title: "Mitra Tokopedia", url: "https://www.tokopedia.com/mitra" },
                { title: "Seller Education", url: "https://seller.tokopedia.com/edu" },
                { title: "Pusat Resolusi", url: "https://www.tokopedia.com/resolution-center" },
                { title: "Hubungi Kami", url: "https://www.tokopedia.com/contact" }
              ].map((link, idx) => (
                <a 
                  key={`footer-link-${idx}`}
                  href={link.url}
                  className="text-[12px] text-gray-500 font-medium hover:text-green-500 transition-colors"
                >
                  {link.title}
                </a>
              ))}
            </div>

            <div className="mb-10">
              <h3 className="font-bold text-[14px] mb-4">Gunakan Aplikasi Tokopedia</h3>
              <div className="w-full">
                <img 
                  src="https://t4.ftcdn.net/jpg/04/01/40/99/360_F_401409954_fy0cxNyYj63BaHqgagkuEe8WCeb2FCvk.jpg" 
                  alt="Download Tokopedia App" 
                  className="w-full h-auto rounded-lg bg-white border border-gray-100"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <p className="text-[12px] font-bold text-gray-400 mt-12 tracking-tight">© 2009 - 2026, PT Tokopedia</p>
          </section>

        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-100 px-4 py-4 z-50 flex items-center gap-3 shrink-0">
        <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"><MessageSquare className="w-6 h-6 text-gray-600" /></button>
        <div className="flex-1 flex gap-2">
          <button 
            id="footer-buy-button"
            onClick={() => handleOpenVariantSheet('buy')}
            className="flex-1 bg-white border-2 border-green-500 text-green-500 font-extrabold py-3 rounded-xl text-xs transition-transform active:scale-[0.98]"
          >
            Beli Langsung
          </button>
          <button 
            id="footer-cart-button"
            onClick={() => handleOpenVariantSheet('cart')}
            className="flex-1 bg-green-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-green-100 transition-transform active:scale-[0.98]"
          >
            + Keranjang
          </button>
        </div>
      </footer>

      {/* Cart View Overlay Page */}
      <CartView 
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
        externalProducts={externalProducts}
        formatCurrency={formatCurrency}
      />

      {/* Floating Success Toast (Tokopedia Style) */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 left-4 right-4 z-[90] bg-gray-900 text-white px-4 py-3 rounded-2xl flex items-center justify-between gap-3 shadow-xl border border-gray-800"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-100 truncate">Berhasil dimasukkan</p>
                <p className="text-[10px] text-gray-400 truncate">Yuk cek keranjang belanjamu sekarang.</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowToast(false);
                setShowCart(true);
              }}
              className="px-4 py-1.5 bg-[#00AA5B] hover:bg-[#009650] text-white font-black rounded-lg text-[11px] shrink-0 transition-colors shadow"
            >
              Lihat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay (Tokopedia Style) */}
      <AnimatePresence>
        {isAddingToCart && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm z-[150] flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#00AA5B] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-gray-900">Menambahkan ke keranjang...</p>
                <p className="text-xs text-gray-400">Sedang memproses pesananmu</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variant Selection Bottom Sheet */}
      <AnimatePresence>
        {showVariantSheet && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVariantSheet(false)}
              className="absolute inset-0 bg-black z-[101]"
            />
            
            {/* Bottom Sheet Container */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[102] flex flex-col shadow-2xl max-h-[85%] border-t border-gray-100 font-sans"
            >
              
              {/* Sheet Header */}
              <div className="p-4 flex gap-4 border-b border-gray-50 relative">
                <button 
                  onClick={() => setShowVariantSheet(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {/* Variant Image */}
                <div className="w-20 h-20 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
                  <img 
                    src={selectedColor?.imgUrl || selectedColor?.image || (product.media && product.media[0]) || ""} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Variant Price & Stock Info */}
                <div className="flex flex-col justify-end">
                  <p className="text-xl font-black text-[#FF5722]">
                    {formatCurrency(selectedStorage?.sale_price || selectedStorage?.price || product.sale_price)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Stok total: <span className="font-bold text-gray-700">{product.stock_total} barang</span>
                  </p>
                </div>
              </div>

              {/* Sheet Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar pb-8">
                
                {/* Color Variants */}
                {product.variants?.colors && product.variants.colors.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pilih Warna</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.colors.map((color: any, idx: number) => {
                        const isSelected = selectedColor?.name === color.name;
                        return (
                          <button
                            key={`variant-color-${idx}`}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center gap-2 ${
                              isSelected 
                                ? "border-[#00AA5B] bg-emerald-50/50 text-[#00AA5B]" 
                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            {color.hex && (
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" 
                                style={{ backgroundColor: color.hex }}
                              />
                            )}
                            {color.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Storage/Capacity Variants */}
                {product.variants?.storage && product.variants.storage.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pilih Kapasitas</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.storage.map((v: any, idx: number) => {
                        const vName = typeof v === 'string' ? v : v.storage;
                        const sName = typeof selectedStorage === 'string' ? selectedStorage : selectedStorage?.storage;
                        const isSelected = sName === vName;
                        
                        return (
                          <button
                            key={`variant-storage-${idx}`}
                            onClick={() => setSelectedStorage(v)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                              isSelected 
                                ? "border-[#00AA5B] bg-emerald-50/50 text-[#00AA5B]" 
                                : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                          >
                            {vName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Control Selector */}
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jumlah Pembelian</h4>
                    <p className="text-[10px] text-gray-400">Bisa beli maksimal {product.stock_total} barang</p>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-full bg-white shadow-sm shrink-0">
                    <button 
                      disabled={cartQuantity <= 1}
                      onClick={() => setCartQuantity(prev => Math.max(1, prev - 1))}
                      className="p-2 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-gray-800 px-3 min-w-[30px] text-center">
                      {cartQuantity}
                    </span>
                    <button 
                      disabled={cartQuantity >= product.stock_total}
                      onClick={() => setCartQuantity(prev => prev + 1)}
                      className="p-2 hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Sheet Sticky Bottom Actions */}
              <div className="p-4 border-t border-gray-50 bg-white">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 bg-[#00AA5B] hover:bg-[#009650] text-white font-extrabold rounded-xl text-sm transition-colors shadow-md"
                >
                  {variantAction === 'buy' ? 'Beli Langsung' : 'Masukkan Keranjang'}
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
