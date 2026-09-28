"use client";

import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaginationV2 from "~/components/common/PaginationV2";
import { deleteQuery, fetchQueries } from "~/lib/redux/slices/query-slice";
import { toast } from "react-toastify";
import QueryRow from "./QueryRow";

const DOC_LIMIT = 10;

const QueryList = ({ page = 1 }) => {
  const dispatch = useDispatch();
  const token = Cookies.get("access_token");

  const {
    queryList = [],
    dataLoading,
    documentCount = 0,
  } = useSelector((state) => state.query);

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this query?"
  );

  if (!confirmDelete) return;

  try {
    await dispatch(
      deleteQuery({
        token,
        id,
      })
    ).unwrap();
    toast.success("Query deleted successfully");
    dispatch(
      fetchQueries({
        token,
        filters: {
          page,
          limit: DOC_LIMIT,
        },
      })
    );
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};

  useEffect(() => {
    if (token) {
      dispatch(
        fetchQueries({
          token,
          filters: {
            page,
            limit: DOC_LIMIT,
          },
        }),
      );
    }
  }, [dispatch, token, page]);

  return (
    <section className="w-full pb-5">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Query List</h2>
        </div>

        <div className="overflow-x-auto">
          {dataLoading && queryList.length < 1 && (
            <div className="w-full flex flex-col gap-3 p-4">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="w-full h-10 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          )}

          <table className="w-full text-sm text-left text-gray-600">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Sr. No.</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold text-center">Mobile</th>
                <th className="px-4 py-3 font-semibold text-center">Role</th>
                <th className="px-4 py-3 font-semibold text-center">
                  Tuition Mode
                </th>
                <th className="px-4 py-3 font-semibold text-center">
                  Location
                </th>
                <th className="px-4 py-3 font-semibold">Message</th>
                <th className="px-4 py-3 font-semibold text-center">Source</th>
                <th className="px-4 py-3 font-semibold text-center">Date</th>
                <th className="px-4 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {queryList?.length > 0
                ? queryList.map((query, index) => (
                    <QueryRow
                      key={query._id}
                      data={query}
                      srNo={index + 1}
                      handleDelete={handleDelete}
                    />
                  ))
                : !dataLoading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        No Queries Found
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center py-4 border-t">
          <PaginationV2 pageSize={DOC_LIMIT} total={documentCount} />
        </div>
      </div>
    </section>
  );
};

export default QueryList;
