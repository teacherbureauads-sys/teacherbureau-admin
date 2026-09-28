"use client";
import { useEffect, useState } from "react";
import { Button, Input, SelectBox } from "~/components/common/input_box";
import { useDispatch, useSelector } from "react-redux";
import { TextEditor } from "./text_editor";
import ImagLibraryModal from "~/components/common/modals/image-lib";
import { fetchCategories } from "~/lib/redux/slices/main-category-slice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { createBlog, fetchSingleBlog } from "~/lib/redux/slices/blog-slice";
import { errorToast, successToast } from "~/utils/toastMessage";
import { generateSlug } from "~/utils/generate-slug";
import Link from "next/link";
import { postTypes } from "../../../../public/db/blog.config";
export const CreateBlogPost = ({ blogId, blogDetails = "{}" }) => {
  const [mainCategories, setMainCategories] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    slug: "",
    thumbnail: {
      _id: "",
      url: "",
      name: "",
      alt: "",
    },
    keywords: [],
    description: "",
    content: blogDetails?.content || "",
    published: true,

    schema: {},
  });

  const [keyWordString, setKeywordString] = useState("");

  const [media, setMedia] = useState(false);

  const dispatch = useDispatch();

  const router = useRouter();

  const token = Cookies.get("access_token");

  const { categoryList = [], dataLoading = true } = useSelector(
    (state) => state.category
  );
  const { loading } = useSelector((state) => state.blog);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file_data) => {
    setFormData((prev) => ({ ...prev, thumbnail: file_data }));
    setMedia(false);
  };

  const handleSubmit = async (event, data, id) => {
    event.preventDefault();

    const resultAction = await dispatch(
      createBlog({ token, blogId: id, blogData: data })
    );

    if (createBlog.fulfilled.match(resultAction)) {
      setFormData((prev) => ({
        ...prev,
        category: "",
        title: "",
        description: "",
        content: "",
        keywords: [],
        thumbnail: {
          _id: "",
          url: "",
          name: "",
          alt: "",
        },
      }));

      if (id) {
        successToast("Blog updated");
        router.replace("/blog-post");
      } else {
        successToast("Blog Created.");
      }
    } else {
      const message = resultAction.payload;
      errorToast(message);
    }
  };

  const handleGenerateSlug = (text) => {
    const slug = generateSlug(text);
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleKeywords = (keywords) => {
    const keyList = keywords?.split(",");
    setFormData((prev) => ({
      ...prev,
      keywords: keyList || [],
    }));
  };

  useEffect(() => {
    token &&
      categoryList?.length < 1 &&
      dispatch(fetchCategories({ token, filters: { limit: 200 } }));
    return () => {};
  }, [token]);

  // modify main cat
  useEffect(() => {
    if (categoryList && categoryList?.length > 0) {
      const modifiedCategories = categoryList?.map((category) => ({
        value: category?._id,
        text: category?.name,
      }));

      setMainCategories(modifiedCategories);
    }
  }, [categoryList]);

  // prefill to update
  const getSinglPost = async (auth, id) => {
    try {
      const response = await dispatch(
        fetchSingleBlog({ token: auth, blogId: id })
      ).unwrap();

      const {
        _id,
        category,
        thumbnail,
        slug,
        title,
        keywords,
        description,
        content,
        schema,
        type,
        shortTitle,
        published,
      } = response;
      const keyStr = keywords?.join(",");
      setFormData({
        _id,
        category: category?._id,
        title,
        shortTitle: shortTitle || title || "",
        slug,
        thumbnail,
        keywords,
        description,
        schema,
        content,
        type: type || undefined,
        published: published ?? true,
      });
      setKeywordString(keyStr);

      console.log(response, "getSinglPost");
    } catch (error) {}
  };

  useEffect(() => {
    token && blogId && getSinglPost(token, blogId);
    return () => {};
  }, [token, blogId]);

  // end

  return (
    <>
      <main className="w-full grid grid-cols-4 gap-2">
        {/* form  */}
        <form
          onSubmit={(e) => handleSubmit(e, formData, formData?._id)}
          className="col-span-3 w-full flex flex-col gap-4 bg-white p-5 rounded-xl"
        >
          <h1 className="text-md font-medium text-blue-600">Post a New blog</h1>

          <Input
            required
            name="title"
            value={formData?.title}
            onChange={handleChange}
            type="text"
            label="Title"
            placeholder=""
            onBlur={() => handleGenerateSlug(formData?.title)}
          />

          <Input
            required
            name="shortTitle"
            value={formData?.shortTitle}
            onChange={handleChange}
            type="text"
            label="Short Title"
            placeholder=""
          />
          <div className="relative">
            <TextEditor
              handleBlur={(data) =>
                setFormData((prev) => ({ ...prev, content: data }))
              }
              initialValue={formData?.content}
            />
          </div>

          <Input
            required
            name="keywords"
            value={keyWordString}
            type="text"
            label="Keywords"
            placeholder=""
            onChange={(e) => setKeywordString(e.target.value)}
            onBlur={(e) => handleKeywords(keyWordString)}
          />

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-[600] text-black ">
              Short Description
            </label>
            <textarea
              name="description"
              value={formData?.description}
              onChange={handleChange}
              rows={3}
              type="text"
              className="disabled:cursor-not-allowed disabled:opacity-80  w-full outline-none border border-gray-200 rounded-[5px] p-[10px] bg-transparent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-[600] text-black ">
              Post schema
            </label>
            <textarea
              name="schema"
              value={formData?.schema}
              onChange={handleChange}
              rows={10}
              type="text"
              className="disabled:cursor-not-allowed disabled:opacity-80  w-full outline-none border border-gray-200 rounded-[5px] p-[10px] bg-transparent"
            />
          </div>

          <div
            className={blogId ? "grid grid-cols-2 gap-2 mt-20" : "w-full mt-20"}
          >
            <Button
              disabled={loading || dataLoading}
              loading={loading}
              type="submit"
              customClass="w-full px-5 text-white bg-blue-500"
            >
              {blogId ? "Update Blog" : "Post Blog"}
            </Button>

            {blogId && (
              <Link href="/blog-post/create-blog">
                <Button
                  onClick={() =>
                    setFormData({
                      category: "",
                      title: "",
                      slug: "",
                      thumbnail: {
                        _id: "",
                        url: "",
                        name: "",
                        alt: "",
                      },
                      keywords: [],
                      description: "",
                      content: "",
                      schema: {},
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

        {/* blog config  */}
        <section className="h-auto w-full">
          <div className="w-full flex flex-col gap-4 bg-white p-4 rounded-xl">
            <h1 className="text-md font-medium text-blue-600">Configuration</h1>
            <SelectBox
              disabled={dataLoading}
              required
              name="category"
              value={formData?.category}
              onChange={handleChange}
              type="text"
              label="Main Category ?"
              placeholder="select-category"
              option={mainCategories}
            />{" "}
            <SelectBox
              disabled={dataLoading}
              required
              name="type"
              value={formData?.type}
              onChange={handleChange}
              type="text"
              label="Post type"
              placeholder="select-type"
              option={postTypes}
            />
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-[600] text-black ">
                Featured image{" "}
              </label>
              <div
                onClick={() => setMedia(!media)}
                className="cursor-pointer overflow-hidden w-full aspect-video bg-sky-50 border border-dashed rounded-xl border-blue-200 flex-center flex-col gap-1"
              >
                {formData?.thumbnail?._id && formData?.thumbnail?.url ? (
                  <Image
                    height={100}
                    width={50}
                    src={formData?.thumbnail?.url}
                    className="w-full h-full object-contain"
                    title={formData?.thumbnail?.name}
                    alt={formData?.thumbnail?.alt}
                  />
                ) : (
                  <>
                    <span className="text-3xl text-blue-100">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                        <line x1="16" x2="22" y1="5" y2="5"></line>
                        <line x1="19" x2="19" y1="2" y2="8"></line>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                    </span>
                    <span className="text-[12px] font-medium text-blue-500">
                      JPG / WEBP / PNG
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-[12px] font-[600] text-black">
                Publish on website
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!formData?.published}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      published: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
            {!formData?.published && (
              <p className="text-[11px] text-amber-600">
                This blog will be saved as a draft and will NOT appear on the
                website until you publish it (here or from the blog list).
              </p>
            )}
          </div>
        </section>
      </main>

      {/* image lib  */}

      <ImagLibraryModal
        open={media}
        onClose={() => setMedia(!media)}
        handleClick={handleFileSelect}
      />
    </>
  );
};
