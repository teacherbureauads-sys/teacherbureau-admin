// Which website the admin is currently editing (blogs, services, categories,
// leads...). Stored in the browser and sent to the backend on every request
// as the `x-site` header, so the backend only shows / saves data for that site.
import axios from "axios";

export const DEFAULT_SITE = "hometuitionacademy";
const STORAGE_KEY = "admin_site";

export function getActiveSite() {
  if (typeof window === "undefined") return DEFAULT_SITE;
  try {
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_SITE;
  } catch {
    return DEFAULT_SITE;
  }
}

export function setActiveSite(key) {
  try {
    window.localStorage.setItem(STORAGE_KEY, key);
  } catch {}
  // Reload so every page/list re-fetches for the newly selected site.
  window.location.reload();
}

// Runs when this module is first imported in the browser (see
// app/redux-provider.js), i.e. before any page starts fetching data.
if (typeof window !== "undefined") {
  axios.defaults.headers.common["x-site"] = getActiveSite();
}
