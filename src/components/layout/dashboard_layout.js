"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardLink from "./dashboard_link";
import SiteSwitcher from "~/components/common/SiteSwitcher";
import menu from "../../../public/db/navigation.json";
import { usePathname } from "next/navigation";
import { useFetchUserOnLoad } from "~/hooks/useFetchUserOnLoad";
import { logout } from "~/lib/redux/slices/auth-slice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
const { side_bar_menu } = menu;

export default function DashboardLayout({ children, pageTitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isUserMenu, setIsUserMenu] = useState(false);

  // @getting user details - also verifying ✅
  useFetchUserOnLoad();

  const { user } = useSelector((state) => state.auth);

  const path = usePathname();

  const router = useRouter();

  const dispatch = useDispatch();

  // user info
  const {
    fullName = "admin",
    email,
    userImage,
    phoneNo,
    role,
    isVerified,
    _id,
  } = user;

  // log out
  const handleLogout = () => {
    dispatch(logout());
    router.replace("/auth");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Hidden on small screens, always visible on medium and larger */}
      <div
        className={` fixed inset-y-0 left-0 bg-white shadow transform transition-transform duration-300 z-30 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-64 w-64 xl:w-72`}
      >
        <div className="h-full relative ">
          <nav className="flex py-4 flex-col gap-7 h-full">
            <div className="px-4 ">
              <Image
                src="/hometuitionlogo.png"
                alt="logo"
                height={80}
                width={190}
                className="w-[70%] h-auto  contrast-200"
              />
            </div>

            <SiteSwitcher />

            {/* sidebar menu */}
            <ul className="max-h-[75%] overflow-y-auto vertical-scrollbar w-full flex flex-col gap-2 px-4 ">
              {/* home tab */}
              <DashboardLink
                active={path === side_bar_menu.home_menu.route}
                route={side_bar_menu.home_menu.route}
                label={side_bar_menu.home_menu.label}
                heroIcon={side_bar_menu.home_menu.icon}
              />

              {/* buy group  */}
              <div className="py-4 border-b w-full flex flex-col gap-2">
                <span className="text-[11px] font-medium text-gray-900  px-3">
                  Tool
                </span>
                {/* buy menu */}
                {side_bar_menu.buying_menu.map((buy, index) => (
                  <DashboardLink
                    key={index}
                    active={path === buy.route}
                    route={buy.route}
                    label={buy.label}
                    heroIcon={buy.icon}
                  />
                ))}
              </div>
              <div className="pt-4  w-full flex flex-col gap-2">
                {/* other menu */}
                {side_bar_menu.other_menu.map((other, index) => (
                  <DashboardLink
                    key={index}
                    active={path === other.route}
                    route={other.route}
                    label={other.label}
                    heroIcon={other.icon}
                  />
                ))}
              </div>
            </ul>
          </nav>

          {/* bottom profile area  */}
          <div className="w-full absolute bottom-0 left-0 ">
            {isUserMenu && (
              <div className="p-3 w-[95%] mx-auto bg-gray-100 rounded-lg mb-2 flex flex-col">
                <h3 className="capitalize font-semibold text-gray-900 text-[16px]">
                  {role}
                </h3>
                <p className="text-[12px] text-gray-400">{email}</p>
                <button
                  onClick={() => handleLogout()}
                  className="mt-3 text-[13px] font-medium bg-red-500 text-white py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                >
                  Log out
                </button>
              </div>
            )}

            <div className="w-full  bg-gray-50 border-t  p-3 flex flex-row items-center justify-between">
              {/* avatar  */}
              <div className="w-full flex flex-row items-center gap-2">
                <div className="h-9 w-9 text-[14px] flex-center rounded-full bg-gray-200 text-lg text-gray-600 animate-spin">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    role="img"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.3696 2.5006 12.0006 5 7.6303 7.5006v-5L12.0006 0Zm6.1177 3.499.0028 4.986-8.7282-4.9929 4.3564-2.4923Zm-4.369 9.5085-.0014 4.9972 4.3774-2.5007-.0028-5.018-4.3732-2.502zM7.6274 21.502 12.0006 24l4.369-2.4952v-4.9972zM7.6303 9.5v5.0014l4.3703 2.4992 4.369-2.4937V9.5001l-4.369-2.4993Zm-6.1248 8.5044.0028-5.0055 8.7464 5.0027-4.376 2.5008Zm4.376-14.504L1.5125 6.001l-.0028 4.9985 4.3718 2.502z"></path>
                  </svg>
                </div>
                <h5 className="capitalize font-medium text-black text-[14px]">
                  {fullName}
                </h5>
              </div>
              <button
                onClick={() => setIsUserMenu(!isUserMenu)}
                className="text-lg text-gray-500 transition-all duration-200 hover:bg-gray-100 p-2 rounded-lg"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273 167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4 24.6 9.4 33.9 0l127.1-127z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden backdrop-blur-[2px]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Sticky Header */}
        <header className="sticky top-0 bg-white shadow-sm py-3 flex justify-between items-center z-10 px-5 md:px-8">
          <div className="flex items-center gap-4 sm:gap-0 ">
            {/* Hamburger Icon (Visible on mobile) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden outline-none "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <Link
              href="#"
              className="flex flex-row items-center gap-1 text-gray-800"
            >
              <span className="text-lg ">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path>
                </svg>
              </span>
              <h1 className="text-md font-medium text-gray-800">{pageTitle}</h1>
            </Link>
          </div>

          {/* Bell Icon */}

          <div className="w-fit flex flex-row items-center gap-2">
            {/* live rate  */}
            <div className="hover:cursor-progress hover:bg-opacity-70 transition-all bg-blue-100 rounded-md p-2 flex flex-row gap-20 sm:gap-24">
              <div className="flex flex-col">
                <span className="font-medium text-black text-[11px]">TMT</span>
                <span className="font-normal text-black text-[10px]">
                  Delhi
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-black text-[11px]">
                  ₹300.12
                </span>
                <span className="font-normal text-black text-[10px]">
                  2.5mm
                </span>
              </div>
            </div>

            {/* <Link
              href="#"
              className="text-xl text-blue-500 hover:text-blue-600 p-2 rounded-full transition-all duration-200 hover:bg-blue-100"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 17H22V19H2V17H4V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V17ZM9 21H15V23H9V21Z"></path>
              </svg>
            </Link> */}
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-[100vw] flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
