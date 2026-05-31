"use client";

import { Toaster } from "sileo";

export function SileoProvider() {
  return (
    <Toaster
      position="top-right"
      offset={{ top: 18, right: 18 }}
      options={{
        fill: "#11120f",
        roundness: 14,
        styles: {
          title: "text-stone-100!",
          description: "text-stone-400!",
          badge: "bg-[#86d0d8]/12!",
          button: "bg-[#86d0d8]/12! hover:bg-[#86d0d8]/18!",
        },
      }}
    />
  );
}
