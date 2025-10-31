import React from "react";

export default function OurStory() {
  return (
    <section className="bg-white text-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Text (Left side) */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Our Story
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            At{" "}
            <span className="text-orange-500 font-semibold">Elite Grill</span>,
            our journey began with a passion for authentic flavors and warm
            hospitality. From humble beginnings, we have grown into a place
            where every meal tells a story of dedication, freshness, and
            community.
            <br />
            <br />
            We believe food is not just about taste — it’s about bringing people
            together and creating memories that last a lifetime.
          </p>
        </div>

        {/* Image (Right side) */}
        <div className="flex justify-center md:justify-end">
          <img
            src="https://res.cloudinary.com/dfulvmass/image/upload/w_600,q_60,f_auto/v1761889801/img9_lr60q1.png
"
            alt="Our Story"
            className="w-72 h-56 sm:w-96 sm:h-72 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
