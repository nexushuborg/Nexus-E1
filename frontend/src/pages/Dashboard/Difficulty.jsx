import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

const difficulties = ["Easy", "Medium", "Hard"];

export function Difficulty({
  selectedDifficulties = [],
  onDifficultyChange = () => {},
}) {
  return (
    <Card className="rounded-2xl card">
      <CardHeader className="py-5">
        <CardTitle className="text-base">Difficulty</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 pb-5">
        {difficulties.map((difficulty) => {
          const isSelected = (selectedDifficulties || []).includes(difficulty);
          const baseClasses =
            "font-semibold rounded-lg text-xs px-3 hover:cursor-pointer";
          const variants = {
            Easy: isSelected
              ? "bg-green-700 text-white hover:bg-green-600"
              : "bg-green-200 text-green-800 hover:bg-green-300",
            Medium: isSelected
              ? "bg-yellow-600 text-white hover:bg-yellow-500"
              : "bg-yellow-200 text-yellow-800 hover:bg-yellow-300",
            Hard: isSelected
              ? "bg-red-700 text-white hover:bg-red-600"
              : "bg-red-200 text-red-800 hover:bg-red-300",
          };
          return (
            <Button
              key={difficulty}
              size="sm"
              onClick={() => onDifficultyChange(difficulty)}
              className={cn(baseClasses, variants[difficulty])}
            >
              {difficulty}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
