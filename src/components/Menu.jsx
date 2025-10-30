"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Star, Clock, Flame } from "lucide-react";
import { useLocation } from "react-router-dom";
import fullMenu from "../data/fullMenu";

export default function Menu({ onAddToCart, cartItems = [] }) {
  const dynamicCategories = Object.keys(fullMenu).map((key) => ({
    id: key,
    name: key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  }));

  const [activeCategory, setActiveCategory] = useState(
    dynamicCategories[0]?.id || ""
  );
  const [activeSub, setActiveSub] = useState("all");
  const [optionsModalItem, setOptionsModalItem] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRefs = useRef({});
  const categoryNavRef = useRef(null);
  const indicatorRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const location = useLocation();

  const categories = dynamicCategories;
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
      if (isScrolling) return;

      const scrollPosition = window.scrollY + 200;
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
  }, [categories, isScrolling]);

  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveSub("all");
    setIsScrolling(true);

    const section = sectionRefs.current[categoryId];
    if (section) {
      const yOffset = -220;
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);

    setTimeout(() => moveIndicatorToActive(), 50);
  };

  const moveIndicatorToActive = () => {
    if (!categoryNavRef.current || !indicatorRef.current) return;
    const buttons = Array.from(
      categoryNavRef.current.querySelectorAll("button")
    );
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

  const sizeOptions = [
    { label: "Small", key: "small", multiplier: 0.8 },
    { label: "Medium", key: "medium", multiplier: 1.33 },
    { label: "Large", key: "large", multiplier: 1.8 },
  ];

  const drinkVolumes = [
    { label: "Regular", key: "reg", multiplier: 1 },
    { label: "Large", key: "lg", multiplier: 1.5 },
  ];

  const defaultExtras = {
    "Classic-Pizzas": [
      { key: "extra-cheese", label: "Extra Cheese", price: 79 },
      { key: "extra-chicken", label: "Extra Chicken", price: 149 },
      { key: "extra-olives", label: "Olives", price: 59 },
    ],
    "Signature-Pizza": [
      { key: "extra-cheese", label: "Extra Cheese", price: 79 },
      { key: "extra-chicken", label: "Extra Chicken", price: 149 },
      { key: "extra-olives", label: "Olives", price: 59 },
    ],
    "Elite Special Pizzas": [
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
    const catLower = categoryId.toLowerCase();
    const isPizza = catLower.includes("pizza");
    const isPasta = catLower.includes("pasta");
    const isDrinks = catLower.includes("drink");
    const isBurgers = catLower.includes("burger");

    const needsOptions =
      isPizza || isDrinks || isPasta || isBurgers || item.hasSizeOptions;

    if (needsOptions) {
      // If item has custom sizes, use the first size
      if (item.hasSizeOptions && item.sizes) {
        setSelectedSize(item.sizes[0].key);
      }
      // Otherwise use default logic for pizzas/pastas without custom sizes
      else if (isPizza || isPasta) {
        setSelectedSize("small");
      } else if (isDrinks) {
        setSelectedSize("reg");
      } else if (isBurgers) {
        setSelectedSize(null);
      }

      setSelectedExtras([]);
      setSelectedQuantity(1);

      // Set default brand if item has brand options
      if (item.hasBrandOptions && item.brands && item.brands.length > 0) {
        setSelectedBrand(item.brands[0].name);
      } else {
        setSelectedBrand(null);
      }

      setOptionsModalItem({ ...item, category: categoryId });
    } else {
      onAddToCart(item);
    }
  };

  const closeOptionsModal = () => setOptionsModalItem(null);

  const toggleExtra = (extraKey) => {
    setSelectedExtras((prev) =>
      prev.includes(extraKey)
        ? prev.filter((p) => p !== extraKey)
        : [...prev, extraKey]
    );
  };

  const handleConfirmOptions = () => {
    if (!optionsModalItem) return;
    const item = optionsModalItem;
    let finalPrice = item.price;
    let sizeLabel = null;

    const catLower = item.category?.toLowerCase() || "";
    const isPizza = catLower.includes("pizza");

    // First check if item has custom sizes defined
    if (item.hasSizeOptions && item.sizes) {
      const sizeOpt = item.sizes.find((s) => s.key === selectedSize);
      if (sizeOpt) {
        finalPrice = sizeOpt.price;
        sizeLabel = sizeOpt.label;
      }
    }
    // Handle pizza/pasta sizes with multiplier (only if no custom sizes)
    else if (isPizza || catLower.includes("pasta")) {
      const opt = sizeOptions.find((o) => o.key === selectedSize);
      if (opt) {
        finalPrice = Math.round(item.price * opt.multiplier);
        sizeLabel = opt.label;
      }
    }
    // Handle old drink volume system (fallback)
    else if (catLower.includes("drink")) {
      const opt = drinkVolumes.find((o) => o.key === selectedSize);
      if (opt) {
        finalPrice = Math.round(item.price * opt.multiplier);
        sizeLabel = opt.label;
      }
    }

    // Add extras cost
    const extrasList = (defaultExtras[item.category] || []).filter((e) =>
      selectedExtras.includes(e.key)
    );
    const extrasTotal = extrasList.reduce((s, e) => s + e.price, 0);
    finalPrice += extrasTotal;

    const extrasNames = extrasList.map((e) => e.label);
    const extrasKey = selectedExtras.join("+");

    const cartItem = {
      ...item,
      id: `${item.id}${selectedSize ? `-${selectedSize}` : ""}${
        extrasKey ? `-${extrasKey}` : ""
      }${selectedBrand ? `-${selectedBrand.replace(/\s+/g, "-")}` : ""}`,
      name: `${item.name}${sizeLabel ? ` (${sizeLabel})` : ""}${
        selectedBrand ? ` - ${selectedBrand}` : ""
      }${extrasNames.length ? ` + ${extrasNames.join(", ")}` : ""}`,
      price: finalPrice,
      quantity: selectedQuantity,
    };

    onAddToCart(cartItem);
    setOptionsModalItem(null);
  };

  return (
    <section className="bg-gray-50 pt-0 sm:pt-0 pb-12">
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap");

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        * {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
        }

        .category-title {
          font-family: "Poppins", sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sticky top-16 z-40 bg-white shadow-md">
          <div className="relative bg-white">
            <div
              ref={categoryNavRef}
              className="flex gap-3 overflow-x-auto py-5 px-4 scrollbar-hide snap-x snap-mandatory items-center border-b border-gray-200"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`snap-center px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 text-sm tracking-wide ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border-b border-gray-100">
            <div className="flex gap-2 px-4 py-4 overflow-x-auto scrollbar-hide items-center justify-center">
              {getAvailableSubFilters(activeCategory).map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub.id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    activeSub === sub.id
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md transform scale-105"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {categories.map((category, idx) => {
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
              className={`scroll-mt-56 ${idx === 0 ? "mt-8" : "mt-16"} mb-16`}
            >
              <div className="mb-8">
                <h3 className="category-title text-3xl sm:text-4xl font-bold text-gray-900 flex items-center capitalize tracking-tight">
                  {category.name}
                  {category.id === "hotsellers" && (
                    <Flame className="ml-3 text-red-500" size={32} />
                  )}
                </h3>
                <div className="mt-2 h-1 w-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                {filteredItems.map((item) => {
                  const inCart = cartItems.find((i) => i.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-36 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {item.popular && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <Flame size={12} />
                            Popular
                          </div>
                        )}
                        {item.spicy && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            🌶️ Spicy
                          </div>
                        )}
                      </div>
                      <div className="p-4 sm:p-5">
                        <h3 className="font-bold text-sm sm:text-base mb-2 text-gray-900 line-clamp-1 tracking-tight">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1.5">
                            <Star
                              size={13}
                              className="text-yellow-500 fill-yellow-500"
                            />
                            <span className="font-semibold text-gray-700">
                              {item.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-gray-400" />
                            <span className="font-medium">{item.time}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs text-gray-500 font-medium">
                              Starting from
                            </span>
                            <div className="text-orange-600 font-bold text-base sm:text-lg tracking-tight">
                              Rs {item.price.toLocaleString("en-PK")}
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddClicked(category.id, item)}
                            className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                          >
                            <Plus size={16} />
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

      {optionsModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-5 text-gray-900 tracking-tight">
              Customize — {optionsModalItem.name}
            </h3>
            <div className="space-y-5">
              {/* Custom Size Selection (for items with hasSizeOptions) */}
              {optionsModalItem.hasSizeOptions && optionsModalItem.sizes && (
                <div>
                  <div className="text-sm font-bold text-gray-800 mb-3 tracking-wide">
                    Choose Size *
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {optionsModalItem.sizes.map((size) => (
                      <button
                        key={size.key}
                        onClick={() => setSelectedSize(size.key)}
                        className={`w-full border-2 rounded-lg px-4 py-3.5 text-left transition-all ${
                          selectedSize === size.key
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">
                            {size.label}
                          </span>
                          <span className="text-orange-600 font-bold">
                            Rs {size.price.toLocaleString("en-PK")}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pizza/Pasta Size Selection (only if no custom sizes) */}
              {!optionsModalItem.hasSizeOptions &&
                (optionsModalItem.category?.toLowerCase().includes("pizza") ||
                  optionsModalItem.category
                    ?.toLowerCase()
                    .includes("pasta")) && (
                  <div>
                    <div className="text-sm font-bold text-gray-800 mb-3 tracking-wide">
                      Choose Size *
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {sizeOptions.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setSelectedSize(opt.key)}
                          className={`w-full border-2 rounded-lg px-4 py-3.5 text-left transition-all ${
                            selectedSize === opt.key
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800">
                              {opt.label}
                            </span>
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

              {/* Old Drink Volume Selection (fallback for items without sizes array) */}
              {!optionsModalItem.hasSizeOptions &&
                optionsModalItem.category?.toLowerCase().includes("drink") && (
                  <div>
                    <div className="text-sm font-bold text-gray-800 mb-3 tracking-wide">
                      Choose Volume *
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {drinkVolumes.map((v) => (
                        <button
                          key={v.key}
                          onClick={() => setSelectedSize(v.key)}
                          className={`w-full border-2 rounded-lg px-4 py-3.5 text-left transition-all ${
                            selectedSize === v.key
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800">
                              {v.label}
                            </span>
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

              {/* Brand Selection for Drinks */}
              {optionsModalItem.hasBrandOptions &&
                optionsModalItem.brands &&
                optionsModalItem.brands.length > 0 && (
                  <div>
                    <div className="text-sm font-bold text-gray-800 mb-3 tracking-wide">
                      Choose Brand *
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {optionsModalItem.brands.map((brand) => (
                        <button
                          key={brand.name}
                          onClick={() => setSelectedBrand(brand.name)}
                          className={`border-2 rounded-lg px-4 py-3.5 text-center transition-all ${
                            selectedBrand === brand.name
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                          }`}
                        >
                          <div className="font-semibold text-gray-800 text-sm">
                            {brand.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Extras Selection */}
              {(optionsModalItem.category?.toLowerCase().includes("pizza") ||
                optionsModalItem.category?.toLowerCase().includes("pasta") ||
                optionsModalItem.category?.toLowerCase().includes("burger")) &&
                defaultExtras[optionsModalItem.category] && (
                  <div>
                    <div className="text-sm font-bold text-gray-800 mb-3 tracking-wide">
                      Add Extras (Optional)
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {defaultExtras[optionsModalItem.category].map((ex) => (
                        <label
                          key={ex.key}
                          className="flex items-center gap-3 border-2 border-gray-200 rounded-lg p-3.5 cursor-pointer hover:bg-gray-50 hover:border-orange-300 transition-all"
                        >
                          <input
                            type="checkbox"
                            checked={selectedExtras.includes(ex.key)}
                            onChange={() => toggleExtra(ex.key)}
                            className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {ex.label}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              +Rs {ex.price.toLocaleString("en-PK")}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

              {/* Quantity Selection */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="text-sm font-bold text-gray-800 tracking-wide">
                  Quantity
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setSelectedQuantity((q) => Math.max(1, q - 1))
                    }
                    className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-bold text-lg transition-colors"
                  >
                    -
                  </button>
                  <div className="w-12 text-center font-bold text-lg">
                    {selectedQuantity}
                  </div>
                  <button
                    onClick={() => setSelectedQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  onClick={closeOptionsModal}
                  className="flex-1 py-3.5 rounded-lg border-2 border-gray-300 font-semibold hover:bg-gray-50 transition-all text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOptions}
                  className="flex-1 py-3.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
