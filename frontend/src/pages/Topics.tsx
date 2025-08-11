import { Helmet } from "react-helmet-async";
import { topics, flashcards } from "@/data/mock";
import { useMemo, useState } from "react";
import { FlashcardModal } from "@/components/FlashcardModal";
import { Input } from "@/components/ui/input";

export default function Topics() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredTopics = useMemo(() => topics.filter(t => t.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <main className="container py-8">
      <Helmet>
        <title>Topics for Revision – DSA Tracker</title>
        <meta name="description" content="Study DSA topics with interactive flashcards." />
        <link rel="canonical" href="/topics" />
      </Helmet>

      <h1 className="text-3xl font-semibold mb-6">Topics for Revision</h1>

      <div className="mb-4">
        <Input placeholder="Search topics…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {filteredTopics.map((t) => (
          <button key={t} onClick={() => onOpen(t)} className="rounded-xl border bg-card p-6 text-left shadow-sm hover-scale">
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-muted-foreground">Click to practice</div>
          </button>
        ))}
      </div>

      <FlashcardModal
        open={open}
        onOpenChange={setOpen}
        topic={active ?? ''}
        cards={active ? flashcards[active] ?? [{question: 'No cards yet', answer: 'Coming soon'}] : []}
      />
    </main>
  );
}
