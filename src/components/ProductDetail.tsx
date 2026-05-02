import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingCart, 
  MessageSquare, 
  ChevronLeft, 
  Share2, 
  ShieldCheck, 
  MoreVertical, 
  ChevronRight, 
  Truck, 
  Search, 
  Package,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  produks: Product[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ produks }) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const params = new URLSearchParams(window.location.search);
        const produksId = params.get('produks_id') || produks[0]?.produks_id;
        
        const data = produks.find(p => p.produks_id === produksId);
        
        if (!data) {
          throw new Error("Produk tidak ditemukan");
        }

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
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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
          <button onClick={() => window.location.href = 'https://www.tokopedia.com/'} className={`p-2 rounded-full transition ${scrolled ? 'bg-gray-100' : 'bg-black/20 text-white backdrop-blur-sm'}`}><MoreVertical className="w-5 h-5" /></button>
          {scrolled && (
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 flex-1 max-w-[180px]">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Cari di toko..." className="bg-transparent text-xs outline-none w-full" />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button className={`p-2 rounded-full transition ${scrolled ? 'bg-gray-100' : 'bg-black/20 text-white backdrop-blur-sm'}`}><Share2 className="w-5 h-5" /></button>
          <button className={`p-2 rounded-full transition relative ${scrolled ? 'bg-gray-100' : 'bg-black/20 text-white backdrop-blur-sm'}`}>
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-10" onScroll={handleMainScroll}>
        <div className="relative aspect-square bg-white overflow-hidden group">
          {product.media && product.media[activeImage] ? (
            <img src={product.media[activeImage]} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ImageIcon size={48} className="text-gray-300" />
            </div>
          )}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {product.media?.map((_: any, idx: number) => (
              <button key={`media-dot-${idx}`} onClick={() => setActiveImage(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeImage ? 'w-6 bg-green-500' : 'w-1.5 bg-gray-300'}`} />
            ))}
          </div>
          <div className="absolute bottom-6 right-6 bg-black/50 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-md font-medium tracking-widest">{activeImage + 1} / {product.media?.length || 0}</div>
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
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-100 px-4 py-4 z-50 flex items-center gap-3 shrink-0">
        <button className="p-3 border border-gray-200 rounded-xl"><MessageSquare className="w-6 h-6 text-gray-600" /></button>
        <div className="flex-1 flex gap-2">
          <button onClick={() => window.open(product.url_tokopedia, '_blank')} className="flex-1 bg-white border-2 border-green-500 text-green-500 font-black py-3 rounded-xl text-xs">Beli Langsung</button>
          <button onClick={() => window.open(product.url_tokopedia, '_blank')} className="flex-1 bg-green-500 text-white font-black py-3 rounded-xl text-xs shadow-lg shadow-green-100">+ Keranjang</button>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
