import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// Set initial HTML attributes
const currentLang = localStorage.getItem('i18nextLng') || 'ar';
document.documentElement.lang = currentLang;
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

// ============================================================
// GITHUB PAGES 404 REDIRECT HANDLER
// ============================================================
// This code restores the correct route when redirected from 404.html
//
// How it works:
// 1. 404.html redirects to /?p=/some-path
// 2. We check if 'p' query parameter exists
// 3. If yes, we extract the path and restore it using history.replaceState
// 4. This makes the URL clean again (removes ?p=)
// 5. React Router then handles the navigation normally
//
// Example:
// User visits: /daffaWeb/shop
// 404.html redirects to: /?p=/shop
// This code changes URL to: /shop (clean URL)
// React Router navigates to Shop page
// ============================================================

(function() {
  // Check if we have a 'p' parameter in the URL (from 404.html redirect)
  const query = window.location.search;
  if (query) {
    const urlParams = new URLSearchParams(query);
    const redirect = urlParams.get('p');

    if (redirect) {
      // Restore the original path from the query parameter
      // Also restore any search params that were in the original URL
      const searchParams = urlParams.get('q');
      const hash = window.location.hash;

      // Build the new clean URL
      const newUrl = redirect +
        (searchParams ? '?' + searchParams : '') +
        hash;

      // Replace the current URL without adding to history
      // This removes the ?p= parameter and restores the clean path
      window.history.replaceState(null, '', newUrl);
    }
  }
})();

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
    <App />
  </Suspense>
);
