"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ServiceActivityPoint } from "@/features/dashboard/data/dashboard-kpi-data";

function getPeakIndex(data: ServiceActivityPoint[]) {
  if (data.length === 0) return -1;

  return data.reduce(
    (best, item, index) => (item.requests > data[best].requests ? index : best),
    0,
  );
}

export function ServiceActivityChart({ data }: { data: ServiceActivityPoint[] }) {
  const peakIndex = getPeakIndex(data);

  function CustomTick({
    x,
    y,
    payload,
    index,
  }: {
    x?: number;
    y?: number;
    payload?: { value: string };
    index?: number;
  }) {
    const isPeak = index === peakIndex && data[peakIndex]?.requests > 0;

    return (
      <text
        x={x}
        y={(y ?? 0) + 12}
        textAnchor="middle"
        fontSize={13}
        fill={isPeak ? "#145d66" : "#94a3b8"}
        fontWeight={isPeak ? 700 : 400}
      >
        {payload?.value}
      </text>
    );
  }

  function PeakLabel({
    x,
    y,
    width,
    value,
    index,
  }: {
    x?: number;
    y?: number;
    width?: number;
    value?: number;
    index?: number;
  }) {
    if (index !== peakIndex || !value) return null;

    const cx = (x ?? 0) + (width ?? 0) / 2;
    const badgeWidth = 44;

    return (
      <g>
        <rect
          x={cx - badgeWidth / 2}
          y={(y ?? 0) - 30}
          width={badgeWidth}
          height={20}
          rx={10}
          fill="#145d66"
        />
        <text
          x={cx}
          y={(y ?? 0) - 16}
          textAnchor="middle"
          fontSize={11}
          fontWeight={700}
          fill="white"
        >
          {value}
        </text>
      </g>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} barSize={30} margin={{ top: 36, right: 10, left: 10, bottom: 0 }}>
        <YAxis domain={[0, "dataMax"]} hide />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={CustomTick as never}
        />
        <Tooltip
          cursor={{ fill: "rgba(20,93,102,0.06)", radius: 8 } as object}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg">
                {payload[0].value} requests
              </div>
            );
          }}
        />
        <Bar dataKey="requests" radius={[14, 14, 14, 14]}>
          {data.map((_, index) => (
            <Cell key={index} fill={index === peakIndex ? "#145d66" : "#1e293b"} />
          ))}
          <LabelList dataKey="requests" content={PeakLabel as never} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
