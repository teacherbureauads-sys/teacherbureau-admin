import React from "react";
import DashboardLayout from "~/components/layout/dashboard_layout";
import SitesManager from "~/components/section/sites";

const page = () => {
  return (
    <div>
      <DashboardLayout>
        <SitesManager />
      </DashboardLayout>
    </div>
  );
};

export default page;
