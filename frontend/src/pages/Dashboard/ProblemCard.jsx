import { Badge } from "../../components/ui/badge";
import { Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const difficultyColors = {
  Easy: "bg-green-600 text-green-100",
  Medium: "bg-yellow-600 text-yellow-100",
  Hard: "bg-red-600 text-red-100",
};

const sourceColors = {
  LeetCode: "text-blue-500",
  HackerRank: "text-green-500",
  Other: "text-purple-500",
};

export function ProblemCard({ problem }) {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/submissions/${problem.id}`);
  };

  return (
    <div
      className="
        flex flex-col gap-3 
        sm:flex-row sm:items-center sm:justify-between
        px-4 py-3 border border-gray-300 dark:border-gray-700 
        rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 
        transition cursor-pointer
      "
      onClick={handleRedirect}
    >
      {/* Title + Source */}
      <div className="flex flex-col flex-1 min-w-[150px]">
        {/* Mobile: Title + Difficulty inline */}
        <div className="flex items-center justify-between sm:justify-start">
          <span className="font-medium text-sm text-foreground">
            {problem.title}
          </span>

          {/* Difficulty badge only visible on mobile (right of title) */}
          <div className="sm:hidden">
            <Badge
              variant="outline"
              className={`${
                difficultyColors[problem.difficulty]
              } border-none rounded-md px-2 font-semibold`}
            >
              {problem.difficulty}
            </Badge>
          </div>
        </div>

        {/* Source text */}
        <span
          className={`text-xs font-semibold ${
            sourceColors[problem.source] || ""
          }`}
        >
          {problem.source}
        </span>
      </div>

      {/* Difficulty badge for desktop (centered) */}
      <div className="hidden sm:flex sm:flex-1 justify-center">
        <Badge
          variant="outline"
          className={`${
            difficultyColors[problem.difficulty]
          } border-none rounded-md px-2 font-semibold`}
        >
          {problem.difficulty}
        </Badge>
      </div>

      {/* Date */}
      <div className="sm:flex-1 text-xs text-muted-foreground text-left sm:text-center">
        <div>{format(parseISO(problem.date), "MMM d, yyyy")}</div>
      </div>

      {/* Time */}
      <div className="sm:flex-1 text-xs text-muted-foreground text-left sm:text-center">
        {problem.time ? (
          <span className="flex items-center gap-1 sm:justify-center">
            <Clock className="h-3 w-3" /> {problem.time} min
          </span>
        ) : (
          "-"
        )}
      </div>

      {/* Tags (right aligned on desktop, normal on mobile) */}
      <div className="sm:flex-1 flex gap-1 justify-start sm:justify-end flex-wrap">
        {problem.tags.slice(0, 2).map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="rounded-md text-[0.65rem]"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
