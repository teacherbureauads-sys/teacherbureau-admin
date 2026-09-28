import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_API_BASE_URL = process.env.BACKEND_API_BASE_URL;

// Async thunk to create a service
export const createService = createAsyncThunk(
  "service/createService",
  async (serviceInput, { rejectWithValue }) => {
    const { token, serviceData, serviceId } = serviceInput;

    const endPoint = serviceId
      ? `${BACKEND_API_BASE_URL}/api/service/${serviceId}`
      : `${BACKEND_API_BASE_URL}/api/service`;

    try {
      const response = await axios({
        method: serviceId ? "PUT" : "POST",
        url: endPoint,
        data: serviceData,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create service."
      );
    }
  }
);

// Async thunk to fetch all categories
export const fetchServices = createAsyncThunk(
  "service/fetchServices",
  async (option, { rejectWithValue }) => {
    const { token, filters } = option;
    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/service`,
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...filters,
        },
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories."
      );
    }
  }
);

export const fetchSingleServices = createAsyncThunk(
  "service/fetchSingleServices",
  async (option, { rejectWithValue }) => {
    const { token, slug } = option;
    try {
      const response = await axios({
        method: "GET",
        url: `${BACKEND_API_BASE_URL}/api/service/${slug}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories."
      );
    }
  }
);

export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (option, { rejectWithValue }) => {
    const { token, slug } = option;
    try {
      const response = await axios({
        method: "DELETE",
        url: `${BACKEND_API_BASE_URL}/api/admin/service/${slug}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories."
      );
    }
  }
);

// Initial state
const initialState = {
  serviceList: [],
  singleService: {},
  documentCount: 0,
  loading: false,
  dataLoading: true,
  error: null,
};

// service slice
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
      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Categories
      .addCase(fetchServices.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.serviceList = data; // Populate the service list
        state.documentCount = count;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchSingleServices.pending, (state) => {
        state.dataLoading = true;
        state.error = null;
      })
      .addCase(fetchSingleServices.fulfilled, (state, action) => {
        const { data, count } = action.payload;
        state.dataLoading = false;
        state.singleService = data;
        state.documentCount = count;
      })
      .addCase(fetchSingleServices.rejected, (state, action) => {
        state.dataLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteService.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(deleteService.fulfilled, (state, action) => {
  state.loading = false;

  state.serviceList = state.serviceList.filter(
    (service) => service.slug !== action.meta.arg.slug
  );

  state.documentCount = Math.max(0, state.documentCount - 1);
})
.addCase(deleteService.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
  },
});

export const { resetError } = serviceSlice.actions;
export default serviceSlice.reducer;
