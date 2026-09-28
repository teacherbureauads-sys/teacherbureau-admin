import React from "react";

const DashboardCard = ({
  label = "label",
  icon = (
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
      <rect x="3" y="5" width="6" height="6" rx="1"></rect>
      <path d="m3 17 2 2 4-4"></path>
      <path d="M13 6h8"></path>
      <path d="M13 12h8"></path>
      <path d="M13 18h8"></path>
    </svg>
  ),
  title = "title",
  analytics = "0% from last month",
}) => {
  return (
    <div className="w-full shadow-sm rounded-lg relative bg-white overflow-auto">
      <div className="w-fit flex flex-col p-5">
        <span className="text-[13px] font-medium text-gray-800 capitalize">
          {label}
        </span>

        <p className="font-semibold text-balance text-xl">{title}</p>
        <span className="text-[12px] font-medium text-gray-800">
          {analytics}
        </span>
      </div>

      {/* icon  */}

      <div className="w-fit absolute right-0 top-0 h-full bg-green-100 px-5 rounded-tl-full  rounded-bl-full flex-center">
        <span className="text-2xl text-green-500">{icon}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
