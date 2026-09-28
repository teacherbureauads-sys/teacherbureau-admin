"use client";

import { Provider } from "react-redux";
import { store } from "~/lib/redux/store";
import "~/lib/site";

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
