import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FlashcardModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  topic: string;
  cards: { question: string; answer: string }[];
}

export function FlashcardModal({ open, onOpenChange, topic, cards }: FlashcardModalProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { if (!open) { setIndex(0); setFlipped(false);} }, [open]);

  const count = cards?.length ?? 0;
  const current = useMemo(() => (count > 0 ? cards[index % count] : undefined), [cards, index, count]);

  const next = () => {
    if (count === 0) return;
    setFlipped(false);
    setIndex((i) => (i + 1) % count);
  };
  const prev = () => {
    if (count === 0) return;
    setFlipped(false);
    setIndex((i) => (i - 1 + count) % count);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{topic} – Flashcards</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="[perspective:1000px]">
            <div
              className={`relative h-48 w-full rounded-lg border bg-card text-card-foreground shadow-sm transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
              onClick={() => count > 0 && setFlipped((f) => !f)}
              // {/* Press enter or space to flip*/}
              onKeyDown={(e) =>
                e.key === "Enter" || e.key === " "
                  ? setFlipped((f) => !f)
                  : null
              }
              tabIndex={0}
              role="button"
              aria-label="Flip card"
            >
              {current ? (
                <>
                  <div className="absolute inset-0 p-4 grid place-items-center backface-hidden">{current.question}</div>
                  <div className="absolute inset-0 p-4 grid place-items-center [transform:rotateY(180deg)] backface-hidden">{current.answer}</div>
                </>
              ) : (
                <div className="absolute inset-0 p-4 grid place-items-center text-muted-foreground">No flashcards available</div>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="secondary" onClick={prev} disabled={count === 0}>Previous</Button>
            <div className="text-sm text-muted-foreground">{count === 0 ? 0 : index + 1} / {count}</div>
            <Button variant="hero" onClick={next} disabled={count === 0}>Next</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
