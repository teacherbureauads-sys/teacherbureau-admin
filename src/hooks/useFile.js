import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const useFile = (baseURL) => {
  const [fileUploading, setFileUploading] = useState(false);
  const [filesLoading, setFilesLoading] = useState(true);
  const [fileDeleting, setFileDeleting] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    totalImages: 0,
    totalPages: 0,
    currentPage: 0,
  });

  // Upload a single file
  const uploadFile = useCallback(
    async (file) => {
      setFileUploading(true);
      const token = Cookies.get("access_token") || null;
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${baseURL}/api/media`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",

            Authorization: `Bearer ${token}`,
          },
        });

        setFileUploading(false);
        return response.data; // Handle the response as needed
      } catch (error) {
        setFileUploading(false);
        console.error("File upload error:", error);
        throw error;
      }
    },
    [baseURL]
  );

  // Delete a file by ID
  const deleteFile = useCallback(
    async (fileId) => {
      setFileDeleting(true);
      const token = Cookies.get("access_token") || null;
      try {
        const response = await axios.delete(`${baseURL}/api/media/${fileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFileDeleting(false);
        return response.data;
      } catch (error) {
        setFileDeleting(false);
        console.error("File deletion error:", error);
        throw error;
      }
    },
    [baseURL]
  );

  // Fetch all files with pagination
  const fetchFiles = useCallback(
    async (limit = 21, page = 1) => {
      setFilesLoading(true);
      const token = Cookies.get("access_token") || null;
      try {
        const response = await axios.get(
          `${baseURL}/api/media/public?limit=${limit}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { count } = response.data;
        const images = response?.data?.data;
        const totalPages = Math.ceil(count / limit);
        setFilesList(images || []);
        setPaginationInfo({
          currentPage: page,
          totalImages: count,
          totalPages,
        });
        setFilesLoading(false);
      } catch (error) {
        setFilesLoading(false);
        console.error("Fetch files error:", error);
        throw error;
      }
    },
    [baseURL]
  );

  return {
    fileUploading,
    filesLoading,
    fileDeleting,
    filesList,
    setFilesList,
    paginationInfo,
    uploadFile,
    deleteFile,
    fetchFiles,
  };
};

export default useFile;
