"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingCart, User, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import fullMenu from "../data/fullMenu";

// ✅ Drawer-style Cart Modal
function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onAddToCart,
}) {
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const MIN_ORDER = 500;

  // Recommendation strategy: prefer small add-ons from real menu (drinks, desserts, salads)
  const smallCategories = ["drinks", "desserts", "salads"];
  const availableFromMenu = smallCategories
    .flatMap((cat) => fullMenu[cat] || [])
    .filter((i) => !cartItems.some((c) => c.id === i.id));

  const recommended = (
    availableFromMenu.length > 0 ? availableFromMenu : addOnItems
  ).slice(0, 3);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 
        ${isOpen ? "visible" : "invisible"}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}`}
      ></div>

      {/* Cart Drawer */}
      <div
        className={`cart-drawer bg-white h-full w-full sm:w-[420px] shadow-2xl flex flex-col transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <ShoppingCart className="mr-2" size={24} />
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-orange-600 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-2">
                Add some delicious items to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                >
                  <img
                    src={item.image || item.img}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-orange-500 font-semibold">
                      Rs {item.price.toLocaleString("en-PK")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations - visible before footer */}
        {recommended && recommended.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <h4 className="text-sm font-semibold mb-3">Recommended add-ons</h4>
            <div className="space-y-3">
              {recommended.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {r.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Rs {r.price.toLocaleString("en-PK")}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        onAddToCart &&
                        onAddToCart({
                          id: r.id,
                          name: r.name,
                          price: r.price,
                          image: r.image,
                        })
                      }
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-sm font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-orange-500">
                Rs {cartTotal.toLocaleString("en-PK")}
              </span>
            </div>
            {cartTotal < MIN_ORDER && (
              <div className="text-sm text-red-600">
                Minimum order is Rs {MIN_ORDER}
              </div>
            )}
            <div className="flex space-x-2">
              <button
                onClick={onClearCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={onCheckout}
                disabled={cartTotal < MIN_ORDER}
                className={`flex-1 font-semibold py-3 rounded-lg transition-colors ${
                  cartTotal >= MIN_ORDER
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Checkout Modal with Google Maps
function CheckoutModal({ isOpen, onClose, cartItems, onConfirm }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState("");
  const [loadingMap, setLoadingMap] = useState(false);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const MIN_ORDER = 500;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!isOpen) return;
    if (!apiKey) {
      toast.error("Missing Google Maps API key (VITE_GOOGLE_MAPS_API_KEY)");
      return;
    }

    const loadScript = () =>
      new Promise((resolve, reject) => {
        if (window.google && window.google.maps) return resolve();
        // Avoid duplicate script tag
        const existing = document.getElementById("google-maps-script");
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", () =>
            reject(new Error("Failed to load Google Maps"))
          );
          return;
        }
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&loading=async&libraries=places,marker`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Maps"));
        document.body.appendChild(script);
      });

    const init = async () => {
      try {
        setLoadingMap(true);
        await loadScript();
        if (!mapRef.current || !window.google?.maps)
          throw new Error("Maps not available");
        const center = await getCurrentPositionOrDefault();
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
        });
        mapInstanceRef.current = map;

        const hasAdvanced =
          !!window.google?.maps?.marker?.AdvancedMarkerElement;
        let marker;
        if (hasAdvanced) {
          const { AdvancedMarkerElement } = window.google.maps.marker;
          marker = new AdvancedMarkerElement({
            position: center,
            map,
            gmpDraggable: true,
          });
          marker.addListener("dragend", (e) => {
            const latLng = e?.latLng || marker.position;
            const coords = { lat: latLng.lat(), lng: latLng.lng() };
            reverseGeocode(coords);
          });
        } else {
          // Fallback to classic Marker
          marker = new window.google.maps.Marker({
            position: center,
            map,
            draggable: true,
          });
          marker.addListener("dragend", () => {
            const pos = marker.getPosition();
            const coords = { lat: pos.lat(), lng: pos.lng() };
            reverseGeocode(coords);
          });
        }
        markerRef.current = marker;
        reverseGeocode(center);
      } catch (e) {
        console.error(e);
        toast.error(
          "Unable to initialize Google Map. Check API key and billing."
        );
      } finally {
        setLoadingMap(false);
      }
    };

    init();
  }, [isOpen]);

  const getCurrentPositionOrDefault = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation)
        return resolve({ lat: 24.8607, lng: 67.0011 }); // Karachi default
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 24.8607, lng: 67.0011 })
      );
    });
  };

  const reverseGeocode = (coords) => {
    if (!(window.google && window.google.maps)) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
      }
    });
  };

  const handleConfirm = () => {
    const order = {
      items: cartItems,
      total,
      address,
      placedAt: new Date().toISOString(),
    };
    console.log("ORDER_PLACED", order);
    onConfirm(order);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold">Checkout</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-2">
              Confirm your delivery location
            </div>
            <div
              ref={mapRef}
              className="w-full h-64 md:h-80 rounded-lg border"
            />
            {loadingMap && (
              <div className="mt-2 text-sm text-gray-500">Loading map…</div>
            )}
            <div className="mt-3">
              <label className="text-sm text-gray-600">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Your address"
              />
            </div>
          </div>
          <div className="p-4 border-t md:border-l md:border-t-0">
            <h4 className="font-semibold mb-3">Order Summary</h4>
            <div className="space-y-2 max-h-56 overflow-auto pr-1">
              {cartItems.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">
                    {i.name} × {i.quantity}
                  </span>
                  <span className="font-medium">
                    Rs {(i.price * i.quantity).toLocaleString("en-PK")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-orange-600">
                Rs {total.toLocaleString("en-PK")}
              </span>
            </div>
            {total < MIN_ORDER && (
              <div className="text-sm text-red-600 mt-2">
                Minimum order is Rs {MIN_ORDER}
              </div>
            )}
            <button
              onClick={handleConfirm}
              disabled={total < MIN_ORDER}
              className={`mt-4 w-full font-semibold py-3 rounded-lg ${
                total >= MIN_ORDER
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Navbar
export default function Navabar({
  cartItems = [],
  onCartClick,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddToCart,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleClick = () => navigate("/");
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleCartClick = () => {
    setIsCartOpen(true);
    if (onCartClick) onCartClick();
  };

  // When the cart drawer is open, add a global class to <body> so we can
  // defensively hide any map overlays that may have been appended elsewhere
  // in the DOM (e.g. Google Maps overlays or Leaflet containers). This is
  // more robust than relying only on drawer-local selectors because map
  // libraries sometimes inject nodes outside the drawer.
  useEffect(() => {
    try {
      if (isCartOpen) document.body.classList.add("cart-open");
      else document.body.classList.remove("cart-open");
    } catch (e) {
      // ignore in non-browser environments
    }
    return () => {
      try {
        document.body.classList.remove("cart-open");
      } catch (e) {}
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Left */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-[#e0631f] transition-colors sm:hidden"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              <img
                src="/img/img8.png"
                alt="Elite Grill"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
              />
              <span
                className="text-lg sm:text-2xl font-bold text-gray-800 font-mono truncate cursor-pointer"
                onClick={handleClick}
              >
                Elite Grill
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={handleCartClick}
                className="relative p-2 text-gray-600 hover:text-[#e0631f] transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="flex items-center space-x-1 sm:space-x-2 bg-[#e0631f] text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md hover:bg-[#cc5315] transition-colors text-sm sm:text-base font-mono">
                <User size={16} />
                <span className="hidden sm:inline">Login</span>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden sm:hidden`}
          >
            <div className="py-3 space-y-2 border-t border-gray-200">
              <div className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <User size={18} className="text-gray-600" />
                <span className="text-gray-800">Login</span>
              </div>
              <div
                onClick={() => {
                  navigate("/menu");
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <Menu size={18} className="text-gray-600" />
                <span className="text-gray-800">Menu</span>
              </div>
              <div
                onClick={() => {
                  navigate("/");
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <span className="text-gray-800">Contact</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Cart Drawer */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
        onAddToCart={onAddToCart}
        onCheckout={() => {
          setIsCartOpen(false);
          // Navigate to dedicated checkout page
          navigate("/checkout");
        }}
      />

      {/* Dedicated checkout page handles the flow now */}
    </>
  );
}
