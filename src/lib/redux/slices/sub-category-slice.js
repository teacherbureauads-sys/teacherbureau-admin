import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

const DEFAULT_SITE = "hometuitionacademy";

const getSelectedSite = () => {
  if (typeof window === "undefined") {
    return DEFAULT_SITE;
  }

  return (
    localStorage.getItem("selectedSite") ||
    DEFAULT_SITE
  );
};

const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "x-site": getSelectedSite(),
});

// =====================================================
// CREATE / UPDATE SUB CATEGORY
// =====================================================
export const createSubCategory = createAsyncThunk(
  "subCategory/createSubCategory",
  async (subCategoryInput, { rejectWithValue }) => {
    const {
      token,
      subCategoryData,
      subCategoryId,
    } = subCategoryInput;

    const endPoint = subCategoryId
      ? `${BACKEND_API_BASE_URL}/api/sub-category/${subCategoryId}`
      : `${BACKEND_API_BASE_URL}/api/sub-category`;

    try {
      const response = await axios({
        method: subCategoryId ? "PUT" : "POST",
        url: endPoint,
        data: subCategoryData,
        headers: getHeaders(token),
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create or update subcategory."
      );
    }
  }
);

// =====================================================
// FETCH ALL SUB CATEGORIES
// =====================================================
export const fetchSubCategories = createAsyncThunk(
  "subCategory/fetchSubCategories",
  async (option, { rejectWithValue }) => {
    const { token } = option;

    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/sub-category`,
        headers: getHeaders(token),
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch subcategories."
      );
    }
  }
);

// =====================================================
// DELETE SUB CATEGORY
// =====================================================
export const deleteSubCategory = createAsyncThunk(
  "subCategory/deleteSubCategory",
  async (
    { id, token },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/sub-category/${id}`,
        headers: getHeaders(token),
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to delete subcategory."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================
const initialState = {
  subCategoryList: [],
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

// =====================================================
// SUB CATEGORY SLICE
// =====================================================
const subCategorySlice = createSlice({
  name: "subCategory",

  initialState,

  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // CREATE / UPDATE SUB CATEGORY
      // =================================================
      .addCase(
        createSubCategory.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        createSubCategory.fulfilled,
        (state, action) => {
          state.loading = false;

          const existingIndex =
            state.subCategoryList.findIndex(
              (subCategory) =>
                subCategory._id ===
                action.payload?._id
            );

          if (existingIndex === -1) {
            state.subCategoryList.unshift(
              action.payload
            );
          } else {
            state.subCategoryList[
              existingIndex
            ] = action.payload;
          }
        }
      )

      .addCase(
        createSubCategory.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // =================================================
      // FETCH SUB CATEGORIES
      // =================================================
      .addCase(
        fetchSubCategories.pending,
        (state) => {
          state.dataLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSubCategories.fulfilled,
        (state, action) => {
          const {
            data,
            count,
          } = action.payload || {};

          state.dataLoading = false;
          state.subCategoryList = data || [];
          state.documentCount = count || 0;
        }
      )

      .addCase(
        fetchSubCategories.rejected,
        (state, action) => {
          state.dataLoading = false;
          state.error = action.payload;
        }
      )

      // =================================================
      // DELETE SUB CATEGORY
      // =================================================
      .addCase(
        deleteSubCategory.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteSubCategory.fulfilled,
        (state, action) => {
          state.loading = false;

          const deletedId =
            action.meta.arg?.id;

          state.subCategoryList =
            state.subCategoryList.filter(
              (subCategory) =>
                subCategory._id !== deletedId
            );

          state.documentCount = Math.max(
            0,
            state.documentCount - 1
          );
        }
      )

      .addCase(
        deleteSubCategory.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetError } =
  subCategorySlice.actions;

export default subCategorySlice.reducer;
