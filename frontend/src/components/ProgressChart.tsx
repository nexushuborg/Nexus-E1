import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props { data: { day: string; solved: number }[] }

export default function ProgressChart({ data }: Props) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`hsl(var(--primary))`} stopOpacity={0.7}/>
              <stop offset="95%" stopColor={`hsl(var(--primary))`} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="day" hide/>
          <YAxis allowDecimals={false} width={28}/>
          <Tooltip labelClassName="text-xs" contentStyle={{ borderRadius: 8 }} />
          <Area type="monotone" dataKey="solved" stroke={`hsl(var(--primary))`} fillOpacity={1} fill="url(#colorPrimary)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
