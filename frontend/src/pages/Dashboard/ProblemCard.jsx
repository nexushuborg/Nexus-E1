import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
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
};
export function ProblemCard({ problem }) {
  const navigate = useNavigate();
  const handleRedirect = (e) => {
    e.stopPropagation();
    navigate(`/CodePage/${problem.id}`);
  };
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 rounded-2xl shadow-sm card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span
            className={`font-semibold ${sourceColors[problem.source || ""]}`}
          >
            {problem.source}
          </span>
          <div className="flex items-center gap-1">
            <Badge
              variant="outline"
              className={`${
                difficultyColors[problem.difficulty]
              } border-none rounded-md px-2 font-semibold`}
            >
              {problem.difficulty}
            </Badge>
            <ArrowRight
              onClick={handleRedirect}
              className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
              title={`Go to /CodePage/${problem.id}`}
              aria-label={`Redirect to problem code page ${problem.id}`}
            />
          </div>
        </div>
        <CardTitle className="text-lg font-semibold font-headline pt-2">
          {problem.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="bg-gray-800 text-white p-4 rounded-lg h-40 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <pre className="font-code text-sm whitespace-pre-wrap break-all">
            <code>{problem.codeSnippet}</code>
          </pre>
        </div>
      </CardContent>
      <CardFooter className="flex text-xs text-muted-foreground -mt-2">
        <div className="flex-1 flex items-center justify-center gap-1.5">
          <Calendar className="h-4 w-4 mt-0.5" />
          <div className="text-center">
            <div>{format(parseISO(problem.date), "MMM d,")}</div>
            <div>{format(parseISO(problem.date), "yyyy")}</div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5">
          {problem.time && (
            <>
              <Clock className="h-4 w-4" />
              <span>{problem.time} min</span>
            </>
          )}
        </div>
        <div className="flex-1 flex flex-col items-end gap-1">
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
      </CardFooter>
    </Card>
  );
}
