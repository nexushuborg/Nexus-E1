import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DonutChartProps {
  data: { name: string; value: number; colorVar?: string }[];
}

export default function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`hsl(var(${entry.colorVar || "--primary"}))`} />
            ))}
          </Pie>
          <Tooltip formatter={(v: any, name: any) => [`${v} (${Math.round(((v as number)/Math.max(1,total))*100)}%)`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
