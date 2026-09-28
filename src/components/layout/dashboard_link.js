import Link from "next/link";

const DashboardLink = ({
  active = false,
  label = "Label",
  heroIcon,
  route = "#",
}) => {
  return (
    <li className="w-full">
      <Link
        href={route}
        className={`${
          active ? "bg-blue-100 text-blue-500" : "bg-transparent text-gray-900"
        } w-full hover:bg-blue-50 hover:text-blue-400 rounded-md py-2.5 px-3 flex flex-row items-center gap-1.5 transition-all duration-200`}
      >
        <span
          className="text-md"
          dangerouslySetInnerHTML={{ __html: heroIcon }}
        />
        <span className="pt-[1px] font-[500] text-[13px] capitalize">
          {label}
        </span>
      </Link>
    </li>
  );
};

export default DashboardLink;
