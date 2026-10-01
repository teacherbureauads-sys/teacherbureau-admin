"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { errorToast, successToast } from "~/utils/toastMessage";
import { getActiveSite, setActiveSite } from "~/lib/site";

const BASE = process.env.BACKEND_API_BASE_URL;
const DEFAULT_SITE = "hometuitionacademy";

const toKey = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

export default function SitesManager() {
  const token = Cookies.get("access_token");
  const [sites, setSites] = useState([]);
  const [active, setActive] = useState("");
  const [form, setForm] = useState({ name: "", key: "", domain: "" });
  const [keyTouched, setKeyTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/api/admin/site`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSites(res.data?.data || []);
    } catch {
      errorToast("Could not load websites");
    }
  }, [token]);

  useEffect(() => {
    setActive(getActiveSite());
    load();
  }, [load]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "name" && !keyTouched) next.key = toKey(value);
      return next;
    });
    if (name === "key") setKeyTouched(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${BASE}/api/admin/site`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      successToast("Website added");
      setForm({ name: "", key: "", domain: "" });
      setKeyTouched(false);
      load();
    } catch (error) {
      errorToast(error?.response?.data?.message || "Could not add website");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (site) => {
    // Deleting only removes it from this list/dropdown — its blogs, services,
    // categories and leads stay in the database under this key, untouched.
    const confirmed = window.confirm(
      `Remove "${site.name}" (${site.key}) from the website list?\n\nIts blogs, services, categories and leads will NOT be deleted — they stay saved under this key and come back if you re-add a website with the same key.`
    );
    if (!confirmed) return;

    setDeletingId(site._id);
    try {
      await axios.delete(`${BASE}/api/admin/site/${site._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      successToast("Website removed");
      if (active === site.key) setActiveSite(DEFAULT_SITE);
      load();
    } catch (error) {
      errorToast(error?.response?.data?.message || "Could not remove website");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8">
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-1">Websites</h2>
        <p className="text-[13px] text-gray-500 mb-4">
          Every website uses this same admin panel and database. Choose which
          one you are editing from the dropdown in the sidebar — blogs,
          services, categories and leads are kept separate for each website.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Key (SITE_KEY)</th>
                <th className="px-4 py-3 font-semibold">Domain</th>
                <th className="px-4 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site._id} className="border-b">
                  <td className="px-4 py-3 font-medium">{site.name}</td>
                  <td className="px-4 py-3">
                    <code className="bg-gray-100 rounded px-2 py-0.5 text-[12px]">
                      {site.key}
                    </code>
                  </td>
                  <td className="px-4 py-3">{site.domain || "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {active === site.key ? (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                          Editing now
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveSite(site.key)}
                          className="px-3 py-1 rounded-md border border-blue-500 text-blue-600 text-xs hover:bg-blue-50"
                        >
                          Edit this website
                        </button>
                      )}

                      {site.key === DEFAULT_SITE ? (
                        <span
                          title="The default website can't be removed"
                          className="px-3 py-1 rounded-md border border-gray-200 text-gray-300 text-xs cursor-not-allowed"
                        >
                          Delete
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDelete(site)}
                          disabled={deletingId === site._id}
                          className="px-3 py-1 rounded-md border border-red-400 text-red-600 text-xs hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === site._id ? "Removing..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {sites.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                    No websites yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 max-w-xl"
      >
        <h3 className="text-base font-semibold">Add a website</h3>
        <input
          required
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Website name (e.g. Teachers Bureau)"
          className="border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <input
          required
          name="key"
          value={form.key}
          onChange={handleChange}
          placeholder="Key (e.g. teachersbureau)"
          className="border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <input
          name="domain"
          value={form.domain}
          onChange={handleChange}
          placeholder="Domain (optional, e.g. teachersbureau.in)"
          className="border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <p className="text-[12px] text-gray-500">
          Key: 2-40 lowercase letters, numbers or hyphens. Use the same key as
          SITE_KEY in that website&apos;s Vercel settings. It cannot be changed
          later.
        </p>
        <button
          disabled={saving}
          type="submit"
          className="self-start rounded-md bg-blue-600 text-white text-sm font-medium px-5 py-2 hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Adding..." : "Add website"}
        </button>
      </form>
    </div>
  );
}
