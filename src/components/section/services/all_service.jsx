"use client";
import Cookies from "js-cookie";
import moment from "moment/moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import PaginationV2 from "~/components/common/PaginationV2";
import { createBlog } from "~/lib/redux/slices/blog-slice";
import { deleteService, fetchServices } from "~/lib/redux/slices/service-slice";
import { limitTextLength } from "~/utils/limitText";

const TableRow = ({ data = {},page  }) => {
  const [isPublished, setIsPublished] = useState(false);
  const dispatch = useDispatch();

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure want to delete this service?"
  );

  if (!confirmDelete) return;

  const token = Cookies.get("access_token");

  try {
    await dispatch(
      deleteService({
        slug: id,
        token,
      })
    ).unwrap();

    await dispatch(
      fetchServices({
        token,
        filters: {
          limit: DOC_LIMIT,
          page,
        },
      })
    );

    toast.success("Service deleted successfully");
  } catch (error) {
    console.error("Delete service failed:", error);
    toast.error(typeof error === "string" ? error : "Something went wrong");
  }
};

  const {
    _id,
    thumbnail = {},
    heading,
    slug,
    category,
    createdAt,
    description,
  } = data;

  const publishDate = moment(createdAt).format("DD MMM YY");

  useEffect(() => {
    setIsPublished(data?.published);
    return () => {};
  }, [data?.published]);

  return (
    <tr key={_id} className="border-b ">
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap first-letter:capitalize"
      >
        {limitTextLength(heading, 35)}
        <br />
        <span className="text-[10px] text-gray-600">
          {limitTextLength(description, 60)}
        </span>
      </th>
      <td className="px-4 py-3 flex-center text-black">
        {category || "Not provided"}
      </td>
      <td className="px-4 py-3 text-blue-600 underline text-center">
        <Link
          target="_blank"
          href={`https://www.itsoftworld.com/services/${slug}`}
        >
          /{limitTextLength(slug, 20)}
        </Link>
      </td>
      <td className="px-4 py-3 text-center text-black">{publishDate}</td>
      <td className="px-4 py-3 flex-center">
        <Link
          href={`/services/update-service?serviceId=${_id}`}
          className="hover:bg-blue-100 transition-all duration-100 rounded-lg p-1.5 text-[0.9rem] text-blue-500"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 5.63l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 0 0 0-1.41z"></path>
          </svg>
        </Link>
        <button
          onClick={() => handleDelete(_id)}
          className="hover:bg-red-100 transition-all duration-100 rounded-lg p-1.5 text-[0.9rem] text-red-500"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M17 6V4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2H3v2h1v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8h1V6h-4zM9 5h6v1H9V5zm9 14H6V8h12v11zM9 10h2v6H9zm4 0h2v6h-2z"></path>
          </svg>
        </button>
      </td>
    </tr>
  );
};
export const AllService = ({ page }) => {
  const currentBrands = [];
  const dispatch = useDispatch();
  const { serviceList, dataLoading, documentCount } = useSelector(
    (state) => state.service,
  );

  useEffect(() => {
    const token = Cookies.get("access_token");
    token &&
      dispatch(fetchServices({ token, filters: { limit: DOC_LIMIT, page } }));
  }, [page]);

  return (
    <section className="w-full  pb-5">
      <div className="bg-white flex flex-col justify-between  relative sm:rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {dataLoading && serviceList?.length < 1 && (
            <div className="w-full flex flex-col gap-3 p-4">
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />{" "}
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
              <div className="w-full py-2 bg-gray-200 animate-pulse" />
            </div>
          )}
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-[12px] text-gray-700  border-b border-blue-400 ">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold   first-letter:capitalize"
                >
                  title
                </th>

                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-center first-letter:capitalize"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold  text-center first-letter:capitalize"
                >
                  slug
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold first-letter:capitalize text-center"
                >
                  Created Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-semibold text-center first-letter:capitalize"
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-[12px] w-full">
              {serviceList?.map((data) => {
                const {
                  _id,
                  thumbnail = {},
                  title,
                  slug,
                  brandName,
                  createdAt,
                  description,
                  brandImage = null,
                } = data;

                const publishDate = moment(createdAt).format("DD MMM YY");
                return <TableRow key={_id} data={data}   page={page} />;
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center py-3">
          <PaginationV2 pageSize={DOC_LIMIT} total={documentCount} />
        </div>
      </div>
    </section>
  );
};

const DOC_LIMIT = 15;
