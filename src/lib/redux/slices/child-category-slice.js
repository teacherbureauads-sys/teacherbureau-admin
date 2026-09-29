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
// CREATE / UPDATE CHILD CATEGORY
// =====================================================
export const createChildCategory = createAsyncThunk(
  "childCategory/createChildCategory",
  async (childCategoryInput, { rejectWithValue }) => {
    const {
      token,
      childCategoryData,
      childCategoryId,
    } = childCategoryInput;

    const endPoint = childCategoryId
      ? `${BACKEND_API_BASE_URL}/api/child-category/${childCategoryId}`
      : `${BACKEND_API_BASE_URL}/api/child-category`;

    try {
      const response = await axios({
        method: childCategoryId ? "PUT" : "POST",
        url: endPoint,
        data: childCategoryData,
        headers: getHeaders(token),
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create or update child category."
      );
    }
  }
);

// =====================================================
// FETCH CHILD CATEGORIES
// =====================================================
export const fetchChildCategories = createAsyncThunk(
  "childCategory/fetchChildCategories",
  async (option, { rejectWithValue }) => {
    const { token } = option;

    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/child-category`,
        headers: getHeaders(token),
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch child categories."
      );
    }
  }
);

// =====================================================
// DELETE CHILD CATEGORY
// =====================================================
export const deleteChildCategory = createAsyncThunk(
  "childCategory/deleteChildCategory",
  async (
    { id, token },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/child-category/${id}`,
        headers: getHeaders(token),
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to delete child category."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================
const initialState = {
  childCategoryList: [],
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

// =====================================================
// CHILD CATEGORY SLICE
// =====================================================
const childCategorySlice = createSlice({
  name: "childCategory",

  initialState,

  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // CREATE / UPDATE CHILD CATEGORY
      // =================================================
      .addCase(
        createChildCategory.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        createChildCategory.fulfilled,
        (state, action) => {
          state.loading = false;

          const existingIndex =
            state.childCategoryList.findIndex(
              (childCategory) =>
                childCategory._id ===
                action.payload?._id
            );

          if (existingIndex === -1) {
            state.childCategoryList.unshift(
              action.payload
            );
          } else {
            state.childCategoryList[
              existingIndex
            ] = action.payload;
          }
        }
      )

      .addCase(
        createChildCategory.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // =================================================
      // FETCH CHILD CATEGORIES
      // =================================================
      .addCase(
        fetchChildCategories.pending,
        (state) => {
          state.dataLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchChildCategories.fulfilled,
        (state, action) => {
          const {
            data,
            count,
          } = action.payload || {};

          state.dataLoading = false;
          state.childCategoryList =
            data || [];
          state.documentCount =
            count || 0;
        }
      )

      .addCase(
        fetchChildCategories.rejected,
        (state, action) => {
          state.dataLoading = false;
          state.error = action.payload;
        }
      )

      // =================================================
      // DELETE CHILD CATEGORY
      // =================================================
      .addCase(
        deleteChildCategory.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteChildCategory.fulfilled,
        (state, action) => {
          state.loading = false;

          const deletedId =
            action.meta.arg?.id;

          state.childCategoryList =
            state.childCategoryList.filter(
              (childCategory) =>
                childCategory._id !== deletedId
            );

          state.documentCount = Math.max(
            0,
            state.documentCount - 1
          );
        }
      )

      .addCase(
        deleteChildCategory.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetError } =
  childCategorySlice.actions;

export default childCategorySlice.reducer;
