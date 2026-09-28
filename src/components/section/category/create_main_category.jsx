"use client";
import { useState, useEffect } from "react";
import { Button, Input } from "~/components/common/input_box";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "~/lib/redux/slices/main-category-slice";
import { errorToast, successToast } from "~/utils/toastMessage";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const CreateMainCategory = ({ categoryId = null }) => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
    slug: null,
    image: {
      _id: "",
      name: "",
      alt: "",
      url: "",
    },
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const {
    loading,
    categoryList = [],
    dataLoading = true,
    documentCount,
    error,
  } = useSelector((state) => state.category);

  const token = Cookies.get("access_token");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event, data, id) => {
    event.preventDefault();

    const resultAction = await dispatch(
      createCategory({ token, categoryId: id, categoryData: data }),
    );

    if (createCategory.fulfilled.match(resultAction)) {
      setCategory({
        name: "",
        description: "",
        slug: "",
        image: {
          _id: "",
          name: "",
          alt: "",
          url: "",
        },
      });
      if (id) {
        successToast("Category updated");
        router.replace("/categories/main-category");
      } else {
        successToast("Category created");
      }
    } else {
      const message = resultAction.payload;
      errorToast(message);
    }
  };

  const generateSlug = (text) => {
    if (text && text?.length > 3) {
      const split = text?.split(" ");
      const slug = split.join("-");
      setCategory((prev) => ({ ...prev, slug: slug.toLowerCase() }));
    }
  };

  useEffect(() => {
    token &&
      categoryList?.length < 1 &&
      dispatch(fetchCategories({ token, filters: { limit: 200 } }));
    return () => {};
  }, [token]);

  // form prefilling
  useEffect(() => {
    if (categoryId) {
      const selectedCategory = categoryList?.find(
        (category) => category?._id === categoryId,
      );

      if (selectedCategory) {
        const { _id, name, description, slug, image } = selectedCategory;

        setCategory({
          name,
          description,
          slug,
          image,
        });
      }
    }

    return () => {};
  }, [categoryId, categoryList]);

  const handleddelete = async (id) => {
    const confirmDelete = confirm("Are you sure want to delete this category?");
    try {
      if (confirmDelete) {
        await dispatch(deleteCategory({ id, token })).unwrap();
        successToast("Category deleted successfully");
      }
    } catch (error) {
      console.error("Delete category failed:", error);
      errorToast(typeof error === "string" ? error : "Failed to delete category");
    }
  };

  return (
    <main className="w-full grid grid-cols-3 gap-3">
      {/* form  */}
      <form
        onSubmit={(e) => handleSubmit(e, category, categoryId)}
        className="col-span-2 w-full h-fit flex flex-col gap-4 bg-white p-5 rounded-xl"
      >
        <h1 className="text-md font-semibold text-gray-700">
          {categoryId ? (
            <>
              Update{" "}
              <span className="text-gray-500">
                &apos;{category?.name}&apos;
              </span>
            </>
          ) : (
            "Create Main Category"
          )}
        </h1>
        <Input
          required
          name="name"
          value={category?.name}
          onChange={handleChange}
          type="text"
          label="Name"
          placeholder="eg. Web Development"
        />
        <Input
          required
          name="slug"
          value={category?.slug}
          onChange={handleChange}
          type="text"
          label="Slug"
          placeholder="web-development"
          icon={
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"></path>
            </svg>
          }
          onIconClick={() => generateSlug(category?.name)}
        />
        <textarea
          name="description"
          value={category?.description}
          onChange={handleChange}
          rows={2}
          type="text"
          className="text-[13px] disabled:cursor-not-allowed disabled:opacity-80  w-full outline-none border border-gray-200 rounded-[5px] p-[10px] bg-transparent"
          placeholder="Category description..."
        />

        <div className={categoryId ? "grid grid-cols-2 gap-2" : "w-full"}>
          <Button
            disabled={loading || dataLoading}
            loading={loading}
            type="submit"
            customClass="w-full px-5 text-white bg-blue-500"
          >
            {categoryId ? "Update category" : "Create category"}
          </Button>

          {categoryId && (
            <Link href="/categories/main-category">
              <Button
                onClick={() =>
                  setCategory({
                    name: "",
                    description: "",
                    slug: "",
                    image: {
                      _id: "",
                      name: "",
                      alt: "",
                      url: "",
                    },
                  })
                }
                type="text"
                customClass="w-full px-5 text-gray-500 bg-gray-200"
              >
                Cancel
              </Button>
            </Link>
          )}
        </div>
      </form>

      {/* category list  */}
      <section className="h-auto w-full">
        <div className="w-full flex flex-col gap-4 bg-white p-3 rounded-xl">
          <h1 className="text-md font-semibold text-gray-700">
            Category List ({documentCount})
          </h1>

          <div className="w-full flex flex-col gap-2">
            {categoryList?.map((data, index) => {
              const { _id, slug, description, name, image, createdAt } = data;
              return (
                <div
                  key={_id}
                  className="w-full bg-gray-50 rounded-lg p-3 flex flex-col gap-1"
                >
                  <h3 className="font-semibold text-gray-800 text-sm first-letter:capitalize">
                    {name}
                  </h3>
                  <span className="w-fit text-[13px] rounded-lg bg-slate-200 px-2 py-1 text-gray-600">
                    {slug}
                  </span>
                  <p className="w-full text-[14px] text-gray-600 break-words line-clamp-3">
                    {description}
                  </p>
                  <div className="w-full flex flex-row items-center">
                    <Link
                      href={`/categories/main-category?categoryId=${_id}`}
                      className="hover:bg-blue-100 transition-all duration-100 rounded-lg p-1.5 text-[0.9rem] text-blue-500"
                    >
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
                    </Link>
                    <button
                      onClick={() => handleddelete(_id)}
                      className="hover:bg-blue-100 transition-all duration-100 rounded-lg p-1.5 text-[0.9rem] text-blue-500"
                    >
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
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
