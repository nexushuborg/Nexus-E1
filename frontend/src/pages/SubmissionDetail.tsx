import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { submissions } from "@/data/mock";
import { CodeBlock } from "@/components/CodeBlock";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function SubmissionDetail() {
  const { id } = useParams();
  const sub = submissions.find(s => s.id === id);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (sub) {
      const raw = localStorage.getItem(`notes-${sub.id}`);
      if (raw) setNotes(raw);
    }
  }, [sub?.id]);

  if (!sub) {
    return (
      <main className="container py-12">
        <h1 className="text-2xl font-semibold">Submission not found</h1>
      </main>
    );
  }

  const save = () => {
    localStorage.setItem(`notes-${sub.id}`, notes);
  };

  return (
    <main className="container py-8">
      <Helmet>
        <title>{sub.title} – Submission</title>
        <meta name="description" content={`Details and summary for ${sub.title}.`} />
        <link rel="canonical" href={`/submissions/${sub.id}`} />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-semibold mb-1">{sub.title}</h1>
        <div className="text-sm text-muted-foreground">{sub.platform} • {sub.difficulty} • {new Date(sub.date).toLocaleDateString()}</div>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <article className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="font-semibold mb-2">Question</h2>
          <p className="text-sm text-muted-foreground">{sub.description}</p>
          {sub.examples?.length ? (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Examples</h3>
              <ul className="space-y-3 text-sm">
                {sub.examples.map((ex, i) => (
                  <li key={i} className="rounded-md border bg-background p-3">
                    <div><span className="font-medium">Input:</span> {ex.input}</div>
                    <div><span className="font-medium">Output:</span> {ex.output}</div>
                    {ex.explanation && <div><span className="font-medium">Explanation:</span> {ex.explanation}</div>}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {sub.constraints?.length ? (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Constraints</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {sub.constraints.map((c, i) => (<li key={i}>{c}</li>))}
              </ul>
            </div>
          ) : null}
        </article>
        <article className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="font-semibold mb-2">AI Summary</h2>
          <p className="text-sm text-muted-foreground">{sub.summary}</p>
        </article>
      </section>

      <section className="mt-6 rounded-xl border bg-card p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Your Code ({sub.language})</h2>
        <CodeBlock code={sub.code} language={sub.language} />
      </section>

      <section className="mt-6 rounded-xl border bg-card p-4 shadow-sm">
        <h2 className="font-semibold mb-2">Personal Notes</h2>
        <textarea className="w-full min-h-32 rounded-md border bg-background p-3 text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write notes for future revision..." />
        <div className="mt-3"><Button variant="success" onClick={save}>Save Notes</Button></div>
      </section>
    </main>
  );
}
