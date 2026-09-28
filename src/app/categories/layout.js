import React from "react";
import { CategoryLayout } from "~/components/layout/category_layout";
import DashboardLayout from "~/components/layout/dashboard_layout";

const CatRootLayout = ({ children }) => {
  return (
    <DashboardLayout pageTitle="Categories">
      <CategoryLayout>{children}</CategoryLayout>
    </DashboardLayout>
  );
};

export default CatRootLayout;
