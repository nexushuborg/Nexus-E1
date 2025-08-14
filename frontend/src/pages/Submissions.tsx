import { Helmet } from "react-helmet-async";
import { submissions, type Submission } from "@/data/mock";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


export default function Submissions() {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach(s => s.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchQ = s.title.toLowerCase().includes(query.toLowerCase());
      const matchD = difficulty === "All" ? true : s.difficulty === (difficulty as any);
      const matchTags = selectedTags.length === 0 ? true : selectedTags.some(t => s.tags.includes(t));
      return matchQ && matchD && matchTags;
    });
  }, [query, difficulty, selectedTags]);


  return (
    <main className="container py-8">
      <Helmet>
        <title>All Submissions – DSA Tracker</title>
        <meta name="description" content="Browse and filter all your coding submissions and solutions." />
        <link rel="canonical" href="/submissions" />
      </Helmet>

      <h1 className="text-3xl font-semibold mb-6">All Submissions</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input placeholder="Search by title…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Difficulty"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-56 justify-between">
              Filter by Tags {selectedTags.length > 0 && <span className="ml-2 text-xs text-muted-foreground">({selectedTags.length} selected)</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
            {allTags.map(tag => {
              const checked = selectedTags.includes(tag);
              return (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={checked}
                  onCheckedChange={(v) => {
                    setSelectedTags(prev => v ? [...prev, tag] : prev.filter(t => t !== tag));
                  }}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((s: Submission) => (
          <article key={s.id} className="rounded-xl border bg-card p-4 shadow-sm hover-scale">
            <h2 className="font-semibold text-lg"><Link className="story-link" to={`/submissions/${s.id}`}>{s.title}</Link></h2>
            <div className="text-xs text-muted-foreground mb-2">{s.platform} • {s.difficulty} • {new Date(s.date).toLocaleDateString()}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">{s.summary}</div>
            <div className="mt-3 text-xs text-muted-foreground">Tags: {s.tags.join(', ')}</div>
          </article>
        ))}
      </div>
    </main>
  );
}
