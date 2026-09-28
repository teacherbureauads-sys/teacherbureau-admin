"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaginationV2 from "~/components/common/PaginationV2";
import {
  fetchPageById,
  fetchPages,
  upsertPage,
} from "~/lib/redux/slices/page-slice";

const AllPageList = ({ page }) => {
  const limit = 10;
  const dispatch = useDispatch();
  const {
    pageList,
    singlePageDetails,
    documentCount,
    dataLoading,
    loading,
    error,
  } = useSelector((s) => s.pages);
  // const handleDelete = async (id) => {
  //   if (!confirm("Delete this page permanently?")) return;
  //   await dispatch(deletePage(id));
  //   dispatch(fetchPages({ page, limit }));
  // };

  // Load list
  useEffect(() => {
    dispatch(fetchPages({ page, limit }));
  }, [page, limit, dispatch]);

  return (
    <div className="w-full  bg-white p-5 rounded-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Pages</h2>

        <Link
          href="/page-manager/add-new"
          type="submit"
          className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
        >
          Add new
        </Link>
      </div>

      {dataLoading ? (
        <div className="mt-4">Loading list…</div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 border">Title</th>
                <th className="text-left p-2 border">Slug</th>
                <th className="text-left p-2 border">URL</th>
                <th className="text-left p-2 border">Type</th>
                <th className="text-left p-2 border">Published</th>
                <th className="text-left p-2 border">Updated</th>
                <th className="text-left p-2 border w-44">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageList.map((p) => (
                <tr key={p._id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{p.title}</td>
                  <td className="p-2 border">{p.pageKey}</td>
                  <td className="p-2 border">{p.url}</td>
                  <td className="p-2 border">{p.type}</td>
                  <td className="p-2 border">{p.published ? "Yes" : "No"}</td>
                  <td className="p-2 border">
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "-"}
                  </td>
                  <td className="p-2 border">
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 rounded bg-blue-600 text-white text-xs hover:opacity-90"
                        onClick={() => handleEdit()}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:opacity-90"
                        onClick={() => handleDelete()}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageList.length === 0 && (
                <tr>
                  <td
                    className="p-3 border text-center text-gray-500"
                    colSpan={7}
                  >
                    No pages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center">
        <PaginationV2 total={documentCount} />
      </div>
    </div>
  );
};

export default AllPageList;
