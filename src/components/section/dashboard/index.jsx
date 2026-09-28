"use client";
import DashboardCard from "../cards/dashboard_card";
import MainChart from "./cahrts";

const MainDashboard = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      {/* card grid layout  */}
      <div className="w-full grid sm:grid-cols-3 gap-3 xl:gap-4">
        <DashboardCard
          label="Total Enquiry"
          title="0 MT"
          analytics="0% from last month"
        />
        <DashboardCard
          label="Total Order"
          title="0 MT"
          analytics="0% from last month"
          icon={
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0"
              ></path>
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"></path>
            </svg>
          }
        />
        <DashboardCard
          label="Total Invoices"
          title="₹0.00 Cr"
          analytics="0% from last month"
          icon={
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.5 3h5a1.5 1.5 0 0 1 1.5 1.5a3.5 3.5 0 0 1 -3.5 3.5h-1a3.5 3.5 0 0 1 -3.5 -3.5a1.5 1.5 0 0 1 1.5 -1.5z"></path>
              <path d="M4 17v-1a8 8 0 1 1 16 0v1a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"></path>
            </svg>
          }
        />
      </div>

      {/* all charts  */}
      <div className="w-full">
        <MainChart />
      </div>
    </div>
  );
};

export default MainDashboard;
