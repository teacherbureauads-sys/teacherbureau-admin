"use state";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";

import useFile from "~/hooks/useFile";
import { limitTextLength } from "~/utils/limitText";
import { errorToast } from "~/utils/toastMessage";

const ImagLibraryModal = ({
  open = false,
  onClose,
  handleClick,
  btnLabel = "Set as featured",
  heading = "Featured Image",
}) => {
  const [tab, setTab] = useState({
    tabs: ["Upload media", "Media library"],
    current: "Media library",
  });

  const [copied, setCopied] = useState(false);

  const [selectedFile, setSelectedFile] = useState({
    _id: "",
    url: "",
    name: "",
    alt: "",
    // fName: "",
  });

  const {
    fileUploading,
    filesLoading,
    fetchFiles,
    filesList,
    paginationInfo,
    uploadFile,
    deleteFile,
    setFilesList,
  } = useFile(process.env.BACKEND_API_BASE_URL);

  const { totalImages, totalPages, currentPage } = paginationInfo;

  const toggleTab = (state) => {
    setTab((prev) => ({ ...prev, current: state }));
  };

  const handleCopy = async (file_url) => {
    try {
      await navigator.clipboard.writeText(file_url); // Copy to clipboard
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleFileDelete = async (file_id) => {
    const isDelete = confirm("Are you sure want to delete this file?");
    const updatedFiles = filesList?.filter(
      (file) => file?.providerId !== file_id
    );
    if (!isDelete) {
      return;
    }
    const result = await deleteFile(file_id);
    setFilesList(updatedFiles);
  };

  // Handle file upload

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Allowed types
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

      // Type validation
      if (!allowedTypes.includes(file.type)) {
        errorToast("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
        return;
      }

      // Size validation
      if (file.size > maxSizeInBytes) {
        errorToast("File size exceeds 5 MB limit.");
        return;
      }

      try {
        const fileData = await uploadFile(file);
        setSelectedFile(fileData?.data);
        fetchFiles(21, 1);
        setTab((prev) => ({ ...prev, current: "Media library" }));
      } catch (error) {
        console.error("Upload failed:", error);
        errorToast("Upload failed. Please try again.");
      }
    }
  };

  // pagination

  const next = () => {
    fetchFiles(21, currentPage + 1);
  };

  const prev = () => {
    fetchFiles(21, currentPage - 1);
  };

  useEffect(() => {
    fetchFiles();
    return () => {};
  }, []);

  useEffect(() => {
    filesList?.length > 0 && setSelectedFile(filesList[0]);
  }, [filesList]);

  return (
    open && (
      <section className="flex-center fixed left-0 top-0 z-[999] h-screen w-full bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="relative flex min-h-[95%] w-[95%] flex-col justify-between rounded-md bg-white p-5 sm:rounded-xl">
          {/* close button  */}
          <button
            type="button"
            onClick={onClose}
            disabled={fileUploading}
            className="flex-center absolute right-4 top-4 h-7 w-7 rounded-md bg-gray-50 text-xl text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="0"
              viewBox="0 0 15 15"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>

          {/* header  */}
          <div className="flex w-full flex-col gap-3 border-b border-gray-200 pb-3">
            <h1 className="text-nowrap text-xl font-semibold text-gray-900">
              {heading}
            </h1>

            <div className="flex flex-row gap-1">
              {tab?.tabs?.map((text, index) => (
                <button
                  type="button"
                  disabled={fileUploading || filesLoading}
                  onClick={() => toggleTab(text)}
                  key={index}
                  className={`${
                    text == tab?.current
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-50 text-gray-800"
                  } px-4 py-2 text-xs font-medium transition-all duration-100 ease-linear disabled:opacity-50`}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* ---- library / uploader ---- */}
          {tab?.current == "Media library" ? (
            // image list - if library selected

            <div className="grid h-[70vh] w-full grid-cols-6 gap-2">
              <div className="col-span-5 grid h-full w-full grid-cols-7 gap-2 overflow-y-auto p-2">
                {filesList?.map((fileData, index) => {
                  const { _id, url, name } = fileData;
                  return (
                    <div key={_id}>
                      <div
                        onClick={() => setSelectedFile(fileData)}
                        className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md"
                      >
                        {_id == selectedFile?._id && (
                          <span className="absolute right-2 top-2 text-xl text-green-500 shadow-sm">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              stroke-width="0"
                              viewBox="0 0 24 24"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Zm16.28-2.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018l-5.97 5.97-2.47-2.47a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l3 3a.75.75 0 0 0 1.06 0Z"></path>
                            </svg>
                          </span>
                        )}
                        <Image
                          src={url}
                          height={200}
                          width={200}
                          className="h-full w-full object-cover"
                          quality={1}
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 py-1.5 text-center text-sm font-medium text-white backdrop-blur-sm">
                          <span>{limitTextLength(name, 10)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* selected image */}
              <div className="col-span-1 flex h-full w-full flex-col overflow-y-auto bg-gray-100 p-3">
                <h3 className="text-sm font-medium text-gray-600">
                  Attachment Details
                </h3>

                <div className="mt-3 flex w-full flex-col gap-3">
                  <Image
                    src={selectedFile?.url}
                    height={200}
                    width={300}
                    className="h-auto w-full border border-gray-200 object-contain"
                  />

                  <div className="flex flex-col gap-2 text-xs font-medium text-gray-700">
                    <p>{selectedFile?.name}</p>
                    <p>{selectedFile?.fName}</p>
                    <p>
                      {moment(selectedFile?.createdDate).format("D MMM YY")}
                    </p>

                    <input
                      onChange={(e) =>
                        setSelectedFile((prev) => ({
                          ...prev,
                          alt: e.target.value,
                        }))
                      }
                      value={selectedFile?.alt}
                      label="Alt Text ?"
                    />

                    <button
                      onClick={() => handleCopy(selectedFile?.url)}
                      className={`${
                        copied ? "bg-green-500" : "bg-blue-500"
                      } flex-center flex-row items-center gap-2 px-5 py-2.5 text-xs font-medium text-white transition-all duration-100 ease-linear`}
                    >
                      <span className="text-xl">
                        {copied ? (
                          <svg
                            stroke="currentColor"
                            fill="none"
                            stroke-width="2"
                            viewBox="0 0 24 24"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M18 6 7 17l-5-5"></path>
                            <path d="m22 10-7.5 7.5L13 16"></path>
                          </svg>
                        ) : (
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7.024 3.75c0-.966.784-1.75 1.75-1.75H20.25c.966 0 1.75.784 1.75 1.75v11.498a1.75 1.75 0 0 1-1.75 1.75H8.774a1.75 1.75 0 0 1-1.75-1.75Zm1.75-.25a.25.25 0 0 0-.25.25v11.498c0 .139.112.25.25.25H20.25a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25Z"></path>
                            <path d="M1.995 10.749a1.75 1.75 0 0 1 1.75-1.751H5.25a.75.75 0 1 1 0 1.5H3.745a.25.25 0 0 0-.25.25L3.5 20.25c0 .138.111.25.25.25h9.5a.25.25 0 0 0 .25-.25v-1.51a.75.75 0 1 1 1.5 0v1.51A1.75 1.75 0 0 1 13.25 22h-9.5A1.75 1.75 0 0 1 2 20.25l-.005-9.501Z"></path>
                          </svg>
                        )}
                      </span>
                      {copied ? "URL Copied!" : "Copy file URL"}
                    </button>
                    <button
                      onClick={() => handleFileDelete(selectedFile?.providerId)}
                      className={`flex-center flex-row gap-1 bg-red-500 px-5 py-2.5 text-xs font-medium text-white transition-all duration-100 ease-linear`}
                    >
                      <span className="text-lg">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          version="1.1"
                          viewBox="0 0 16 16"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M2 5v10c0 0.55 0.45 1 1 1h9c0.55 0 1-0.45 1-1v-10h-11zM5 14h-1v-7h1v7zM7 14h-1v-7h1v7zM9 14h-1v-7h1v7zM11 14h-1v-7h1v7z"></path>
                          <path d="M13.25 2h-3.25v-1.25c0-0.412-0.338-0.75-0.75-0.75h-3.5c-0.412 0-0.75 0.338-0.75 0.75v1.25h-3.25c-0.413 0-0.75 0.337-0.75 0.75v1.25h13v-1.25c0-0.413-0.338-0.75-0.75-0.75zM9 2h-3v-0.987h3v0.987z"></path>
                        </svg>
                      </span>
                      Delete file
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // image uploader - if media upload

            <div className="flex-center w-full flex-col gap-4">
              <label className="text-[20px] font-[600] capitalize text-gray-500">
                Drop files to upload
              </label>
              <div className="flex-center relative aspect-video w-[30%] flex-col gap-1 overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-8">
                <input
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  type="file"
                  onChange={handleFileUpload}
                  disabled={fileUploading}
                  className="absolute left-0 top-0 z-10 h-full w-full opacity-0"
                />

                {fileUploading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="h-8 w-8 animate-spin fill-blue-500 text-white"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                ) : (
                  <>
                    <span className="text-3xl text-gray-300">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                    <span className="text-[12px] font-medium text-gray-500">
                      JPG / WEBP / PNG
                    </span>
                  </>
                )}
              </div>

              <span className="text-xs font-medium text-gray-400">
                Maximum upload file size : 5 MB.
              </span>
            </div>
          )}

          {/* footer  */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            {/* pagination  */}
            {tab?.current == "Media library" ? (
              <div className="flex flex-row items-center gap-2">
                <button
                  disabled={currentPage < 2 || fileUploading || filesLoading}
                  onClick={prev}
                  className="text-xl text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
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
                    <path d="M17.59 18 19 16.59 14.42 12 19 7.41 17.59 6l-6 6z"></path>
                    <path d="m11 18 1.41-1.41L7.83 12l4.58-4.59L11 6l-6 6z"></path>
                  </svg>
                </button>
                <span className="text-xs font-medium text-gray-600">
                  {currentPage} of {totalPages} ({totalImages})
                </span>

                <button
                  disabled={
                    currentPage == totalPages || fileUploading || filesLoading
                  }
                  onClick={next}
                  className="text-xl text-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
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
                    <path d="M6.41 6 5 7.41 9.58 12 5 16.59 6.41 18l6-6z"></path>
                    <path d="m13 6-1.41 1.41L16.17 12l-4.58 4.59L13 18l6-6z"></path>
                  </svg>
                </button>
              </div>
            ) : (
              <span className="text-xs font-medium text-gray-400">
                {" "}
                Select file from locale.{" "}
              </span>
            )}

            <button
              onClick={() =>
                handleClick({
                  _id: selectedFile?._id,
                  url: selectedFile?.url,
                  name: selectedFile?.name,
                  // fName: selectedFile?.fName,
                  alt: selectedFile?.alt,
                })
              }
              disabled={fileUploading || filesLoading}
              className="bg-blue-500 px-5 py-3 text-sm font-medium text-white transition-all duration-100 ease-linear disabled:opacity-50"
            >
              {btnLabel}
            </button>
          </div>
        </div>
      </section>
    )
  );
};

export default ImagLibraryModal;
