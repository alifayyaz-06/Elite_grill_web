import { useState, useEffect } from "react";

export default function ImageSlideshow() {
  const images = [
    "https://res.cloudinary.com/dfulvmass/image/upload/w_600,q_auto,f_auto/v1761856306/Gemini_Generated_Image_s2c0d4s2c0d4s2c0_kvxyj1.png",
    "https://res.cloudinary.com/dfulvmass/image/upload/w_600,q_auto,f_auto/v1761856301/Gemini_Generated_Image_qj8fu2qj8fu2qj8f_ipbou6.png",
    " /img/img1.png",
    "/img/img3.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState("next");

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDirection("next");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full md:mx-0 mx-4 overflow-hidden shadow-2xl ">
      {/* Image container */}
      <div className="relative flex items-center justify-center min-h-72 sm:min-h-96 md:min-h-[600px] overflow-hidden">
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          const isPrev =
            index === (currentIndex - 1 + images.length) % images.length;
          const isNext = index === (currentIndex + 1) % images.length;

          let transformClass = "";
          let opacityClass = "";
          let scaleClass = "";
          let filterClass = "";

          if (isActive) {
            transformClass = "translate-x-0 rotate-0";
            opacityClass = "opacity-100";
            scaleClass = "scale-100";
            filterClass = "blur-0 brightness-100";
          } else if (isPrev) {
            transformClass =
              direction === "prev"
                ? "translate-x-full rotate-1"
                : "-translate-x-full -rotate-1";
            opacityClass = "opacity-40";
            scaleClass = "scale-95";
            filterClass = "blur-sm brightness-75";
          } else if (isNext) {
            transformClass =
              direction === "next"
                ? "-translate-x-full -rotate-1"
                : "translate-x-full rotate-1";
            opacityClass = "opacity-40";
            scaleClass = "scale-95";
            filterClass = "blur-sm brightness-75";
          } else {
            transformClass = "translate-x-full rotate-2";
            opacityClass = "opacity-0";
            scaleClass = "scale-90";
            filterClass = "blur-md brightness-50";
          }

          return (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out transform ${transformClass} ${opacityClass} ${scaleClass}`}
              style={{
                zIndex: isActive ? 10 : isPrev || isNext ? 5 : 1,
              }}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className={`w-full h-full object-fill transition-all duration-1000 ${filterClass}`}
              />
            </div>
          );
        })}
      </div>

      {/* navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-500 ${
              index === currentIndex ? "w-12 h-4" : "w-4 h-4"
            }`}
          >
            <div
              className={`absolute inset-0 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 shadow-lg shadow-pink-500/50"
                  : "bg-white/40 hover:bg-gradient-to-r hover:from-pink-300 hover:to-orange-300"
              }`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
}
