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
// CREATE / UPDATE CATEGORY
// =====================================================
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryInput, { rejectWithValue }) => {
    const {
      token,
      categoryData,
      categoryId,
    } = categoryInput;

    const endPoint = categoryId
      ? `${BACKEND_API_BASE_URL}/api/category/${categoryId}`
      : `${BACKEND_API_BASE_URL}/api/category`;

    try {
      const response = await axios({
        method: categoryId ? "PUT" : "POST",
        url: endPoint,
        data: categoryData,
        headers: getHeaders(token),
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create category."
      );
    }
  }
);

// =====================================================
// FETCH ALL CATEGORIES
// =====================================================
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (option, { rejectWithValue }) => {
    const {
      token,
      filters,
    } = option;

    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/category`,
        headers: getHeaders(token),
        params: {
          ...filters,
        },
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch categories."
      );
    }
  }
);

// =====================================================
// DELETE CATEGORY
// =====================================================
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (
    { id, token },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/category/${id}`,
        headers: getHeaders(token),
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to delete category."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================
const initialState = {
  categoryList: [],
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

// =====================================================
// CATEGORY SLICE
// =====================================================
const categorySlice = createSlice({
  name: "category",

  initialState,

  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // CREATE CATEGORY
      // =================================================
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        createCategory.fulfilled,
        (state, action) => {
          state.loading = false;

          const existingIndex =
            state.categoryList.findIndex(
              (category) =>
                category._id ===
                action.payload?._id
            );

          if (existingIndex === -1) {
            state.categoryList.unshift(
              action.payload
            );
          } else {
            state.categoryList[
              existingIndex
            ] = action.payload;
          }
        }
      )

      .addCase(
        createCategory.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // =================================================
      // FETCH CATEGORIES
      // =================================================
      .addCase(
        fetchCategories.pending,
        (state) => {
          state.dataLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchCategories.fulfilled,
        (state, action) => {
          const {
            data,
            count,
          } = action.payload || {};

          state.dataLoading = false;
          state.categoryList = data || [];
          state.documentCount = count || 0;
        }
      )

      .addCase(
        fetchCategories.rejected,
        (state, action) => {
          state.dataLoading = false;
          state.error = action.payload;
        }
      )

      // =================================================
      // DELETE CATEGORY
      // =================================================
      .addCase(
        deleteCategory.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteCategory.fulfilled,
        (state, action) => {
          state.loading = false;

          const deletedCategoryId =
            action.meta.arg?.id ||
            action.payload?._id;

          state.categoryList =
            state.categoryList.filter(
              (category) =>
                category._id !==
                deletedCategoryId
            );

          state.documentCount = Math.max(
            0,
            state.documentCount - 1
          );
        }
      )

      .addCase(
        deleteCategory.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetError } =
  categorySlice.actions;

export default categorySlice.reducer;
