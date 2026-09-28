import { configureStore } from "@reduxjs/toolkit";
import authReducer from "~/lib/redux/slices/auth-slice";
import mainCategoryReducer from "~/lib/redux/slices/main-category-slice";
import subCategoryReducer from "~/lib/redux/slices/sub-category-slice";
import childCategoryReducer from "~/lib/redux/slices/child-category-slice";
import blogReducer from "~/lib/redux/slices/blog-slice";
import serviceReducer from "~/lib/redux/slices/service-slice";
import pageReducer from "~/lib/redux/slices/page-slice";
import queryReducer from "~/lib/redux/slices/query-slice";
export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      category: mainCategoryReducer,
      subCategory: subCategoryReducer,
      childCategory: childCategoryReducer,
      blog: blogReducer,
      service: serviceReducer,
      pages: pageReducer,
      query: queryReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}

export const store = makeStore();
