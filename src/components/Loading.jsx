import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative">
        {/* Glowing rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-72 h-72 rounded-full border border-orange-500/20 animate-ping-slow" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-60 h-60 rounded-full border-2 border-orange-500/30 animate-ping-slow delay-200" />
        </div>

        {/* Rotating food icons orbit */}
        <div className="relative w-64 h-64 animate-spin-slow">
          {/* Pizza slice - Top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full w-16 h-16 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
              <div className="text-6xl drop-shadow-2xl animate-float">🍕</div>
            </div>
          </div>

          {/* Burger - Right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full w-16 h-16 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
              <div className="text-6xl drop-shadow-2xl animate-float delay-100">
                🍔
              </div>
            </div>
          </div>

          {/* Fries - Bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full w-16 h-16 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
              <div className="text-6xl drop-shadow-2xl animate-float delay-200">
                🍟
              </div>
            </div>
          </div>

          {/* Drink - Left */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full w-16 h-16 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
              <div className="text-6xl drop-shadow-2xl animate-float delay-300">
                🥤
              </div>
            </div>
          </div>
        </div>

        {/* Center brand logo with glow effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full blur-2xl opacity-40 w-32 h-32 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 animate-pulse" />

            {/* Logo container */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-full w-32 h-32 flex items-center justify-center shadow-2xl border-4 border-orange-500/30 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/10 to-transparent" />

              {/* Brand logo image */}
              <div className="relative z-10 flex items-center justify-center">
                <img
                  src="/img/img8.png"
                  alt="Brand Logo"
                  className="w-24 h-24 object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-24">
        <div className="flex gap-3 mb-6 justify-center">
          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-bounce shadow-lg shadow-orange-500/50" />
          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-bounce delay-100 shadow-lg shadow-orange-500/50" />
          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-bounce delay-200 shadow-lg shadow-orange-500/50" />
        </div>
        <p className="text-center text-orange-400 font-bold text-lg tracking-wider animate-pulse">
          Loading Amazing Food...
        </p>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ping-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.1;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}
