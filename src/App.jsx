import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Home from "./components/Home";
import Menu from "./components/Menu";
import Checkout from "./components/Checkout";
import Navbar from "./components/Navabar";
import "./App.css";

function LoadingPage() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Custom Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping opacity-30">
            <img
              src="/img/img8.png"
              alt="Elite Grill Logo"
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />
          </div>
          <img
            src="/img/img8.png"
            alt="Elite Grill Logo"
            className="w-24 h-24 mx-auto rounded-full object-cover animate-pulse shadow-2xl border-4 border-white/20"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-mono">
          Elite Grill
        </h1>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
          <span className="text-white text-lg font-semibold">Loading...</span>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
        </div>

        {/* Tagline */}
        <p className="text-white/90 mt-6 text-sm">
          Preparing your delicious experience...
        </p>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Show loading page for 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Cart functions
  const addToCart = (item) => {
    const exists = cartItems.find((i) => i.id === item.id);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    // Trigger toast outside updater to avoid StrictMode double invoke
    toast.success(`${item.name || item.title || "Item"} added to cart`);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    const item = cartItems.find((i) => i.id === itemId);
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    toast.info(`${item?.name || item?.title || "Item"} removed from cart`);
  };

  const clearCart = () => {
    setCartItems([]);
    if (cartItems.length > 0) {
      toast.warn("Cart cleared");
    }
  };

  // Show loading page
  if (loading) {
    return <LoadingPage />;
  }

  // Show main app after loading
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <Navbar
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onAddToCart={addToCart}
      />
      <Routes>
        <Route
          path="/"
          element={<Home onAddToCart={addToCart} cartItems={cartItems} />}
        />
        <Route
          path="/menu"
          element={<Menu onAddToCart={addToCart} cartItems={cartItems} />}
        />
        <Route
          path="/checkout"
          element={<Checkout cartItems={cartItems} onClearCart={clearCart} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
