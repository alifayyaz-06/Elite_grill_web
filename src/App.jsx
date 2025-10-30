import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import Home from "./components/Home";
import Menu from "./components/Menu";
import Checkout from "./components/Checkout";
import Navbar from "./components/Navabar";
import "./App.css";

// Loading is handled by src/components/Loading.jsx

function App() {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
 
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
    return <Loading />;
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
