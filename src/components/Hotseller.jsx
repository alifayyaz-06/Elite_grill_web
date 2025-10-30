import React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import fullMenu from "../data/fullMenu";

// Function to get random items from the full menu
const getRandomHotItems = () => {
  const allItems = [];

  // Collect all items from all categories
  Object.keys(fullMenu).forEach((category) => {
    fullMenu[category].forEach((item) => {
      allItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.image,
      });
    });
  });

  // Shuffle and pick 6 random items
  const shuffled = allItems.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 6);
};

export default function HotSellers({ onAddToCart, cartItems = [] }) {
  const [hotItems] = React.useState(() => getRandomHotItems());
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      direction === "left"
        ? (scrollRef.current.scrollLeft -= scrollAmount)
        : (scrollRef.current.scrollLeft += scrollAmount);
    }
  };

  const handleViewAll = () => {
    console.log("Navigate to /menu#hotsellers");
  };

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
      <section className="w-full px-4 sm:px-6 lg:pl-[158px] lg:pr-12 xl:pl-[222px] xl:pr-16 py-8 sm:py-12 bg-white">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:px-6 lg:px-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left font-mono">
            Hot Sellers
          </h2>
          <button
            onClick={handleViewAll}
            className="text-orange-500 font-semibold hover:underline text-sm sm:text-base"
          >
            VIEW ALL
          </button>
        </div>

        {/* Slider / Grid */}
        <div className="relative">
          {/* Left arrow (desktop only) */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md 
                       rounded-full p-2 z-10 hidden md:flex hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5 text-orange-500" />
          </button>

          {/* Items Container */}
          <div
            ref={scrollRef}
            className="
              flex gap-4 overflow-x-auto scroll-smooth px-2
              sm:gap-6 sm:px-6
              lg:gap-8 lg:px-12
              scrollbar-hide
            "
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            {hotItems.map((item) => {
              const inCart = cartItems?.find((i) => i.id === item.id);
              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center bg-white rounded-xl border border-orange-300 
                             p-3 sm:p-4 transition hover:shadow-md hover:-translate-y-1 
                             min-w-[140px] max-w-[140px] sm:min-w-[180px] sm:max-w-[180px] lg:min-w-[200px] lg:max-w-[200px]"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-cover rounded-lg"
                  />
                  <h3 className="mt-2 sm:mt-3 font-bold text-xs sm:text-sm lg:text-base text-center line-clamp-2 h-8 sm:h-10">
                    {item.name}
                  </h3>
                  <p className="text-orange-500 font-semibold text-sm sm:text-base mt-1">
                    Rs {item.price.toLocaleString("en-PK")}
                  </p>
                  <button
                    onClick={() => onAddToCart?.(item)}
                    className="mt-2 flex items-center justify-center space-x-1 px-2 sm:px-3 py-1.5 
                               text-xs font-medium bg-red-500 text-white w-full
                               rounded-full hover:bg-red-600 transition"
                  >
                    <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="truncate">
                      {inCart ? `In Cart (${inCart.quantity})` : "Add"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right arrow (desktop only) */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md 
                       rounded-full p-2 z-10 hidden md:flex hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5 text-orange-500" />
          </button>
        </div>
      </section>
    </>
  );
}
