import React from "react";
import DashboardLayout from "~/components/layout/dashboard_layout";
import AllPageList from "~/components/section/page-content";

const PageList = () => {
  return (
    <DashboardLayout pageTitle="All Page Content">
      <AllPageList />
    </DashboardLayout>
  );
};

export default PageList;
