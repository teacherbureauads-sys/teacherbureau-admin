import React from "react";
import DashboardLayout from "~/components/layout/dashboard_layout";
import CreateNewPage from "~/components/section/page-content/AddNew";

const AddNewPage = () => {
  return (
    <DashboardLayout pageTitle="Add New Page">
      <CreateNewPage />
    </DashboardLayout>
  );
};

export default AddNewPage;
