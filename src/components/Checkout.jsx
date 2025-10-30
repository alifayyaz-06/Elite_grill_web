import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Checkout({ cartItems = [], onClearCart, onAddToCart }) {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);
  const restoredRef = useRef(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    method: "delivery", // delivery | pickup
    payment: "cod", // cod | card | wallet
  });
  const [touched, setTouched] = useState({ name: false, phone: false });

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const MIN_ORDER = 500;

  // Recommendations removed from Checkout page per user request

  useEffect(() => {
    const init = async () => {
      // Try sessionStorage first to restore previous chosen coords/address
      const saved = sessionStorage.getItem("checkout_coords");
      const savedAddr = sessionStorage.getItem("checkout_address");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCoords(parsed);
          if (savedAddr) setAddress(savedAddr);
          restoredRef.current = true;
          return;
        } catch (e) {
          // ignore and fallback
        }
      }

      const center = await getCurrentPositionOrDefault();
      setCoords(center);
      reverseGeocode(center);
    };
    init();
  }, []);

  const getCurrentPositionOrDefault = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation)
        return resolve({ lat: 24.8607, lng: 67.0011 });
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve({ lat: 24.8607, lng: 67.0011 })
      );
    });
  };

  const reverseGeocode = async (c) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${c.lat}&lon=${c.lng}`
      );
      const data = await res.json();
      setAddress(
        data.display_name || `${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`
      );
    } catch (e) {
      setAddress(`${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`);
    }
  };

  // Persist coords/address after user moves marker or edits address
  useEffect(() => {
    if (!coords) return;
    // If we just restored from sessionStorage on mount, allow user to move and then persist
    try {
      sessionStorage.setItem("checkout_coords", JSON.stringify(coords));
    } catch (e) {}
  }, [coords]);

  useEffect(() => {
    try {
      if (address) sessionStorage.setItem("checkout_address", address);
    } catch (e) {}
  }, [address]);

  const handlePlaceOrder = () => {
    if (total < MIN_ORDER) {
      toast.error(`Minimum order is Rs ${MIN_ORDER}`);
      return;
    }
    if (!customer.name || !customer.phone) {
      toast.error("Please enter name and phone.");
      return;
    }
    if (customer.method === "delivery" && !address) {
      toast.error("Please set a delivery address.");
      return;
    }
    const order = {
      customer,
      address,
      coords,
      items: cartItems,
      total,
      placedAt: new Date().toISOString(),
    };
    console.log("ORDER_PLACED", order);
    toast.success("Order placed successfully!");
    if (onClearCart) onClearCart();
    navigate("/");
  };

  const handleWhatsAppOrder = () => {
    if (total < MIN_ORDER) {
      toast.error(`Minimum order is Rs ${MIN_ORDER}`);
      return;
    }
    const number = import.meta.env.VITE_WHATSAPP_NUMBER || "923120644468"; // e.g., 92300XXXXXXX
    const lines = [
      "New Order via WhatsApp:",
      `Name: ${customer.name}`,
      `Phone: ${customer.phone}`,
      `Method: ${customer.method}`,
      `Payment: ${customer.payment}`,
      `Address: ${address}`,
      "Items:",
      ...cartItems.map(
        (i) =>
          `- ${i.name} x${i.quantity} = Rs ${(
            i.price * i.quantity
          ).toLocaleString("en-PK")}`
      ),
      `Total: Rs ${total.toLocaleString("en-PK")}`,
    ];
    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${number}?text=${text}`;
    window.open(url, "_blank");
  };

  const handleAddAddon = (addon) => {
    const item = {
      id: addon.id,
      name: addon.name,
      price: addon.price,
      quantity: 1,
    };
    if (onAddToCart) {
      onAddToCart(item);
      toast.success(`${addon.name} added to cart`);
    } else {
      toast.info(
        "Add-on: " +
          addon.name +
          ". Use the menu to add it, or wire onAddToCart prop."
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2 bg-white rounded-xl border p-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                aria-required={true}
                required
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Your name"
              />
              {touched.name && !customer.name && (
                <div className="text-sm text-red-500 mt-1">
                  Name is required
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                aria-required={true}
                required
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="03XXXXXXXXX"
              />
              {touched.phone && !customer.phone && (
                <div className="text-sm text-red-500 mt-1">
                  Phone is required
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Email (optional)</label>
              <input
                value={customer.email}
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Order Notes</label>
              <input
                value={customer.notes}
                onChange={(e) =>
                  setCustomer({ ...customer, notes: e.target.value })
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
                placeholder="Any instruction"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-gray-600">Method</label>
              <select
                value={customer.method}
                onChange={(e) =>
                  setCustomer({ ...customer, method: e.target.value })
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
              >
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Payment</label>
              <select
                value={customer.payment}
                onChange={(e) =>
                  setCustomer({ ...customer, payment: e.target.value })
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="card">Card</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
          </div>

          {/* Map */}
          <div className="mt-4">
            <label className="text-sm text-gray-600">Delivery Location</label>
            <div className="w-full h-64 md:h-80 rounded-lg border mt-1 overflow-hidden">
              {coords && (
                <MapContainer
                  center={[coords.lat, coords.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <DraggableMarker
                    coords={coords}
                    onMove={(c) => {
                      setCoords(c);
                      reverseGeocode(c);
                    }}
                  />
                </MapContainer>
              )}
            </div>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-3 w-full border rounded-lg px-3 py-2"
              placeholder="Address"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border p-4 h-fit">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2 max-h-80 overflow-auto pr-1">
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

          {/* Recommendations removed from Checkout per user request */}
          <div className="mt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-orange-600">
              Rs {total.toLocaleString("en-PK")}
            </span>
          </div>
          {total < MIN_ORDER && (
            <div className="text-sm text-red-600 mt-2">
              Minimum order amount is Rs {MIN_ORDER}
            </div>
          )}
          {(() => {
            const needsAddress = customer.method === "delivery";
            const canPlace =
              customer.name?.toString().trim() &&
              customer.phone?.toString().trim() &&
              (!needsAddress || address?.toString().trim()) &&
              total >= MIN_ORDER;
            return (
              <button
                onClick={handleWhatsAppOrder}
                disabled={!canPlace}
                className={`mt-2 w-full font-semibold py-3 rounded-lg text-white ${
                  canPlace
                    ? "bg-orange-700 hover:bg-orange-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Place Order
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function DraggableMarker({ coords, onMove }) {
  const [position, setPosition] = useState(L.latLng(coords.lat, coords.lng));
  const markerRef = useRef(null);

  useEffect(() => {
    setPosition(L.latLng(coords.lat, coords.lng));
  }, [coords.lat, coords.lng]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onMove({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const p = marker.getLatLng();
        onMove({ lat: p.lat, lng: p.lng });
      }
    },
  };

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    ></Marker>
  );
}
