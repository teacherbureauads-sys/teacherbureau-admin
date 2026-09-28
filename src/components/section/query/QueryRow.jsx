"use client";

import moment from "moment";
import { successToast, errorToast } from "~/utils/toastMessage";

const ROLE_COLORS = {
  Parent: "bg-blue-100 text-blue-700",
  Student: "bg-purple-100 text-purple-700",
  Teacher: "bg-orange-100 text-orange-700",
};

const MODE_COLORS = {
  Online: "bg-teal-100 text-teal-700",
  Offline: "bg-amber-100 text-amber-700",
  Home: "bg-pink-100 text-pink-700",
};

const QueryRow = ({ data , srNo ,handleDelete }) => {
  const { _id, name, mobile, message, source, createdAt } = data;

  // The website/popup forms prefix the sender's role, the tuition mode
  // they teach/want (Online/Offline/Home) and the city/pincode into the
  // message text as "[Parent] [Online Tuition] [Mumbai - 400001] ..."
  // since the backend has no dedicated fields for these — pull them back
  // out here so they show as their own badges instead of being buried
  // inside the message text.
  let rest = message || "";
  let role;
  let tuitionMode;
  let location;

  const roleMatch = rest.match(/^\[(Parent|Student|Teacher)\]\s*/);
  if (roleMatch) {
    role = roleMatch[1];
    rest = rest.slice(roleMatch[0].length);
  }

  const modeMatch = rest.match(/^\[(Online|Offline|Home) Tuition\]\s*/);
  if (modeMatch) {
    tuitionMode = modeMatch[1];
    rest = rest.slice(modeMatch[0].length);
  }

  const locationMatch = rest.match(/^\[([^\]]+)\]\s*/);
  if (locationMatch) {
    location = locationMatch[1];
    rest = rest.slice(locationMatch[0].length);
  }

  const messageWithoutTags = rest;

  const handleCopy = () => {
    const lines = [
      "📋 Home Tuition Academy - New Lead",
      "------------------------------------",
      `Name: - ${name || "-"}`,
      `Mobile: - ${mobile || "-"}`,
      `Role: - ${role || "-"}`,
      `Tuition Mode: - ${tuitionMode || "-"}`,
      `Location: - ${location || "-"}`,
      `Message: - ${messageWithoutTags || "-"}`,
      `Source: - ${source || "-"}`,
      `Date: - ${moment(createdAt).format("DD MMM YY")}`,
      "------------------------------------",
    ];
    navigator.clipboard
      .writeText(lines.join("\n"))
      .then(() => successToast("Lead details copied"))
      .catch(() => errorToast("Failed to copy"));
  };

  return (
    <tr key={_id} className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-900">{srNo}</td>

      <td className="px-4 py-3 font-medium text-gray-900">{name}</td>

      <td className="px-4 py-3 text-center">{mobile}</td>

      <td className="px-4 py-3 text-center">
        {role ? (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[role] || "bg-gray-100 text-gray-700"}`}
          >
            {role}
          </span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      <td className="px-4 py-3 text-center">
        {tuitionMode ? (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${MODE_COLORS[tuitionMode] || "bg-gray-100 text-gray-700"}`}
          >
            {tuitionMode}
          </span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      <td className="px-4 py-3 text-center">
        {location || <span className="text-gray-300 text-xs">—</span>}
      </td>

      <td className="px-4 py-3 max-w-[250px]">
        <p className="line-clamp-2">{messageWithoutTags}</p>
      </td>

      <td className="px-4 py-3 text-center">
        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
          {source}
        </span>
      </td>

      <td className="px-4 py-3 text-center">
        {moment(createdAt).format("DD MMM YY")}
      </td>
      <td className="px-4 py-3 text-center">
  <div className="flex items-center justify-center gap-1">
  <button
    onClick={handleCopy}
    title="Copy lead details"
    className="hover:bg-blue-100 transition-all duration-100 rounded-lg p-2 text-blue-600"
  >
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1.1em"
      width="1.1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>
    </svg>
  </button>
  <button
    onClick={() => handleDelete(data._id)}
    className="hover:bg-red-100 transition-all duration-100 rounded-lg p-2 text-red-500"
  >
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1.1em"
      width="1.1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M17 6V4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2H3v2h1v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8h1V6h-4zM9 5h6v1H9V5zm9 14H6V8h12v11zM9 10h2v6H9zm4 0h2v6h-2z"></path>
    </svg>
  </button>
  </div>
</td>
    </tr>
  );
};

export default QueryRow;
