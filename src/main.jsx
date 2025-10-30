import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Show a simple overlay on mobile when in landscape to prevent layout rotation/zoom issues
function updateRotateOverlay() {
  const overlay = document.getElementById("rotate-overlay");
  if (!overlay) return;
  const isNarrow = window.innerWidth <= 760; // mobile-ish
  const isLandscape = window.innerWidth > window.innerHeight;
  if (isNarrow && isLandscape) {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
  } else {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
  }
}

window.addEventListener("resize", updateRotateOverlay, { passive: true });
window.addEventListener("orientationchange", updateRotateOverlay);
// run once at start
updateRotateOverlay();
