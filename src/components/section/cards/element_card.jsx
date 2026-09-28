import React from "react";

const ElementCard = () => {
  return (
    <div className="hover:cursor-cell hover:opacity-30 transition-all duration-100 w-full rounded-lg p-2 bg-white shadow flex flex-col gap-3 text-center">
      <img
        src="/img/elements/elemet1.png"
        alt="elemet1"
        className="h-[108px] object-contain"
      />

      <span className="font-semibold text-[11px]">MS SHEETS | PLATES</span>
    </div>
  );
};

export default ElementCard;
