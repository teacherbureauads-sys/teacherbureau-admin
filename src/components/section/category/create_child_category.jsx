"use client";
import { useState, useEffect } from "react";
import { Button, Input, SelectBox } from "~/components/common/input_box";
import { useDispatch, useSelector } from "react-redux";
import { createChildCategory, deleteChildCategory } from "~/lib/redux/slices/child-category-slice";
import { errorToast, successToast } from "~/utils/toastMessage";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchSubCategories } from "~/lib/redux/slices/sub-category-slice";
import { fetchChildCategories } from "~/lib/redux/slices/child-category-slice";
export const CreateChildCategory = ({ childCategoryId = null }) => {
  const [childCategory, setChildCategory] = useState({
    name: "",
    description: "",
    slug: "",
    subCategory: "", // Sub-category ID
    image: {
      _id: "",
      name: "",
      alt: "",
      url: "",
    },
  });
  const [subCategories, setSubCategories] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const {
    loading,
    childCategoryList = [],
    dataLoading = true,
    documentCount,
    error,
  } = useSelector((state) => state.childCategory);
  const { subCategoryList = [] } = useSelector((state) => state.subCategory);
  const token = Cookies.get("access_token");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setChildCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event, data, id) => {
    event.preventDefault();

    const resultAction = await dispatch(
      createChildCategory({
        token,
        childCategoryId: id,
        childCategoryData: data,
      })
    );

    if (createChildCategory.fulfilled.match(resultAction)) {
      setChildCategory({
        name: "",
        description: "",
        slug: "",
        subCategory: "",
        image: {
          _id: "",
          name: "",
          alt: "",
          url: "",
        },
      });
      if (id) {
        successToast("Child category updated");
        router.replace("/categories/child-category");
      } else {
        successToast("Child category created");
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
      setChildCategory((prev) => ({ ...prev, slug: slug.toLowerCase() }));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure want to delete this child category?"
    );
    if (!confirmDelete) return;

    const freshToken = Cookies.get("access_token");
    try {
      await dispatch(
        deleteChildCategory({ id, token: freshToken })
      ).unwrap();
      successToast("Child category deleted successfully");
    } catch (error) {
      console.error("Delete child category failed:", error);
      errorToast(
        typeof error === "string" ? error : "Failed to delete child category"
      );
    }
  };

  useEffect(() => {
    dispatch(fetchSubCategories({ token }));
    return () => {};
  }, [token]);

  useEffect(() => {
    dispatch(fetchChildCategories({ token }));
    return () => {};
  }, []);

  // form prefilling
  useEffect(() => {
    if (childCategoryId) {
      const selectedSubCategory = childCategoryList?.find(
        (subCategory) => subCategory?._id === childCategoryId
      );

      if (selectedSubCategory) {
        const { _id, name, description, slug, subCategory, image } =
          selectedSubCategory;

        setChildCategory({
          name,
          description,
          slug,
          subCategory,
          image,
        });
      }
    }

    return () => {};
  }, [childCategoryId, childCategoryList]);

  // modify main cat
  useEffect(() => {
    if (subCategoryList && subCategoryList?.length > 0) {
      const modifiedCategories = subCategoryList?.map((category) => ({
        value: category?._id,
        text: category?.name,
      }));

      setSubCategories(modifiedCategories);
    }
  }, [subCategoryList]);

  return (
    <main className="w-full grid grid-cols-3 gap-3">
      {/* form  */}
      <form
        onSubmit={(e) => handleSubmit(e, childCategory, childCategoryId)}
        className="col-span-2 w-full h-fit flex flex-col gap-4 bg-white p-5 rounded-xl"
      >
        <h1 className="text-md font-semibold text-gray-700">
          {childCategoryId ? (
            <>
              Update{" "}
              <span className="text-gray-500">
                &apos;{childCategory?.name}&apos;
              </span>
            </>
          ) : (
            "Create Child Category"
          )}
        </h1>

        <SelectBox
          required
          name="subCategory"
          value={childCategory?.subCategory}
          onChange={handleChange}
          option={subCategories}
          type="text"
          label="sub Category ?"
          placeholder="Select"
        />
        <Input
          required
          name="name"
          value={childCategory?.name}
          onChange={handleChange}
          type="text"
          label="Name"
          placeholder="eg. Frontend Frameworks"
        />
        <Input
          required
          name="slug"
          value={childCategory?.slug}
          onChange={handleChange}
          type="text"
          label="Slug"
          placeholder="frontend-frameworks"
          icon={
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"></path>
            </svg>
          }
          onIconClick={() => generateSlug(childCategory?.name)}
        />
        <textarea
          name="description"
          value={childCategory?.description}
          onChange={handleChange}
          rows={2}
          type="text"
          className="text-[13px] disabled:cursor-not-allowed disabled:opacity-80  w-full outline-none border border-gray-200 rounded-[5px] p-[10px] bg-transparent"
          placeholder="Child category description..."
        />

        <div className={childCategoryId ? "grid grid-cols-2 gap-2" : "w-full"}>
          <Button
            disabled={loading || dataLoading}
            loading={loading}
            type="submit"
            customClass="w-full px-5 text-white bg-blue-500"
          >
            {childCategoryId
              ? "Update Child-category"
              : "Create Child-category"}
          </Button>

          {childCategoryId && (
            <Link href="/categories/child-category">
              <Button
                onClick={() =>
                  setChildCategory({
                    name: "",
                    description: "",
                    slug: "",
                    subCategory: "",
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

      <section className="h-auto w-full">
        <div className="w-full flex flex-col gap-4 bg-white p-3 rounded-xl">
          <h1 className="text-md font-semibold text-gray-700">
            Sub-category List ({documentCount})
          </h1>

          <div className="w-full flex flex-col gap-2">
            {childCategoryList?.map((data, index) => {
              const {
                _id,
                slug,
                description,
                name,
                category,
                image,
                createdAt,
              } = data;

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
                  <p className="text-[14px] text-gray-600">{description}</p>

                  <div className="w-full flex flex-row items-center">
                    <Link
                      href={`/categories/child-category?categoryId=${_id}`}
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
