import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { problems } from "../../lib/data";
import { cn } from "../../lib/utils";

export function Tags({ selectedTags = [], onTagChange = () => {} }) {
  const allTags = useMemo(() => {
    const tagCount = {};
    problems.forEach((problem) => {
      problem.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([name, count]) => ({ name, count }));
  }, []);
  return (
    <Card className="rounded-2xl card">
      <CardHeader className="py-5">
        <CardTitle className="text-base">Tags</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pb-5">
        {allTags.slice(0, 5).map((tag) => {
          const isSelected = (selectedTags || []).includes(tag.name);
          return (
            <Badge
              key={tag.name}
              variant="secondary"
              onClick={() => onTagChange(tag.name)}
              className={cn(
                "cursor-pointer border-primary transition-colors duration-200",
                !isSelected
                  ? "bg-transparent hover:bg-red-400 hover:text-white hover:border-red-400"
                  : "bg-red-400 text-white border-red-500"
              )}
            >
              {tag.name} ({tag.count})
            </Badge>
          );
        })}
      </CardContent>
    </Card>
  );
}
