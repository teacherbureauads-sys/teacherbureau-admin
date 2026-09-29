"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardLink from "./dashboard_link";
import menu from "../../../public/db/navigation.json";
import { usePathname, useRouter } from "next/navigation";
import { useFetchUserOnLoad } from "~/hooks/useFetchUserOnLoad";
import { logout } from "~/lib/redux/slices/auth-slice";
import { useDispatch, useSelector } from "react-redux";

const { side_bar_menu } = menu;

const DEFAULT_SITE = "hometuitionacademy";

const SITES = [
  {
    key: "hometuitionacademy",
    name: "Home Tuition Academy",
  },
  {
    key: "teachersbureau",
    name: "Teachers Bureau",
  },
];

export default function DashboardLayout({ children, pageTitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenu, setIsUserMenu] = useState(false);

  const [selectedSite, setSelectedSite] = useState(DEFAULT_SITE);

  useFetchUserOnLoad();

  const { user } = useSelector((state) => state.auth);

  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    fullName = "admin",
    email,
    role,
  } = user || {};

  // Load selected website
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedSite =
      localStorage.getItem("selectedSite") || DEFAULT_SITE;

    setSelectedSite(savedSite);
  }, []);

  // Change website
  const handleSiteChange = (site) => {
    setSelectedSite(site);

    if (typeof window !== "undefined") {
      localStorage.setItem("selectedSite", site);
    }

    // Reload dashboard so every page fetches selected site's data
    window.location.reload();
  };

  // Logout
  const handleLogout = () => {
    dispatch(logout());
    router.replace("/auth");
  };

  const currentSite =
    SITES.find((site) => site.key === selectedSite) || SITES[0];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow transform transition-transform duration-300 z-30 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-64 w-64 xl:w-72`}
      >
        <div className="h-full relative">
          <nav className="flex py-4 flex-col gap-5 h-full">

            {/* LOGO */}
            <div className="px-4">
              <Image
                src="/hometuitionlogo.png"
                alt="logo"
                height={80}
                width={190}
                className="w-[70%] h-auto contrast-200"
              />
            </div>

            {/* ================= WEBSITE SELECTOR ================= */}
            <div className="px-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-[11px] font-semibold text-gray-500 mb-2">
                  WEBSITE YOU ARE EDITING
                </p>

                <select
                  value={selectedSite}
                  onChange={(e) =>
                    handleSiteChange(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                  {SITES.map((site) => (
                    <option
                      key={site.key}
                      value={site.key}
                    >
                      {site.name}
                    </option>
                  ))}
                </select>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>

                  <span className="text-[11px] text-gray-500">
                    Editing:{" "}
                    <span className="font-semibold text-gray-700">
                      {currentSite.name}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* ================= SIDEBAR MENU ================= */}
            <ul className="max-h-[68%] overflow-y-auto vertical-scrollbar w-full flex flex-col gap-2 px-4">

              {/* HOME */}
              <DashboardLink
                active={
                  path === side_bar_menu.home_menu.route
                }
                route={side_bar_menu.home_menu.route}
                label={side_bar_menu.home_menu.label}
                heroIcon={side_bar_menu.home_menu.icon}
              />

              {/* TOOLS */}
              <div className="py-4 border-b w-full flex flex-col gap-2">
                <span className="text-[11px] font-medium text-gray-900 px-3">
                  Tool
                </span>

                {side_bar_menu.buying_menu.map(
                  (buy, index) => (
                    <DashboardLink
                      key={index}
                      active={path === buy.route}
                      route={buy.route}
                      label={buy.label}
                      heroIcon={buy.icon}
                    />
                  )
                )}
              </div>

              {/* OTHER */}
              <div className="pt-4 w-full flex flex-col gap-2">
                {side_bar_menu.other_menu.map(
                  (other, index) => (
                    <DashboardLink
                      key={index}
                      active={path === other.route}
                      route={other.route}
                      label={other.label}
                      heroIcon={other.icon}
                    />
                  )
                )}
              </div>
            </ul>
          </nav>

          {/* ================= USER MENU ================= */}
          <div className="w-full absolute bottom-0 left-0">

            {isUserMenu && (
              <div className="p-3 w-[95%] mx-auto bg-gray-100 rounded-lg mb-2 flex flex-col">
                <h3 className="capitalize font-semibold text-gray-900 text-[16px]">
                  {role || "admin"}
                </h3>

                <p className="text-[12px] text-gray-400">
                  {email}
                </p>

                <button
                  onClick={handleLogout}
                  className="mt-3 text-[13px] font-medium bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  Log out
                </button>
              </div>
            )}

            <div className="w-full bg-gray-50 border-t p-3 flex flex-row items-center justify-between">

              <div className="w-full flex flex-row items-center gap-2">

                <div className="h-9 w-9 text-[14px] flex items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    role="img"
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16.3696 2.5006 12.0006 5 7.6303 7.5006v-5L12.0006 0Zm6.1177 3.499.0028 4.986-8.7282-4.9929 4.3564-2.4923Zm-4.369 9.5085-.0014 4.9972 4.3774-2.5007-.0028-5.018-4.3732-2.502zM7.6274 21.502 12.0006 24l4.369-2.4952v-4.9972zM7.6303 9.5v5.0014l4.3703 2.4992 4.369-2.4937V9.5001l-4.369-2.4993Zm-6.1248 8.5044.0028-5.0055 8.7464 5.0027-4.376 2.5008Zm4.376-14.504L1.5125 6.001l-.0028 4.9985 4.3718 2.502z" />
                  </svg>
                </div>

                <h5 className="capitalize font-medium text-black text-[14px]">
                  {fullName}
                </h5>
              </div>

              <button
                onClick={() =>
                  setIsUserMenu(!isUserMenu)
                }
                className="text-lg text-gray-500 transition-all duration-200 hover:bg-gray-100 p-2 rounded-lg"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273 167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4 24.6 9.4 33.9 0l127.1-127z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden backdrop-blur-[2px]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* HEADER */}
        <header className="sticky top-0 bg-white shadow-sm py-3 flex justify-between items-center z-10 px-5 md:px-8">

          <div className="flex items-center gap-4 sm:gap-0">

            {/* MOBILE MENU */}
            <button
              onClick={() =>
                setIsSidebarOpen(!isSidebarOpen)
              }
              className="md:hidden outline-none"
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

            <div className="flex flex-row items-center gap-2 text-gray-800">

              <span className="text-lg">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" />
                </svg>
              </span>

              <div>
                <h1 className="text-md font-medium text-gray-800">
                  {pageTitle}
                </h1>

                <p className="text-[10px] text-gray-400">
                  {currentSite.name}
                </p>
              </div>
            </div>
          </div>

          {/* CURRENT WEBSITE */}
          <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>

            <span className="text-xs font-medium text-gray-700">
              {currentSite.name}
            </span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="max-w-[100vw] flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
