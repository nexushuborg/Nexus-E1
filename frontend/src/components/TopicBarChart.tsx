import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TopicBarChartProps {
  data: { name: string; count: number }[];
}

export default function TopicBarChart({ data }: TopicBarChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={50} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
