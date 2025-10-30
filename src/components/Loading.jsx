import React from "react";
import "./Loading.css";

export default function Loading({ tagline = "Assembling your burger..." }) {
  return (
    <div className="eg-loading-overlay" role="status" aria-live="polite">
      <div className="eg-loading-center">
        <div className="eg-burger-wrap" aria-hidden>
          <div className="eg-burger">
            <div className="layer bun-top">
              <span className="sesame s1" />
              <span className="sesame s2" />
              <span className="sesame s3" />
              <span className="sesame s4" />
            </div>
            <div className="layer lettuce" />
            <div className="layer tomato" />
            <div className="layer cheese" />
            <div className="layer patty" />
            <div className="layer bun-bottom" />
            <div className="steam steam-1" />
            <div className="steam steam-2" />
          </div>
        </div>

        {/* Burger-only animation: no brand, no tagline */}
      </div>
    </div>
  );
}
