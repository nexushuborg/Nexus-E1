import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { submissions, last30Days, lastYearActivity } from "@/data/mock";
import ProgressChart from "@/components/ProgressChart";
import DonutChart from "@/components/DonutChart";
import TopicBarChart from "@/components/TopicBarChart";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import { Link } from "react-router-dom";
import { useMemo } from "react";


export default function Dashboard() {
  const { user } = useAuth();
  const total = submissions.length;
  const easy = submissions.filter(s => s.difficulty === 'Easy').length;
  const medium = submissions.filter(s => s.difficulty === 'Medium').length;
  const hard = submissions.filter(s => s.difficulty === 'Hard').length;
  const recent = [...submissions].sort((a,b) => +new Date(b.date) - +new Date(a.date)).slice(0,5);

  const topicCounts = useMemo(() => {
    const map = new Map<string, number>();
    submissions.forEach(s => s.tags.forEach(t => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map, ([name, count]) => ({ name, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 10);
  }, []);

  const donutData = useMemo(() => ([
    { name: 'Easy', value: easy, colorVar: '--secondary' },
    { name: 'Medium', value: medium, colorVar: '--primary' },
    { name: 'Hard', value: hard, colorVar: '--destructive' },
  ]), [easy, medium, hard]);

  const streaks = useMemo(() => {
    let current = 0, longest = 0, running = 0, total = 0;
    // Iterate from end (today backwards)
    const days = [...lastYearActivity].sort((a,b) => a.date.localeCompare(b.date));
    for (const d of days) total += d.count;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) { running++; current = running; }
      else { if (running > longest) longest = running; running = 0; }
    }
    if (running > longest) longest = running;
    return { currentStreak: current, longestStreak: longest, totalYear: total };
  }, []);

  return (
    <main className="container py-8">
      <Helmet>
        <title>Dashboard – DSA Tracker</title>
        <meta name="description" content="Overview of your DSA progress, recent submissions, and stats." />
        <link rel="canonical" href="/dashboard" />
      </Helmet>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Welcome back{user?.user_metadata?.user_name ? `, ${user.user_metadata.user_name}` : ''}!</h1>
        <p className="text-muted-foreground">Here’s a quick look at your progress.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Total Solved</div>
          <div className="text-3xl font-bold">{total}</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Easy</div>
          <div className="text-3xl font-bold">{easy}</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Medium</div>
          <div className="text-3xl font-bold">{medium}</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Hard</div>
          <div className="text-3xl font-bold">{hard}</div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Recent Submissions</h2>
          <ul className="divide-y">
            {recent.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link to={`/submissions/${s.id}`} className="story-link font-medium">{s.title}</Link>
                  <div className="text-xs text-muted-foreground">{s.platform} • {s.difficulty} • {new Date(s.date).toLocaleDateString()}</div>
                </div>
                <Link to={`/submissions/${s.id}`} className="text-sm text-primary">View</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Last 30 Days</h2>
          <ProgressChart data={last30Days} />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Problem Distribution</h2>
          <DonutChart data={donutData} />
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Top Topics</h2>
          <TopicBarChart data={topicCounts} />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4 mt-8">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Current Streak</div>
          <div className="text-3xl font-bold">{streaks.currentStreak} days</div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Longest Streak</div>
          <div className="text-3xl font-bold">{streaks.longestStreak} days</div>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-4 shadow-sm mt-8">
        <h2 className="font-semibold mb-2">DSA Activity (Last Year)</h2>
        <ActivityHeatmap data={lastYearActivity} />
        <p className="mt-2 text-sm text-muted-foreground">Total of {streaks.totalYear} submissions in the last year.</p>
      </section>
    </main>
  );
}
