"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Star, Clock, Flame } from "lucide-react";
import { useLocation } from "react-router-dom";
import fullMenu from "../data/fullMenu";

export default function Menu({ onAddToCart, cartItems = [] }) {
  const [activeCategory, setActiveCategory] = useState("pizza");
  const [activeSub, setActiveSub] = useState("all");
  const [optionsModalItem, setOptionsModalItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const sectionRefs = useRef({});
  const categoryNavRef = useRef(null);
  const indicatorRef = useRef(null);
  const location = useLocation();

  const categories = [
    { id: "pizza", name: "Pizza" },
    { id: "burgers", name: "Burgers" },
    { id: "pasta", name: "Pasta" },
    { id: "salads", name: "Salads" },
    { id: "desserts", name: "Desserts" },
    { id: "drinks", name: "Drinks" },
    { id: "hotsellers", name: "Hot Sellers" },
  ];

  const menuItems = fullMenu;

  const getAvailableSubFilters = (categoryId) => {
    const items = menuItems[categoryId] || [];
    const hasPopular = items.some((i) => i.popular);
    const hasSpicy = items.some((i) => i.spicy);
    const subs = [{ id: "all", name: "All" }];
    if (hasPopular) subs.push({ id: "popular", name: "Popular" });
    if (hasSpicy) subs.push({ id: "spicy", name: "Spicy" });
    return subs;
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (let i = categories.length - 1; i >= 0; i--) {
        const category = categories[i];
        const section = sectionRefs.current[category.id];
        if (section) {
          if (scrollPosition >= section.offsetTop) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveSub("all");
    const section = sectionRefs.current[categoryId];
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 150,
        behavior: "smooth",
      });
    }
    // move indicator after state update (use timeout to wait for DOM update)
    setTimeout(() => moveIndicatorToActive(), 50);
  };

  const moveIndicatorToActive = () => {
    if (!categoryNavRef.current || !indicatorRef.current) return;
    const buttons = Array.from(
      categoryNavRef.current.querySelectorAll("button")
    );
    const activeBtn = buttons.find(
      (b) =>
        b.className.includes("scale-105") ||
        b.textContent.trim() ===
          categories.find((c) => c.id === activeCategory)?.name
    );
    // fallback: find by data-attr
    const idx = categories.findIndex((c) => c.id === activeCategory);
    const btn = buttons[idx] || buttons[0];
    if (!btn) return;
    const navRect = categoryNavRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const left =
      btnRect.left - navRect.left + categoryNavRef.current.scrollLeft;
    indicatorRef.current.style.width = `${btnRect.width}px`;
    indicatorRef.current.style.transform = `translateX(${left}px)`;
  };

  useEffect(() => {
    moveIndicatorToActive();
    const onResize = () => moveIndicatorToActive();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeCategory]);

  // Size selection for pizzas
  const sizeOptions = [
    { label: "Small", key: "small", multiplier: 0.8 },
    { label: "Medium", key: "medium", multiplier: 1.0 },
    { label: "Large", key: "large", multiplier: 1.25 },
  ];

  const drinkVolumes = [
    { label: "Regular", key: "reg", multiplier: 1 },
    { label: "Large", key: "lg", multiplier: 1.5 },
  ];

  const defaultExtras = {
    pizza: [
      { key: "extra-cheese", label: "Extra Cheese", price: 79 },
      { key: "extra-chicken", label: "Extra Chicken", price: 149 },
      { key: "extra-olives", label: "Olives", price: 59 },
    ],
    pasta: [
      { key: "extra-cheese", label: "Extra Cheese", price: 59 },
      { key: "extra-chicken", label: "Extra Chicken", price: 129 },
    ],
    burgers: [
      { key: "extra-cheese", label: "Extra Cheese", price: 59 },
      { key: "extra-patty", label: "Extra Patty", price: 179 },
    ],
  };

  const handleAddClicked = (categoryId, item) => {
    // show options modal for categories that need sizing/extra selection
    const needOptions = ["pizza", "drinks", "pasta", "burgers"];
    if (needOptions.includes(categoryId)) {
      setSelectedSize(null);
      setSelectedExtras([]);
      setSelectedQuantity(1);
      setOptionsModalItem({ ...item, category: categoryId });
    } else {
      onAddToCart(item);
    }
  };

  const closeOptionsModal = () => setOptionsModalItem(null);

  const toggleExtra = (extraKey) => {
    setSelectedExtras((prev) => {
      if (prev.includes(extraKey)) return prev.filter((p) => p !== extraKey);
      return [...prev, extraKey];
    });
  };

  const handleConfirmOptions = () => {
    if (!optionsModalItem) return;
    const item = optionsModalItem;

    // determine size/volume multiplier and label
    let multiplier = 1;
    let sizeLabel = null;
    if (item.category === "pizza" || item.category === "pasta") {
      const opt =
        sizeOptions.find((o) => o.key === selectedSize) || sizeOptions[1];
      multiplier = opt.multiplier;
      sizeLabel = opt.label;
    } else if (item.category === "drinks") {
      const opt =
        drinkVolumes.find((o) => o.key === selectedSize) || drinkVolumes[0];
      multiplier = opt.multiplier;
      sizeLabel = opt.label;
    }

    const extrasList = (defaultExtras[item.category] || []).filter((e) =>
      selectedExtras.includes(e.key)
    );
    const extrasTotal = extrasList.reduce((s, e) => s + e.price, 0);

    const basePrice = Math.round(item.price * multiplier);
    const finalPrice = basePrice + extrasTotal;

    const extrasNames = extrasList.map((e) => e.label);
    const extrasKey = selectedExtras.join("+");

    const cartItem = {
      ...item,
      id: `${item.id}${selectedSize ? `-${selectedSize}` : ""}${
        extrasKey ? `-${extrasKey}` : ""
      }`,
      name: `${item.name}${sizeLabel ? ` (${sizeLabel})` : ""}${
        extrasNames.length ? ` + ${extrasNames.join(", ")}` : ""
      }`,
      price: finalPrice,
      quantity: selectedQuantity,
    };

    onAddToCart(cartItem);
    setOptionsModalItem(null);
  };

  return (
    <section className="bg-gray-50 pt-0 sm:pt-0 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Navigation */}
        <div className="sticky top-16 z-30 bg-white border-b border-gray-200 pb-3">
          <div className="relative">
            <div
              ref={categoryNavRef}
              className="flex gap-3 overflow-x-auto py-3 px-4 scrollbar-hide snap-x snap-mandatory items-center md:justify-center"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`snap-center px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                      : "bg-white/70 text-gray-700 hover:bg-white/90 ring-1 ring-gray-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Underline indicator */}
            <div
              ref={indicatorRef}
              className="category-indicator absolute bottom-0 left-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300"
            />

            <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide md:justify-center">
              {getAvailableSubFilters(activeCategory).map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                    activeSub === sub.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                      : "bg-white/80 text-gray-700 hover:bg-white"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        {categories.map((category) => {
          const items = menuItems[category.id] || [];
          const filteredItems =
            activeCategory === category.id
              ? items.filter((item) => {
                  if (activeSub === "all") return true;
                  if (activeSub === "popular") return item.popular;
                  if (activeSub === "spicy") return item.spicy;
                  return true;
                })
              : items;

          return (
            <section
              key={category.id}
              id={category.id}
              ref={(el) => (sectionRefs.current[category.id] = el)}
              className="mb-12 sm:mb-16"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                {category.name}
                {category.id === "hotsellers" && (
                  <Flame className="ml-2 text-red-500" size={28} />
                )}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => {
                  const inCart = cartItems.find((i) => i.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 my-2">
                          <Star
                            size={12}
                            className="text-yellow-500 fill-yellow-500"
                          />
                          {item.rating}
                          <Clock size={12} /> {item.time}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-orange-500 font-bold">
                            Rs {item.price.toLocaleString("en-PK")}
                          </span>
                          <button
                            onClick={() => handleAddClicked(category.id, item)}
                            className="px-3 py-1 bg-orange-500 text-white text-xs rounded-lg flex items-center gap-1"
                          >
                            <Plus size={14} />
                            {inCart ? `(${inCart.quantity})` : "Add"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Options Modal (sizes/volumes/extras) */}
      {optionsModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-2">
              Options — {optionsModalItem.name}
            </h3>
            <div className="space-y-3">
              {/* Size / Volume */}
              {(optionsModalItem.category === "pizza" ||
                optionsModalItem.category === "pasta") && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Choose Size</div>
                  <div className="grid grid-cols-1 gap-2">
                    {sizeOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setSelectedSize(opt.key)}
                        className={`w-full border rounded-lg px-4 py-3 text-left ${
                          selectedSize === opt.key
                            ? "border-orange-500 bg-orange-50"
                            : "hover:border-orange-500 hover:bg-orange-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{opt.label}</span>
                          <span className="text-orange-600 font-bold">
                            Rs{" "}
                            {Math.round(
                              optionsModalItem.price * opt.multiplier
                            ).toLocaleString("en-PK")}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {optionsModalItem.category === "drinks" && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Choose Volume
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {drinkVolumes.map((v) => (
                      <button
                        key={v.key}
                        onClick={() => setSelectedSize(v.key)}
                        className={`w-full border rounded-lg px-4 py-3 text-left ${
                          selectedSize === v.key
                            ? "border-orange-500 bg-orange-50"
                            : "hover:border-orange-500 hover:bg-orange-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{v.label}</span>
                          <span className="text-orange-600 font-bold">
                            Rs{" "}
                            {Math.round(
                              optionsModalItem.price * v.multiplier
                            ).toLocaleString("en-PK")}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras */}
              {(optionsModalItem.category === "pizza" ||
                optionsModalItem.category === "pasta" ||
                optionsModalItem.category === "burgers") && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Extras</div>
                  <div className="grid grid-cols-1 gap-2">
                    {(defaultExtras[optionsModalItem.category] || []).map(
                      (ex) => (
                        <label
                          key={ex.key}
                          className="flex items-center gap-3 border rounded-lg p-3"
                        >
                          <input
                            type="checkbox"
                            checked={selectedExtras.includes(ex.key)}
                            onChange={() => toggleExtra(ex.key)}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{ex.label}</div>
                            <div className="text-xs text-gray-500">
                              Rs {ex.price.toLocaleString("en-PK")}
                            </div>
                          </div>
                        </label>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Quantity</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setSelectedQuantity((q) => Math.max(1, q - 1))
                    }
                    className="px-3 py-1 border rounded"
                  >
                    -
                  </button>
                  <div className="px-3">{selectedQuantity}</div>
                  <button
                    onClick={() => setSelectedQuantity((q) => q + 1)}
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={closeOptionsModal}
                  className="flex-1 py-3 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOptions}
                  className="flex-1 py-3 rounded-lg bg-orange-500 text-white"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
