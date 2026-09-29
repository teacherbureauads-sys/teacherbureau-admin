// =====================================================
// ACTIVE WEBSITE / SITE MANAGEMENT
// =====================================================

import axios from "axios";

export const DEFAULT_SITE = "hometuitionacademy";

// IMPORTANT:
// Dashboard + Redux slices dono isi key ko use karte hain.
const STORAGE_KEY = "selectedSite";

// Get currently selected website
export function getActiveSite() {
  if (typeof window === "undefined") {
    return DEFAULT_SITE;
  }

  try {
    return (
      window.localStorage.getItem(STORAGE_KEY) ||
      DEFAULT_SITE
    );
  } catch (error) {
    return DEFAULT_SITE;
  }
}

// Change currently selected website
export function setActiveSite(siteKey) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, siteKey);
    } catch (error) {
      console.error("Unable to save selected site:", error);
    }

    // Reload so every Redux API request uses the new website
    window.location.reload();
  }
}

// Set default x-site header for Axios
if (typeof window !== "undefined") {
  axios.defaults.headers.common["x-site"] = getActiveSite();
}
