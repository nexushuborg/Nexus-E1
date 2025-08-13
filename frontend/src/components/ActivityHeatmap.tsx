import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActivityHeatmapProps {
  data: { date: string; count: number }[]; // last 365 days
}

const levels = [0, 1, 3, 5, 8];

function getLevel(count: number) {
  if (count <= levels[0]) return 0;
  if (count <= levels[1]) return 1;
  if (count <= levels[2]) return 2;
  if (count <= levels[3]) return 3;
  return 4;
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Ensure a map for quick lookup by yyyy-mm-dd
  const byDate = new Map<string, number>();
  data.forEach(d => byDate.set(d.date.slice(0,10), d.count));

  // Build 53 weeks x 7 days ending today (inclusive)
  const end = new Date();
  end.setHours(0,0,0,0);
  const start = new Date(end);
  start.setDate(end.getDate() - 364);

  const days: { date: string; count: number }[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = d.toISOString().slice(0,10);
    days.push({ date: iso, count: byDate.get(iso) ?? 0 });
  }

  // Group into columns (weeks)
  const weeks: typeof days[] = [];
  let week: typeof days = [];
  const startDay = start.getDay();
  // pad first week with empty cells before start
  for (let i = 0; i < startDay; i++) week.push({ date: `pad-${i}`, count: -1 });
  days.forEach((day, idx) => {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  });
  if (week.length) { while (week.length < 7) week.push({ date: `pad-${week.length}`, count: -1 }); weeks.push(week); }

  const levelToBg = [
    "bg-muted", // 0
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/60",
    "bg-primary", // 4
  ];

  return (
    <TooltipProvider>
      <div className="flex gap-1 overflow-x-auto py-2">
        {weeks.map((w, wi) => (
          <div key={wi} className="grid grid-rows-7 gap-1">
            {w.map((cell, di) => {
              if (cell.count < 0) return <div key={di} className="h-3 w-3 rounded-sm bg-transparent" />;
              const lvl = getLevel(cell.count);
              const title = `${cell.count} submissions on ${new Date(cell.date).toLocaleDateString()}`;
              return (
                <Tooltip key={di}>
                  <TooltipTrigger asChild>
                    <div
                      aria-label={title}
                      className={`h-3 w-3 rounded-sm ${levelToBg[lvl]} border border-border/40`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{title}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
