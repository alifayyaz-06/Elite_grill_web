import React from "react";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">Elite Grill</h2>
            <p className="mt-2 text-sm text-gray-400">
              Serving flavor, passion, and excellence every day.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="/" className="hover:text-orange-500 transition block">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/menu"
                  className="hover:text-orange-500 transition block"
                >
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-orange-500 transition block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-orange-500 transition block"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex justify-center md:justify-start gap-6 mt-3">
              <a
                href="https://www.facebook.com/share/1GvkhdiDmN/"
                className="hover:text-orange-500 transition"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/elitegrilllahore?igsh=MTZ4a2hqdW91N3ZwcA=="
                className="hover:text-orange-500 transition"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Elite Grill. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
