"use client";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, SelectBox } from "~/components/common/input_box";
import ImagLibraryModal from "~/components/common/modals/image-lib";
import {
  createService,
  fetchSingleServices,
} from "~/lib/redux/slices/service-slice";
import { alertToast, errorToast, successToast } from "~/utils/toastMessage";
import ServiceFaqForm from "./faq";
import {
  dummyService,
  emptyService,
} from "../../../../public/db/dummy-service";

const ReviewCard = ({ index, review, name, designation, rating, onDelete }) => {
  return (
    <div className="w-full flex flex-col gap-4 bg-gray-50 p-4 rounded-xl relative">
      <button
        onClick={onDelete}
        className="absolute top-2 text-sm right-2 bg-white p-2 rounded-xl text-gray-500 hover:bg-black hover:text-white"
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
      <div className="text-md text-yellow-400 flex flex-row items-center gap-1">
        {Array?.from(Array(rating))?.map((rate, index) => (
          <svg
            key={index}
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 576 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
          </svg>
        ))}
      </div>

      <p className="text-sm text-black">{review}</p>
      <div className="flex flex-col">
        <span className="text-md font-bold">{name}</span>
        <span className="text-sm">{designation}</span>
      </div>
    </div>
  );
};
const CreateService = ({ serviceId = null, serviceDetails = {} }) => {
  const [media, setMedia] = useState({ status: false, type: null, image: {} });
  const { loading } = useSelector((state) => state.service);
  const [singleReview, setSingleReview] = useState({
    name: "",
    review: "",
    rating: 3,
    designation: "",
  });
  const [errors, setErrors] = useState([]);

  const [singleBrand, setSingleBrand] = useState({
    name: "",
    logo: "",
    route: "#",
  });

  const [singleProject, setSingleProject] = useState({
    thumbnail: {},
    title: "",
    description: "",
    slug: "",
  });

  const [singleService, setSingleService] = useState({
    title: "",
    description: "",
    route: "/services/{your-service-path}",
  });

  const [singleStrategy, setSingleStrategy] = useState({
    title: "",
    description: "",
  });

  const [singleFeature, setSingleFeature] = useState({
    title: "",
    description: "",
  });

  const [serviceData, setServiceData] = useState(emptyService);

  const dispatch = useDispatch();
  const router = useRouter();
  const token = Cookies.get("access_token");
  const resetForm = () => {
    setServiceData({
      pre: [],
      post: [],
      reviews: [],
      clients: [],
      projects: [],
      promotion: {},
      service: {
        heading: "",
        description: "",
        serviceList: [],
      },
      strategy: {
        heading: "",
        description: "",
        heroImage: {},
        strategyList: [],
        feature: {
          heading: "",
          description: "",
          heroImage: {},
          featureList: [],
        },
      },
      faqs: [],
    });
  };
  const toggleMedia = () => {
    setMedia((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleReview = (event) => {
    const { name, value } = event?.target;
    setSingleReview((prev) => ({ ...prev, [name]: value }));
  };

  const addReview = (data) => {
    if (serviceData?.reviews?.length < 3) {
      setServiceData((prev) => ({ ...prev, reviews: [...prev.reviews, data] }));
      setSingleReview({
        name: "",
        review: "",
        rating: 3,
        designation: "",
      });
    } else {
      alertToast("Limit exceed!");
    }
  };

  const addBrand = (data) => {
    setServiceData((prev) => ({ ...prev, clients: [...prev.clients, data] }));
    setSingleBrand({ name: "", logo: "" });
  };

  const deleteReview = (id) => {
    const updatedReview = serviceData?.reviews?.filter(
      (state, index) => index != id,
    );
    const isDelete = confirm("Are you sure ? Want to delete this?");
    isDelete && setServiceData((prev) => ({ ...prev, reviews: updatedReview }));
  };

  const deleteBrand = (id) => {
    const updatedClient = serviceData?.clients?.filter(
      (state, index) => index != id,
    );
    const isDelete = confirm("Are you sure ? Want to delete this?");
    isDelete && setServiceData((prev) => ({ ...prev, clients: updatedClient }));
  };

  const handleBrandImageSelect = (logo) => {
    setSingleBrand((prev) => ({ ...prev, logo }));
  };

  const handlePromotionChange = (event) => {
    const { name, value } = event.target;
    setServiceData((prev) => ({
      ...prev,
      promotion: {
        ...prev.promotion,
        [name]: value,
      },
    }));
  };

  const handleHeroChange = (event) => {
    const { name, value } = event.target;
    setServiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActionChange = (event) => {
    const { name, value } = event.target;
    setServiceData((prev) => ({
      ...prev,
      action: {
        ...prev.action,
        [name]: value,
      },
    }));
  };

  // project
  const addProject = (data) => {
    setServiceData((prev) => ({ ...prev, projects: [...prev.projects, data] }));
    setSingleProject({ title: "", slug: "", thumbnail: {}, description: "" });
  };

  const deleteProject = (id) => {
    const updatedProject = serviceData?.projects?.filter(
      (state, index) => index !== id,
    );
    setServiceData((prev) => ({ ...prev, projects: updatedProject }));
  };
  // end

  // service

  const addService = (data) => {
    setServiceData((prev) => ({
      ...prev,
      service: {
        ...prev.service,
        serviceList: [...prev.service.serviceList, data],
      },
    }));

    setSingleService({
      title: "",
      description: "",
      route: "#",
    });
  };

  const deleteService = (id) => {
    const updatedService = serviceData?.service?.serviceList?.filter(
      (state, index) => index !== id,
    );
    setServiceData((prev) => ({
      ...prev,
      service: {
        ...prev.service,
        serviceList: updatedService,
      },
    }));
  };
  // end

  // strategy
  const addStrategy = (data) => {
    setServiceData((prev) => ({
      ...prev,
      strategy: {
        ...prev.strategy,
        strategyList: [...prev.strategy.strategyList, data],
      },
    }));
    setSingleStrategy({ title: "", description: "" });
  };

  const deleteStrategy = (id) => {
    const updatedStrategy = serviceData?.strategy?.strategyList?.filter(
      (state, index) => index !== id,
    );
    setServiceData((prev) => ({
      ...prev,
      strategy: {
        ...prev.strategy,
        strategyList: updatedStrategy,
      },
    }));
  };
  // end

  // features
  const addFeature = (data) => {
    setServiceData((prev) => ({
      ...prev,
      strategy: {
        ...prev.strategy,
        feature: {
          ...prev?.strategy?.feature,
          featureList: [...prev.strategy.feature.featureList, data],
        },
      },
    }));
    setSingleFeature({
      title: "",
      description: "",
    });
  };

  const deleteFeature = (id) => {
    const updatedFeature = serviceData?.strategy?.feature?.featureList?.filter(
      (state, index) => index !== id,
    );
    setServiceData((prev) => ({
      ...prev,
      strategy: {
        ...prev.strategy,
        feature: { ...prev?.strategy?.feature, featureList: updatedFeature },
      },
    }));
  };

  // end

  // attribute - option
  const handlePrePost = (key, value) => {
    const arr = value?.split(",");
    setServiceData((prev) => ({ ...prev, [key]: arr }));
  };

  const handleImageSelect = (image, type) => {
    console.log(image, "image");

    setMedia((prev) => ({ ...prev, image, status: false }));

    if (type === "BRAND") {
      handleBrandImageSelect(image);
      return;
    }
    if (type === "PROJECT") {
      setSingleProject((prev) => ({ ...prev, thumbnail: image }));
      return;
    }

    if (type === "STRATEGY") {
      setServiceData((prev) => ({
        ...prev,
        strategy: { ...prev.strategy, heroImage: image },
      }));
      return;
    }

    if (type === "FEATURE") {
      setServiceData((prev) => ({
        ...prev,
        strategy: {
          ...prev.strategy,
          feature: {
            ...prev.strategy.feature,
            heroImage: image,
          },
        },
      }));
      return;
    }
  };

  const handleSubmit = async (data, id) => {
    try {
      await dispatch(
        createService({ token, serviceData: data, serviceId: id }),
      ).unwrap();

      resetForm();

      if (id) {
        successToast("Service details updated");
        router.replace("/services");
      } else {
        successToast("Service created");
      }
    } catch (err) {
      // const message =
      //   err?.message || err || "Something went wrong while saving the service.";
      // errorToast(message);
      const { error, message } = err || {};
      // alert(error);
      const detailedErr = formatValidationError(error);
      setErrors(detailedErr);
      errorToast(message);
    }
  };

  // prefill to update
  const getSingleServiceDetails = async (id) => {
    try {
      const details = await dispatch(
        fetchSingleServices({ token, slug: id }),
      ).unwrap();

      const {
        _id,
        slug,
        pre,
        post,
        heading,
        subHeading,
        description,
        category,
        action,
        promotion,
        service,
        strategy,
        reviews,
        clients,
        projects,
        faqs,
        projectHeading,
        shortTitle,
      } = details || {};
      setServiceData((prev) => ({
        ...prev,
        category: category || undefined,
        slug,
        pre,
        post,
        heading,
        subHeading,
        description,
        action,
        promotion,
        service,
        strategy,
        reviews,
        clients,
        projects,
        faqs,
        projectHeading,
        shortTitle: shortTitle || "",
      }));
      // console.log(details, "🛑");
    } catch (error) {}
  };

  useEffect(() => {
    token && serviceId && getSingleServiceDetails(serviceId);
    return () => {};
  }, [token, serviceId]);

  // end

  // useEffect(() => {
  //   serviceId && serviceDetails && setServiceData(serviceDetails);
  //   return () => {};
  // }, [serviceId, serviceDetails]);

  return (
    <>
      <div className="w-full flex flex-col gap-3 pb-10">
        {/* hero  */}

        <section className="w-full p-5 bg-white flex flex-col gap-4 rounded-xl">
          <h2 className="font-semibold text-xl text-black">Hero section</h2>

          <div className="w-full grid grid-cols-2 gap-4">
            <SelectBox
              placeholder="Select"
              option={categories}
              label="category"
              name="category"
              value={serviceData?.category}
              onChange={handleHeroChange}
            />

            <Input
              label="Priority/position"
              name="priority"
              type="number"
              value={serviceData?.priority}
              onChange={handleHeroChange}
            />
          </div>
          <Input
            label="Page path"
            name="slug"
            value={serviceData?.slug}
            onChange={handleHeroChange}
          />
          <div className="w-full grid grid-cols-2 gap-3">
            <Input
              label="Pre Option"
              name="pre"
              value={serviceData?.pre}
              onChange={handleHeroChange}
              onBlur={(e) => handlePrePost("pre", e.target.value)}
            />
            <Input
              label="Post Option"
              name="post"
              onChange={handleHeroChange}
              value={serviceData?.post}
              onBlur={(e) => handlePrePost("post", e.target.value)}
            />
            <Input
              label="Heading"
              name="heading"
              value={serviceData?.heading}
              onChange={handleHeroChange}
            />
            <Input
              label="Sub heading"
              name="subHeading"
              value={serviceData?.subHeading}
              onChange={handleHeroChange}
            />
            <Input
              label="Short heading"
              name="shortHeading"
              value={serviceData?.shortHeading}
              onChange={handleHeroChange}
            />
            <div className="col-span-2">
              <div className="w-full flex flex-col gap-1">
                <label className="first-letter:capitalize text-[12px] font-[600] text-black ">
                  Hero description
                </label>
                <textarea
                  name="description"
                  value={serviceData?.description}
                  onChange={handleHeroChange}
                  className="text-[13px] disabled:cursor-not-allowed disabled:opacity-80 w-full outline-none border border-gray-200  rounded-[5px] p-[10px] bg-transparent font-medium placeholder:font-normal"
                />
              </div>
            </div>

            <Input
              label="Button label"
              placeholder="Discuss your project"
              name="label"
              value={serviceData?.action?.label}
              onChange={handleActionChange}
            />
            <Input
              label="Hyper link"
              placeholder="/contact-us"
              name="route"
              value={serviceData?.action?.route}
              onChange={handleActionChange}
            />
          </div>

          <h2 className="font-semibold text-md text-black">/ Reviews</h2>

          <div className="w-full grid grid-cols-3 gap-3">
            <SelectBox
              placeholder="Select"
              option={[
                {
                  text: "⭐️ ⭐️",
                  value: 2,
                },
                ,
                {
                  text: "⭐️ ⭐️ ⭐️",
                  value: 3,
                },
                {
                  text: "⭐️ ⭐️ ⭐️ ⭐️",
                  value: 4,
                },
                {
                  text: "⭐️ ⭐️ ⭐️ ⭐️ ⭐️",
                  value: 5,
                },
              ]}
              label="Rating"
              name="rating"
              value={singleReview?.rating}
              onChange={handleReview}
            />
            <Input
              label="Name"
              name="name"
              value={singleReview?.name}
              onChange={handleReview}
            />
            <Input
              label="Designation"
              name="designation"
              value={singleReview?.designation}
              onChange={handleReview}
            />
            <div className="col-span-3">
              <div className="w-full flex flex-col gap-1">
                <label className="first-letter:capitalize text-[12px] font-[600] text-black ">
                  Review
                </label>
                <textarea
                  name="review"
                  value={singleReview?.review}
                  onChange={handleReview}
                  rows={3}
                  className="text-[13px] disabled:cursor-not-allowed disabled:opacity-80 w-full outline-none border border-gray-200  rounded-[5px] p-[10px] bg-transparent font-medium placeholder:font-normal"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button
              disabled={
                !singleReview?.name ||
                !singleReview?.designation ||
                !singleReview?.review
              }
              onClick={() => addReview(singleReview)}
              type="button"
              customClass="bg-black text-white px-4"
            >
              Add review
            </Button>
          </div>
          {/* review list  */}

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {serviceData?.reviews?.map((data, index) => {
              const { review, rating, designation, name } = data;
              return (
                <ReviewCard
                  index={index}
                  review={review}
                  designation={designation}
                  name={name}
                  rating={parseInt(rating)}
                  key={index}
                  onDelete={() => deleteReview(index)}
                />
              );
            })}
          </div>
        </section>

        {/* clients  */}
        <section className="w-full p-5 bg-white flex flex-col gap-4 rounded-xl">
          <h2 className="font-semibold text-xl text-black">Clients / Brand</h2>

          <div className="w-1/3 flex flex-col gap-3">
            <Input
              label="brand name"
              name="name"
              value={singleBrand?.name}
              onChange={(e) =>
                setSingleBrand((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-[600] text-black ">
                Brand logo
              </label>
              <div className="w-1/3 aspect-square  overflow-hidden bg-sky-50 border border-dashed rounded-xl border-blue-200 ">
                {singleBrand?.logo?.url ? (
                  <div className="relative w-full h-full">
                    <button
                      onClick={() =>
                        setSingleBrand((prev) => ({ ...prev, logo: {} }))
                      }
                      className="absolute top-2 text-xs right-2 p-1.5 rounded-xl bg-black text-white shadow-sm"
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
                    <Image
                      height={50}
                      width={50}
                      src={singleBrand?.logo?.url}
                      className="w-full h-full object-contain"
                      title={singleBrand?.logo?.name}
                      alt={singleBrand?.logo?.alt}
                      quality={10}
                    />
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex-center cursor-pointer"
                    onClick={() =>
                      setMedia((prev) => ({
                        ...prev,
                        type: "BRAND",
                        status: true,
                      }))
                    }
                  >
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
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button
              disabled={!singleBrand?.name || !singleBrand?.logo?.url}
              onClick={() => addBrand(singleBrand)}
              type="button"
              customClass="bg-black text-white px-4 w-fit"
            >
              Add brand
            </Button>
          </div>

          <div className="w-full grid grid-cols-7 gap-2">
            {serviceData?.clients?.map((brand, index) => (
              <div
                key={index}
                className="relative w-full aspect-square flex-center bg-gray-100"
              >
                <button
                  onClick={() => deleteBrand(index)}
                  className="absolute top-2 text-xs right-2 p-1.5 rounded-xl bg-black text-white shadow-sm"
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
                <Image
                  height={50}
                  width={100}
                  src={brand?.logo?.url}
                  className="h-full w-auto mx-auto object-contain"
                />

                <span className="bg-black text-white font-medium w-full absolute bottom-0 left-0 text-center text-xs py-2 bg-opacity-40 backdrop-blur-sm">
                  {brand?.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* promotion  */}
        <section className="w-full p-5 bg-white flex flex-col gap-4 rounded-xl">
          <h2 className="font-semibold text-xl text-black">
            Promotion section
          </h2>

          <Input
            label="Heading"
            name="title"
            value={serviceData?.promotion?.title}
            onChange={handlePromotionChange}
          />
          <div className="w-full flex flex-col gap-1">
            <label className="first-letter:capitalize text-[12px] font-[600] text-black ">
              description
            </label>
            <textarea
              name="description"
              value={serviceData?.promotion?.description}
              onChange={handlePromotionChange}
              className="text-[13px] disabled:cursor-not-allowed disabled:opacity-80 w-full outline-none border border-gray-200  rounded-[5px] p-[10px] bg-transparent font-medium placeholder:font-normal"
            />
          </div>
        </section>

        {/* projects  */}
        <section className="w-full p-5 bg-white flex flex-col gap-4 rounded-xl">
          <h2 className="font-semibold text-xl text-black">Projects section</h2>

          {/* heading  */}
          <Input
            label="project section heading"
            name="projectHeading"
            value={serviceData?.projectHeading}
            onChange={handleHeroChange}
          />

          <div className="w-full grid grid-cols-2 gap-4">
            <Input
              label="project title / Name"
              name="title"
              value={singleProject?.title}
              onChange={(e) =>
                setSingleProject((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Input
              label="Hyperlink"
              name="slug"
              value={singleProject?.slug}
              onChange={(e) =>
                setSingleProject((prev) => ({ ...prev, slug: e.target.value }))
              }
            />
            <Input
              label="project description"
              name="title"
              value={singleProject?.description}
              onChange={(e) =>
                setSingleProject((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-[600] text-black ">
              Project thumbnail
            </label>
            <div className="w-1/6 aspect-square  overflow-hidden bg-sky-50 border border-dashed rounded-xl border-blue-200 ">
              {singleProject?.thumbnail?.url ? (
                <div className="relative w-full h-full">
                  <button
                    onClick={() =>
                      setSingleProject((prev) => ({ ...prev, thumbnail: {} }))
                    }
                    className="absolute top-2 text-xs right-2 p-1.5 rounded-xl bg-black text-white shadow-sm"
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
                  <Image
                    height={50}
                    width={50}
                    src={singleProject?.thumbnail?.url}
                    className="w-full h-full object-contain"
                    title={singleProject?.thumbnail?.name}
                    alt={singleProject?.thumbnail?.alt}
                    quality={10}
                  />
                </div>
              ) : (
                <div
                  className="w-full h-full flex-center cursor-pointer"
                  onClick={() =>
                    setMedia((prev) => ({
                      ...prev,
                      type: "PROJECT",
                      status: true,
                    }))
                  }
                >
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
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button
              disabled={
                !singleProject?.title ||
                !singleProject?.description ||
                !singleProject?.thumbnail?.url
              }
              onClick={() => addProject(singleProject)}
              type="button"
              customClass="bg-black text-white px-4 w-fit"
            >
              Add project
            </Button>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            {serviceData?.projects?.map((project, index) => (
              <div
                key={index}
                className="w-full relative rounded-xl flex flex-col gap-2 p-3 bg-gray-100"
              >
                <button
                  onClick={() => deleteProject(index)}
                  className="absolute top-2 text-xs right-2 p-1.5 rounded-xl bg-black text-white shadow-sm"
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
                <Image
                  height={200}
                  width={200}
                  src={project?.thumbnail?.url}
                  className="w-full rounded-lg"
                />

                <h3 className="font-semibold text-gray-600 text-base">
                  {project?.title}
                </h3>
                <p className="text-gray-600 text-sm">{project?.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* service  */}
        <section className="w-full p-5 bg-white flex flex-col gap-4 rounded-xl">
          <h2 className="font-semibold text-xl text-black">Service section</h2>
          <Input
            label="Section heading"
            name="heading"
            value={serviceData?.service?.heading}
            onChange={(e) =>
              setServiceData((prev) => ({
                ...prev,
                service: { ...prev.service, heading: e.target.value },
              }))
            }
          />
          <Input
            label="section description"
            name="description"
            value={serviceData?.service?.description}
            onChange={(e) =>
              setServiceData((prev) => ({
                ...prev,
                service: { ...prev.service, description: e.target.value },
              }))
            }
          />
          <h2 className="font-semibold text-md text-black">/ Single service</h2>
          <div className="w-full grid grid-cols-2 gap-4">
            <Input
              label="service title"
              name="title"
              value={singleService?.title}
              onChange={(e) =>
                setSingleService((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />{" "}
            <Input
              label="service hyperlink"
              name="route"
              value={singleService?.route}
              onChange={(e) =>
                setSingleService((prev) => ({
                  ...prev,
                  route: e.target.value,
                }))
              }
            />{" "}
          </div>
          <Input
            label="service description"
            name="description"
            value={singleService?.description}
            onChange={(e) =>
              setSingleService((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />{" "}
          <div className="w-full flex justify-end">
            <Button
              disabled={!singleService?.description || !singleService?.title}
              onClick={() => addService(singleService)}
              type="button"
              customClass="bg-black text-white px-4 w-fit"
            >
              Add service
            </Button>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            {serviceData?.service?.serviceList?.map((service, index) => (
              <div
                key={index}
                className="w-full relative rounded-xl flex flex-col gap-2 p-3 bg-gray-100"
              >
                <button
                  onClick={() => deleteService(index)}
                  className="absolute top-2 text-xs right-2 p-1.5 rounded-xl bg-black text-white shadow-sm"
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

                <h3 className="font-semibold text-gray-600 text-base">
                  {service?.title}
                </h3>
                <p className="text-gray-600 text-sm">{service?.description}</p>
                <p className="text-blue-600 text-sm">{service?.route}</p>
              </div>
            ))}
          </div>
        </section>

        {/* strategy  */}
        <section className="w-full p-5 bg-white flex flex-col gap-4 rounded-xl">
          <h2 className="font-semibold text-xl text-black">Strategy section</h2>
          <Input
            label="Section heading"
            name="heading"
            value={serviceData?.strategy?.heading}
            onChange={(e) =>
              setServiceData((prev) => ({
                ...prev,
                strategy: { ...prev.strategy, heading: e.target.value },
              }))
            }
          />
          <Input
            label="section description"
            name="description"
            value={serviceData?.strategy?.description}
            onChange={(e) =>
              setServiceData((prev) => ({
                ...prev,
                strategy: { ...prev.strategy, description: e.target.value },
              }))
            }
          />
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-[600] text-black ">
              Hero image{" "}
            </label>
            <div className="w-1/6 aspect-square  overflow-hidden bg-sky-50 border border-dashed rounded-xl border-blue-200 ">
              {serviceData?.strategy?.heroImage?.url ? (
                <div className="relative w-full h-full">
                  <button
                    onClick={() =>
                      setServiceData((prev) => ({
                        ...prev,
                        strategy: { ...prev.strategy, heroImage: {} },
                      }))
                    }
                    className="absolute top-2 text-xs right-2 p-1.5 rounded-xl bg-black text-white shadow-sm"
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
                  <Image
                    height={50}
                    width={50}
                    src={serviceData?.strategy?.heroImage?.url}
                    className="w-full h-full object-contain"
                    alt={serviceData?.strategy?.heroImage?.alt}
                    quality={10}
                  />
                </div>
              ) : (
                <div
                  className="w-full h-full flex-center cursor-pointer"
                  onClick={() =>
                    setMedia((prev) => ({
                      ...prev,
                      type: "STRATEGY",
                      status: true,
                    }))
                  }
                >
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
                </div>
              )}
            </div>
          </div>
          <h2 className="font-semibold text-md text-black">
            / Single Strategy
          </h2>
          <Input
            label="Strategy title"
            name="title"
            value={singleStrategy?.title}
            onChange={(e) =>
              setSingleStrategy((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />{" "}
          <Input
            label="Strategy description"
            name="description"
            value={singleStrategy?.description}
            onChange={(e) =>
              setSingleStrategy((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />{" "}
          <div className="w-full flex justify-end">
            <Button
              disabled={!singleStrategy?.title || !singleStrategy?.description}
              onClick={() => addStrategy(singleStrategy)}
              type="button"
              customClass="bg-black text-white px-4 w-fit"
            >
              Add Strategy
            </Button>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            {serviceData?.strategy?.strategyList?.map((service, index) => (
              <div
                key={index}
                className="w-full relative rounded-xl flex flex-col gap-2 p-3 bg-gray-100"
              >
                <button
                  onClick={() => deleteStrategy(index)}
                  className="absolute top-2 text-xs right-2 p-1.5 rounded-xl bg-black text-white shadow-sm"
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

                <h3 className="font-semibold text-gray-600 text-base">
                  {service?.title}
                </h3>
                <p className="text-gray-600 text-sm">{service?.description}</p>
                <p className="text-blue-600 text-sm">{service?.route}</p>
              </div>
            ))}
          </div>
        </section>

        {/* features  */}
        <section className="w-full p-5 bg-white flex flex-col gap-4 rounded-xl">
          <h2 className="font-semibold text-xl text-black">Features section</h2>
          <Input
            label="Section heading"
            name="heading"
            value={serviceData?.strategy?.feature?.heading}
            onChange={(e) =>
              setServiceData((prev) => ({
                ...prev,
                strategy: {
                  ...prev.strategy,
                  feature: {
                    ...prev.strategy.feature,
                    heading: e.target.value,
                  },
                },
              }))
            }
          />
          <Input
            label="section description"
            name="description"
            value={serviceData?.strategy?.feature?.description}
            onChange={(e) =>
              setServiceData((prev) => ({
                ...prev,
                strategy: {
                  ...prev.strategy,
                  feature: {
                    ...prev.strategy.feature,
                    description: e.target.value,
                  },
                },
              }))
            }
          />
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-[600] text-black ">
              Hero image{" "}
            </label>
            <div className="w-1/6 aspect-square  overflow-hidden bg-sky-50 border border-dashed rounded-xl border-blue-200 ">
              {serviceData?.strategy?.feature?.heroImage?.url ? (
                <div className="relative w-full h-full">
                  <button
                    onClick={() =>
                      setServiceData((prev) => ({
                        ...prev,
                        strategy: {
                          ...prev.strategy,
                          feature: {
                            ...prev.strategy.feature,
                            heroImage: {},
                          },
                        },
                      }))
                    }
                    className="absolute top-2 text-xs right-2 p-1.5 rounded-xl bg-black text-white shadow-sm"
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
                  <Image
                    height={50}
                    width={50}
                    src={serviceData?.strategy?.feature?.heroImage?.url}
                    className="w-full h-full object-contain"
                    alt={serviceData?.strategy?.feature?.heroImage?.alt}
                    quality={10}
                  />
                </div>
              ) : (
                <div
                  className="w-full h-full flex-center cursor-pointer"
                  onClick={() =>
                    setMedia((prev) => ({
                      ...prev,
                      type: "FEATURE",
                      status: true,
                    }))
                  }
                >
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
                </div>
              )}
            </div>
          </div>
          <h2 className="font-semibold text-md text-black">/ Single feature</h2>
          <Input
            label="feature title"
            name="title"
            value={singleFeature?.title}
            onChange={(e) =>
              setSingleFeature((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />{" "}
          <Input
            label="feature description"
            name="description"
            value={singleFeature?.description}
            onChange={(e) =>
              setSingleFeature((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />{" "}
          <div className="w-full flex justify-end">
            <Button
              disabled={!singleFeature?.description || !singleFeature?.title}
              onClick={() => addFeature(singleFeature)}
              type="button"
              customClass="bg-black text-white px-4 w-fit"
            >
              Add feature
            </Button>
          </div>
          <div className="w-full grid grid-cols-3 gap-4">
            {serviceData?.strategy?.feature?.featureList?.map(
              (service, index) => (
                <div
                  key={index}
                  className="w-full relative rounded-xl flex flex-col gap-2 p-3 bg-gray-100"
                >
                  <button
                    onClick={() => deleteFeature(index)}
                    className="absolute top-2 text-xs right-2 p-1.5 rounded-xl bg-black text-white shadow-sm"
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

                  <h3 className="font-semibold text-gray-600 text-base">
                    {service?.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {service?.description}
                  </p>
                  <p className="text-blue-600 text-sm">{service?.route}</p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* faqs  */}

        <ServiceFaqForm
          serviceData={serviceData}
          setServiceData={setServiceData}
        />

        {/* errors  */}
        {errors?.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-4">
            <h2 className="font-semibold mb-2">
              Please fix the following errors:
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((err, index) => (
                <li key={index} className="text-xs">
                  <span className="font-medium">{err.field}</span> :
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* end  */}

        <Button
          disabled={loading}
          onClick={() => handleSubmit(serviceData, serviceId)}
          customClass="bg-blue-500 text-white"
        >
          {serviceId ? "Update service" : "Create service"}
        </Button>
      </div>

      {/* image lib  */}

      <ImagLibraryModal
        open={media?.status}
        onClose={() => toggleMedia()}
        handleClick={(image) => handleImageSelect(image, media?.type)}
      />
    </>
  );
};

export default CreateService;

const categories = [
  {
    id: 1,
    text: "Home Tuition For College",
    value: "home-tuition-for-college",
  },
  {
    id: 2,
    text: "Home Tuition For School Tuition",
    value: "home-tuition-for-school-tuition",
  },
  {
    id: 3,
    text: "Home Tuition For Diploma",
    value: "home-tuition-for-diploma",
    description: "End-to-end product development and SaaS solutions",
  },
  {
    id: 4,
    text: "Home Tuition For Under Graduation",
    value: "home-tuition-for-under-graduation",
    description: "Tailored software solutions for your business needs",
  },
  {
    id: 5,
    text: "Home Tuition For Post Graduation",
    value: "home-tuition-for-post-graduation",
    description: "Upgrading legacy systems to modern architectures",
  },
  {
    id: 6,
    text: "Home Tuition For Competitive Exam",
    value: "home-tuition-for-competitive-exam",
    description: "Artificial Intelligence and Machine Learning implementations",
  },
  {
    id: 7,
    text: "Home Tuition For Language Studies",
    value: "home-tuition-for-language-studies",
    description: "DevOps practices and infrastructure management",
  },
  {
    id: 8,
    text: "Home Tuition For English Speaking",
    value: "home-tuition-for-english-speaking",
    description: "User-centered design and experience optimization",
  },
  {
    id: 9,
    text: "Home Tuition For Foreign Language",
    value: "home-tuition-for-foreign-language",
    description: "Recovery and turnaround for struggling projects",
  },
  {
    id: 10,
    text: "Home Tuition For Religious Studies",
    value: "home-tuition-for-religious-studies",
  },
  {
    id: 11,
    text: "Home Tuition For Computer/IT",
    value: "home-tuition-for-computer/it",
  },
  {
    id: 12,
    text: "Home Tuition For Music",
    value: "home-tuition-for-music",
  },
  {
    id: 13,
    text: "Home Tuition For Dance",
    value: "home-tuition-for-dance",
  },
  {
    id: 14,
    text: "Home Tuition For Photography/Film Making",
    value: "home-tuition-for-photography/film-making",
  },
  {
    id: 15,
    text: "Home Tuition For Threatre/acting",
    value: "home-tuition-for-threatre/acting",
  },
  {
    id: 16,
    text: "Home Tuition For Industrial Training",
    value: "home-tuition-for-industrial-training",
  },
  {
    id: 17,
    text: "Home Tuition For Tailoring / Fashion Design",
    value: "home-tuition-for-tailoring/fashion-design",
  },
  {
    id: 18,
    text: "Home Tuition For Special Education",
    value: "home-tuition-for-special-education",
  },
  {
    id: 19,
    text: "Home Tuition For Art&craft",
    value: "home-tuition-for-art&craft",
  },
];

const formatValidationError = (errorString) => {
  if (!errorString) return [];

  return errorString
    .replace(/^Service validation failed:\s*/, "")
    .split(",")
    .map((err) => err.trim())
    .map((err) => {
      const [path, message] = err.split(": Path ");
      return {
        field: path?.trim(),
        message: message?.replace(/`/g, "").trim(),
      };
    });
};
