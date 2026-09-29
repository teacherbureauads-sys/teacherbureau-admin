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
// CREATE / UPDATE SERVICE
// =====================================================
export const createService = createAsyncThunk(
  "service/createService",
  async (serviceInput, { rejectWithValue }) => {
    const {
      token,
      serviceData,
      serviceId,
    } = serviceInput;

    const endPoint = serviceId
      ? `${BACKEND_API_BASE_URL}/api/service/${serviceId}`
      : `${BACKEND_API_BASE_URL}/api/service`;

    try {
      const response = await axios({
        method: serviceId ? "PUT" : "POST",
        url: endPoint,
        data: serviceData,
        headers: getHeaders(token),
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          "Failed to create service."
      );
    }
  }
);

// =====================================================
// FETCH ALL SERVICES
// =====================================================
export const fetchServices = createAsyncThunk(
  "service/fetchServices",
  async (option, { rejectWithValue }) => {
    const {
      token,
      filters,
    } = option;

    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/service`,
        headers: getHeaders(token),
        params: {
          ...filters,
        },
      });

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch services."
      );
    }
  }
);

// =====================================================
// FETCH SINGLE SERVICE
// =====================================================
export const fetchSingleServices = createAsyncThunk(
  "service/fetchSingleServices",
  async (option, { rejectWithValue }) => {
    const {
      token,
      slug,
    } = option;

    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/service/${slug}`,
        headers: getHeaders(token),
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch service."
      );
    }
  }
);

// =====================================================
// DELETE SERVICE
// =====================================================
export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (option, { rejectWithValue }) => {
    const {
      token,
      slug,
    } = option;

    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/admin/service/${slug}`,
        headers: getHeaders(token),
      });

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to delete service."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================
const initialState = {
  serviceList: [],
  singleService: {},
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

// =====================================================
// SERVICE SLICE
// =====================================================
const serviceSlice = createSlice({
  name: "service",

  initialState,

  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // CREATE SERVICE
      // =================================================
      .addCase(
        createService.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        createService.fulfilled,
        (state) => {
          state.loading = false;
        }
      )

      .addCase(
        createService.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // =================================================
      // FETCH SERVICES
      // =================================================
      .addCase(
        fetchServices.pending,
        (state) => {
          state.dataLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchServices.fulfilled,
        (state, action) => {
          const {
            data,
            count,
          } = action.payload || {};

          state.dataLoading = false;
          state.serviceList = data || [];
          state.documentCount = count || 0;
        }
      )

      .addCase(
        fetchServices.rejected,
        (state, action) => {
          state.dataLoading = false;
          state.error = action.payload;
        }
      )

      // =================================================
      // FETCH SINGLE SERVICE
      // =================================================
      .addCase(
        fetchSingleServices.pending,
        (state) => {
          state.dataLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchSingleServices.fulfilled,
        (state, action) => {
          const {
            data,
            count,
          } = action.payload || {};

          state.dataLoading = false;
          state.singleService = data || {};
          state.documentCount = count || 0;
        }
      )

      .addCase(
        fetchSingleServices.rejected,
        (state, action) => {
          state.dataLoading = false;
          state.error = action.payload;
        }
      )

      // =================================================
      // DELETE SERVICE
      // =================================================
      .addCase(
        deleteService.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteService.fulfilled,
        (state, action) => {
          state.loading = false;

          const deletedSlug =
            action.meta.arg?.slug;

          state.serviceList =
            state.serviceList.filter(
              (service) =>
                service.slug !== deletedSlug
            );

          state.documentCount = Math.max(
            0,
            state.documentCount - 1
          );
        }
      )

      .addCase(
        deleteService.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetError } =
  serviceSlice.actions;

export default serviceSlice.reducer;
