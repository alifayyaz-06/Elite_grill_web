import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    id: 1,
    name: "Cheezy Treats",
    img: "https://res.cloudinary.com/dfulvmass/image/upload/w_500,h_500,c_fill,q_auto,f_auto/v1761854559/240_F_34033689_j9NkSwovaFuXEXbXozTpfcoDOBQyMmZv_xybygi.jpg",

    categoryId: "pizza",
  },
  {
    id: 2,
    name: "Burgers",
    img: "https://res.cloudinary.com/dfulvmass/image/upload/f_auto,q_auto,w_800/v1761819369/zinger-burger_jsampw.jpg",
    categoryId: "pizza",
  },
  {
    id: 3,
    name: "Sandwiches",
    img: "https://res.cloudinary.com/dfulvmass/image/upload/f_auto,q_auto,w_800/v1761850954/WhatsApp_Image_2025-10-25_at_15.45.43_93ccd133_roccsk.jpg",

    categoryId: "burgers",
  },
  {
    id: 4,
    name: "Fries",
    img: "https://res.cloudinary.com/dfulvmass/image/upload/f_auto,q_auto,w_800/v1761851650/photo-1716973208261-46f8ee456c43_abeqgu.avif",

    categoryId: "pizza",
  },
  {
    id: 5,
    name: "Sides & Drinks",
    img: "https://res.cloudinary.com/dfulvmass/image/upload/f_auto,q_auto,w_800/v1761853662/240_F_414029990_XCARjrhzjnxaFIf1xBbNLKCQpbbUEoTc_h3p4xq.jpg",
    categoryId: "drinks",
  },
];

export default function ExploreMenu() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const handleViewAllClick = () => {
    navigate("/menu");
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/menu?category=${encodeURIComponent(categoryId)}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      if (direction === "left") {
        scrollRef.current.scrollLeft -= scrollAmount;
      } else {
        scrollRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-12 bg-white">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 md:pl-50">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center sm:text-left font-mono text-black md:ml-8.5 mt-10">
          Explore Menu
        </h2>
        <button
          className="text-orange-500 font-semibold hover:underline md:pr-22 text-sm sm:text-base "
          onClick={handleViewAllClick}
        >
          VIEW ALL
        </button>
      </div>

      <div className="relative">
        {/* Left arrow (desktop only) */}
        {/* <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md 
                     rounded-full p-2 z-10 hidden md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-orange-500" />
        </button> */}

        {/* Items */}
        <div
          ref={scrollRef}
          className="grid grid-cols-2 gap-6 sm:flex sm:gap-8 sm:overflow-x-auto sm:scroll-smooth px-2 sm:px-10 md:pl-55"
        >
          {menuItems.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleCategoryClick(item.categoryId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleCategoryClick(item.categoryId);
                }
              }}
              className="flex flex-col items-center bg-white p-4 transition hover:shadow-md hover:-translate-y-1 cursor-pointer"
              aria-label={`View ${item.name}`}
            >
              {/* Circular image container */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-orange-300">
                <img
                  src={item.img || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 text-sm sm:text-base font-bold text-center">
                {item.name}
              </p>
            </div>
          ))}
        </div>

        {/* Right arrow (desktop only) */}
        {/* <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md 
                     rounded-full p-2 z-10 hidden md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-orange-500" />
        </button> */}
      </div>
    </section>
  );
}
