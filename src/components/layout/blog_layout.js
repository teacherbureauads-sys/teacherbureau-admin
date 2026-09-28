"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BlogLayout = ({ children, params }) => {
  const tabs = [
    { route: "/blog-post", label: "All Blog" },
    { route: "/blog-post/create-blog", label: "Post blog" },
    { route: "/categories/main-category", label: "Blog category" },
  ];

  const path = usePathname();

  return (
    <main className="w-full  h-[85vh] flex flex-col gap-5">
      <ul class="w-fit text-sm font-medium text-center  rounded-lg  flex">
        {tabs.map((tab, index) => {
          const { label, route } = tab;
          return (
            <li key={index}>
              <Link
                href={route}
                className={`${
                  route === path ? "bg-blue-100 text-blue-600" : "text-gray-900"
                }  w-full py-1.5 px-3 capitalize rounded-2xl transition-all duration-150`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {children}
    </main>
  );
};
