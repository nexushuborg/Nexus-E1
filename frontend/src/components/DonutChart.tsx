// import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// interface DonutChartProps {
//   data: { name: string; value: number; colorVar?: string }[];
// }

// export default function DonutChart({ data }: DonutChartProps) {
//   const total = data.reduce((s, d) => s + d.value, 0);
//   return (
//     <div className="w-full h-64">
//       <ResponsiveContainer>
//         <PieChart>
//           <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={`hsl(var(${entry.colorVar || "--primary"}))`} />
//             ))}
//           </Pie>
//           <Tooltip formatter={(v: any, name: any) => [`${v} (${Math.round(((v as number)/Math.max(1,total))*100)}%)`, name]} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
}

const isTouchDevice =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export default function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeData =
    activeIndex !== null
      ? data[activeIndex]
      : { name: "Total Solved", value: total };

  const handleClick = (index: number) => {
    if (isTouchDevice) {
      setActiveIndex(activeIndex === index ? null : index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!isTouchDevice) {
      setActiveIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setActiveIndex(null);
    }
  };

  return (
    <div className="relative w-40 h-40">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={65}
            paddingAngle={3}
            onMouseLeave={handleMouseLeave}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => handleClick(index)}
                cursor="pointer"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-sm font-semibold">{activeData.name}</span>
        <span className="text-xs text-muted-foreground">
          {activeData.value}
        </span>
      </div>
    </div>
  );
}
