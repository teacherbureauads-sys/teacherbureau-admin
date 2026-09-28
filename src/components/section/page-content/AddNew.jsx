"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPageById,
  fetchPages,
  upsertPage,
} from "~/lib/redux/slices/page-slice";

const emptyDoc = {
  pageKey: "",
  url: "",
  type: "static",
  title: "",
  description: "",
  content: "",
  heroImage: "",
  published: false,
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    canonical: "",
    robots: "index, follow",
    favicon: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "",
      url: "",
    },
  },
};

export default function CreateNewPage() {
  const dispatch = useDispatch();
  const {
    pageList,
    singlePageDetails,
    documentCount,
    dataLoading,
    loading,
    error,
  } = useSelector((s) => s.pages);

  const [form, setForm] = useState(emptyDoc);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const ROBOTS_OPTIONS = [
    "index",
    "noindex",
    "follow",
    "nofollow",
    "noarchive",
    "nosnippet",
    "notranslate",
    "noimageindex",
    "max-snippet:-1",
    "max-snippet:0",
    "max-image-preview:large",
    "max-image-preview:standard",
    "max-image-preview:none",
    "max-video-preview:-1",
    "max-video-preview:0",
    // For time-based deindexing, set a valid RFC-850 date on save:
    // e.g., "unavailable_after: Fri, 31 Dec 2027 23:59:59 GMT"
    "unavailable_after: <RFC-850-date>",
  ];

  // Load list
  useEffect(() => {
    dispatch(fetchPages({ page, limit }));
  }, [page, limit, dispatch]);

  // Prefill when single loaded
  useEffect(() => {
    if (singlePageDetails?._id) {
      setForm(singlePageDetails);
    }
  }, [singlePageDetails]);

  const onChange = (path, value) => {
    setForm((prev) => {
      const clone = structuredClone(prev);
      const parts = path.split(".");
      let ref = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        const k = parts[i];
        if (!(k in ref)) ref[k] = {};
        ref = ref[k];
      }
      ref[parts[parts.length - 1]] = value;
      return clone;
    });
  };

  const onKeywordsChange = (value) => {
    onChange("seo.keywords", value);
  };

  const onSchemaChange = (value) => {
    onChange("seo.schema", value);
  };

  const selectedRobots = useMemo(
    () =>
      (form?.seo?.robots || "index, follow")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [form?.seo?.robots]
  );

  function handleRobotsChange(e) {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value);
    onChange("seo.robots", values.join(", "));
  }

  const resetForm = () => {
    setForm(emptyDoc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // prepare safe payload
    const payload = {
      ...form,
      // convert keywords if user typed a string
      seo: {
        ...form.seo,
        keywords:
          typeof form.seo?.keywords === "string"
            ? (form.seo?.keywords)
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : form.seo?.keywords || [],
        // if schema in textarea string, keep as string; thunk will try JSON.parse
        schema: form.seo?.schema,
      },
    };

    await dispatch(upsertPage({ data: payload }));
    // refresh list (e.g. if new created)
    dispatch(fetchPages({ page, limit }));
  };

  // To show “Google-like” preview
  const previewTitle =
    form.seo?.metaTitle?.trim() || form.title?.trim() || "Untitled Page";
  const previewUrl = (form.seo?.canonical || form.url || "https://yoursite.com")
    .replace(/\/+$/, "")
    .toString();
  const previewDesc = (
    form.seo?.metaDescription ||
    form.description ||
    ""
  ).toString();

  // schema text area value
  const schemaText = useMemo(() => {
    if (!form.seo?.schema) return "";
    if (typeof form.seo.schema === "string") return form.seo.schema;
    try {
      return JSON.stringify(form.seo.schema, null, 2);
    } catch {
      return "";
    }
  }, [form.seo?.schema]);

  return (
    <div className="w-full bg-white p-5 rounded-2xl">
      <div className="w-full flex flex-row items-center justify-between">
        <h1 className="text-2xl font-semibold">Page Content Management</h1>

        <Link
          href="/page-manager"
          type="submit"
          className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
        >
          Sell all pages
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Basic</h2>
          </div>

          {/* Hidden id for updates */}
          {form._id && (
            <div>
              <label className="block text-sm font-medium mb-1">_id</label>
              <input
                className="w-full rounded border px-3 py-2 bg-gray-100"
                value={form._id}
                disabled
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Page Key (slug)
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.pageKey}
              onChange={(e) => onChange("pageKey", e.target.value)}
              placeholder="privacy-policy"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.url}
              onChange={(e) => onChange("url", e.target.value)}
              placeholder="/privacy-policy"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={form.type}
              onChange={(e) => onChange("type", e.target.value)}
            >
              <option value="static">static</option>
              <option value="dynamic">dynamic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Privacy Policy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 min-h-[100px]"
              value={form.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Short page description…"
            />
          </div>

          {form.type === "dynamic" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Content (HTML)
              </label>
              <textarea
                className="w-full rounded border px-3 py-2 min-h-[180px] font-mono"
                value={form.content || ""}
                onChange={(e) => onChange("content", e.target.value)}
                placeholder="<h1>Privacy Policy</h1>..."
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Hero Image
              </label>
              <input
                className="w-full rounded border px-3 py-2"
                value={form.heroImage || ""}
                onChange={(e) => onChange("heroImage", e.target.value)}
                placeholder="https://yoursite.com/assets/privacy-hero.jpg"
              />
            </div>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={!!form.published}
                onChange={(e) => onChange("published", e.target.checked)}
              />
              <span className="text-sm">Published</span>
            </label>
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">SEO</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.seo?.metaTitle || ""}
              onChange={(e) => onChange("seo.metaTitle", e.target.value)}
              placeholder="Privacy Policy - MySite"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Meta Description
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 min-h-[90px]"
              value={form.seo?.metaDescription || ""}
              onChange={(e) => onChange("seo.metaDescription", e.target.value)}
              placeholder="Read our privacy policy..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Keywords (comma separated)
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              value={
                Array.isArray(form.seo?.keywords)
                  ? form.seo?.keywords?.join(", ")
                  : form.seo?.keywords || ""
              }
              onChange={(e) => onKeywordsChange(e.target.value)}
              placeholder="privacy, policy, data"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Canonical
              </label>
              <input
                className="w-full rounded border px-3 py-2"
                value={form.seo?.canonical || ""}
                onChange={(e) => onChange("seo.canonical", e.target.value)}
                placeholder="https://yoursite.com/privacy-policy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Robots (select multiple)
              </label>
              <select
                multiple
                className="w-full rounded border px-3 py-2 min-h-[140px]"
                value={selectedRobots}
                onChange={handleRobotsChange}
              >
                {ROBOTS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple. Result:&nbsp;
                <span className="font-mono">{selectedRobots.join(", ")}</span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Favicon</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.seo?.favicon || ""}
              onChange={(e) => onChange("seo.favicon", e.target.value)}
              placeholder="https://yoursite.com/favicon.ico"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">OG Title</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.seo?.ogTitle || ""}
              onChange={(e) => onChange("seo.ogTitle", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              OG Description
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 min-h-[90px]"
              value={form.seo?.ogDescription || ""}
              onChange={(e) => onChange("seo.ogDescription", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">OG Image</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={form.seo?.ogImage || ""}
              onChange={(e) => onChange("seo.ogImage", e.target.value)}
              placeholder="https://yoursite.com/assets/privacy-og.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Schema (JSON-LD)
            </label>
            <textarea
              className="w-full rounded border px-3 py-2 min-h-[160px] font-mono"
              value={schemaText}
              onChange={(e) => onSchemaChange(e.target.value)}
              placeholder='{"@context":"https://schema.org","@type":"WebPage","name":"Privacy Policy"}'
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
              disabled={loading}
            >
              {form._id ? "Update Page" : "Create Page"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Search Preview */}
      <div className="mt-10">
        <h3 className="text-lg font-medium mb-3">Preview (Google-like)</h3>
        <div className="rounded border p-4 max-w-3xl bg-white">
          <div className="text-[#202124] text-xl leading-6 hover:underline cursor-default">
            {previewTitle}
          </div>
          <div className="text-[#006621] text-sm mt-1">{previewUrl}</div>
          <div className="text-[#4d5156] text-sm mt-1 line-clamp-3">
            {previewDesc}
          </div>
        </div>
      </div>
    </div>
  );
}
