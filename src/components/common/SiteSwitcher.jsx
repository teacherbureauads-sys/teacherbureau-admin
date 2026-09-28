"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { DEFAULT_SITE, getActiveSite, setActiveSite } from "~/lib/site";

export default function SiteSwitcher() {
  const [sites, setSites] = useState([]);
  const [active, setActive] = useState(DEFAULT_SITE);

  useEffect(() => {
    setActive(getActiveSite());
    const token = Cookies.get("access_token");
    if (!token) return;
    axios
      .get(`${process.env.BACKEND_API_BASE_URL}/api/admin/site`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSites(res.data?.data || []))
      .catch(() => {});
  }, []);

  const options = sites.some((s) => s.key === active)
    ? sites
    : [{ key: active, name: active }, ...sites];

  return (
    <div className="mx-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <label
        htmlFor="site-switcher"
        className="block text-[11px] font-medium text-blue-700 mb-1"
      >
        Website you are editing
      </label>
      <select
        id="site-switcher"
        value={active}
        onChange={(e) => setActiveSite(e.target.value)}
        className="w-full rounded-md border border-blue-200 bg-white px-2 py-2 text-[13px] font-medium text-gray-900 outline-none focus:border-blue-500"
      >
        {options.map((site) => (
          <option key={site.key} value={site.key}>
            {site.name}
          </option>
        ))}
      </select>
    </div>
  );
}
