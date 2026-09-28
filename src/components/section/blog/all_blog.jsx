"use client";
import Cookies from "js-cookie";
import moment from "moment/moment";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PaginationV2 from "~/components/common/PaginationV2";
import { createBlog, deleteBlog, fetchBlogs } from "~/lib/redux/slices/blog-slice";
import { limitTextLength } from "~/utils/limitText";

const TableRow = ({ data = {} }) => {
  const [isPublished, setIsPublished] = useState(false);
  const dispatch = useDispatch();

  const handleToggle = async (blog_id) => {
    // Read the token fresh every time instead of once at module load,
    // otherwise a re-login or expired/rotated cookie keeps using a stale value.
    const token = Cookies.get("access_token");
    const nextPublished = !isPublished;
    const resultAction = await dispatch(
      createBlog({
        token,
        blogId: blog_id,
        blogData: { published: nextPublished },
      }),
    );

    if (createBlog.fulfilled.match(resultAction)) {
      setIsPublished(nextPublished);
      toast.success(nextPublished ? "Blog published" : "Blog unpublished");
    } else {
      toast.error(resultAction.payload || "Failed to update publish status");
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = confirm("Are you sure want to delete this blog?");
  const token = Cookies.get("access_token");

  try {
    if (confirmDelete) {
      await dispatch(
        deleteBlog({
          blogId: id,
          token,
        })
      ).unwrap();

      toast.success("Blog deleted successfully");
    }
  } catch (error) {
    console.error("Delete blog failed:", error);
    toast.error(typeof error === "string" ? error : "Something went wrong");
  }
};

  const {
    _id,
    thumbnail = {},
    title,
    slug,
    category = {},
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
        <div className="flex flex-row items-center gap-2">
          <img
            height={50}
            width={50}
            title={thumbnail?.name}
            alt={thumbnail?.alt}
            src={thumbnail?.url}
            quality={50}
            className="h-10 w-10 rounded-md object-cover bg-gray-100"
          />
          <div>
            {limitTextLength(title, 35)}
            <br />
            <span className="text-[10px] text-gray-600">
              {limitTextLength(description, 60)}
            </span>
          </div>
        </div>
      </th>
      <td className="px-4 py-3 flex-center text-black">
        {category?.name || "Not provided"}
      </td>
      <td className="px-4 py-3 text-blue-600 underline text-center">
        <Link
          target="_blank"
          href={`https://www.itsoftworld.com/blog/${category?.slug}/${slug}`}
        >
          /{limitTextLength(slug, 20)}
        </Link>
      </td>
      <td className="px-4 py-3 text-center text-black">{publishDate}</td>
      <td className="px-4 py-3 flex-row flex-center gap-2">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            className="sr-only peer"
            onChange={() => handleToggle(_id)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600" />
        </label>

        <Link
          href={`/blog-post/create-blog?blogId=${slug}`}
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
export const AllBlog = ({ page }) => {
  const dispatch = useDispatch();
  const { blogList, dataLoading, documentCount } = useSelector(
    (state) => state.blog,
  );

  useEffect(() => {
    const token = Cookies.get("access_token");
    token &&
      dispatch(fetchBlogs({ token, filters: { page, limit: DOC_LIMIT } }));
  }, [page]);

  return (
    <section className="w-full pb-5">
      <div className="bg-white  flex flex-col justify-between  relative sm:rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {dataLoading && blogList?.length < 1 && (
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
            <thead className="text-[12px] text-gray-900  border-b border-blue-400 ">
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
              {blogList?.map((data) => {
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
                return <TableRow key={_id} data={data} />;
              })}
            </tbody>
          </table>

          <div className="flex justify-center py-3">
            <PaginationV2 pageSize={DOC_LIMIT} total={documentCount} />
          </div>
        </div>
      </div>
    </section>
  );
};

const DOC_LIMIT = 15;
