import React, { useState, useEffect } from 'react';
import ProductDetail from './components/ProductDetail';
import AdminDashboard from './components/AdminDashboard';
import AdminPinEntry from './components/AdminPinEntry';
import { initialProduksList } from './data';
import { Product } from './types';
import { db } from './lib/firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  onSnapshot,
  query
} from 'firebase/firestore';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [search, setSearch] = useState(window.location.search);
  const [produks, setProduks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(() => {
    return sessionStorage.getItem('adminAuthorized') === 'true';
  });

  useEffect(() => {
// ... existing useEffect handleLocationChange ...
    const handleLocationChange = () => {
      setPath(window.location.pathname);
      setSearch(window.location.search);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
// ... existing useEffect onSnapshot ...
    // Real-time listener for products
    const q = query(collection(db, 'produks'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const produksData: Product[] = [];
      querySnapshot.forEach((doc) => {
        produksData.push(doc.data() as Product);
      });
      
      setProduks(produksData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'produks');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Disable iOS Safari gestures
    const handleGesture = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handleGesture);
    document.addEventListener("gesturechange", handleGesture);
    document.addEventListener("gestureend", handleGesture);

    // Disable Ctrl + Scroll zoom
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Disable keyboard zoom
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=")) ||
        (e.ctrlKey && e.key === "0")
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("gesturestart", handleGesture);
      document.removeEventListener("gesturechange", handleGesture);
      document.removeEventListener("gestureend", handleGesture);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleAddProduct = async (newProduct: Product) => {
// ... same logic ...
    try {
      await setDoc(doc(db, 'produks', newProduct.produks_id), newProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `produks/${newProduct.produks_id}`);
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
// ... same logic ...
    try {
      await setDoc(doc(db, 'produks', updatedProduct.produks_id), updatedProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `produks/${updatedProduct.produks_id}`);
    }
  };

  const handleDeleteProduct = async (id: string) => {
// ... same logic ...
    try {
      await deleteDoc(doc(db, 'produks', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `produks/${id}`);
    }
  };

  const handleAuthSuccess = () => {
    setIsAdminAuthorized(true);
    sessionStorage.setItem('adminAuthorized', 'true');
  };

  enum OperationType {
// ... existing OperationType ...
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
  }

  function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
// ... existing handleFirestoreError ...
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: null, // No auth as requested
        email: null,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    // Don't throw for list operations to keep the UI alive during initial permission setup
    if (operationType !== OperationType.GET) throw new Error(JSON.stringify(errInfo));
  }

  if (loading) {
// ... existing loading UI ...
    return (
      <div className="flex items-center justify-center h-full bg-white max-w-md mx-auto shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-500">Menghubungkan ke Database...</p>
        </div>
      </div>
    );
  }

  if (path === '/admin') {
    if (!isAdminAuthorized) {
      return <AdminPinEntry onSuccess={handleAuthSuccess} />;
    }
    return (
      <AdminDashboard 
        produks={produks} 
        onAdd={handleAddProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    );
  }

  return <ProductDetail key={search} produks={produks} />;
}
