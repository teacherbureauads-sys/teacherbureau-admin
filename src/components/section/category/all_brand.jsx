"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "~/components/common/pagination";
import useAuth from "~/hooks/useAuth";
import useAxios from "~/hooks/useAxios";
import { errorToast } from "~/utils/toastMessage";
import { useCookies } from "~/utils/useCookies";

const AllBrand = () => {
  const [dataLoading, setDataLoading] = useState(true);

  const [brands, setBrands] = useState({
    brandList: [],
    currentPage: 1,
    perPage: 7,
    totalCount: 50,
    pages: 5,
  });
  const { getCookie } = useCookies();
  const { user, loading, userLoading } = useAuth();
  const axios = useAxios();
  const access_token = getCookie("access_token");
  const { isAuthenticated = false, userId = null } = user;

  const indexOfLastBrand = brands.currentPage * brands.perPage;
  const indexOfFirstBrand = indexOfLastBrand - brands.perPage;
  const currentBrands = brands.brandList.slice(
    indexOfFirstBrand,
    indexOfLastBrand
  );

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > brands?.pages) return;
    setBrands((prev) => ({
      ...prev,
      currentPage: pageNumber,
    }));
  };

  const getBrand = async (token) => {
    try {
      const response = await axios.get("/api/admin/brand", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const brand = response?.data?.data;
      const totalCount = response?.data?.count;
      setBrands((prev) => ({
        ...prev,
        brandList: brand,
        pages: Math.ceil(brand?.length / 7),
        totalCount: brand?.length,
      }));
      setDataLoading(false);
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      errorToast(message);
      setDataLoading(false);
    }
  };

  useEffect(() => {
    access_token && userId && getBrand(access_token);
    return () => {};
  }, [access_token, userId]);

  return (
    <section className="w-full">
      <div className="bg-white min-h-[80vh] flex flex-col justify-between  relative sm:rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {dataLoading && (
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
          {!dataLoading && (
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-[12px] text-gray-700  border-b border-blue-400">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold  ">
                    Brand Name
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold  ">
                    Brand ID
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Brand Image
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-semibold text-center"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-[12px] w-full">
                {currentBrands?.map((data) => {
                  const {
                    _id,
                    brandName,
                    description,
                    brandImage = null,
                  } = data;
                  return (
                    <tr key={_id} className="border-b ">
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap first-letter:capitalize"
                      >
                        {brandName}
                        <br />
                        <span className="text-[10px] text-gray-400">
                          {description}
                        </span>
                      </th>
                      <td className="px-4 py-3">{_id}</td>
                      <td className="px-4 py-3">
                        <img
                          title={brandName}
                          alt={brandName}
                          src={brandImage}
                          className="h-10 w-10 rounded-md object-cover bg-gray-100"
                        />
                      </td>
                      <td className="px-4 py-3 flex-center">
                        <div className="w-full flex flex-row justify-center gap-2">
                          <button className="hover:bg-blue-100 transition-all duration-100 rounded-lg p-2 text-[0.9rem] text-blue-500">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              stroke-width="0"
                              viewBox="0 0 24 24"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path fill="none" d="M0 0h24v24H0z"></path>
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 5.63l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83a.996.996 0 0 0 0-1.41z"></path>
                            </svg>
                          </button>
                          <button className="hover:bg-blue-100 transition-all duration-100 rounded-lg p-2 text-[0.9rem] text-blue-500">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              stroke-width="0"
                              viewBox="0 0 24 24"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <Pagination
          totalCount={brands?.totalCount}
          currentPage={brands.currentPage}
          totalPages={brands.pages}
          handlePageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default AllBrand;
