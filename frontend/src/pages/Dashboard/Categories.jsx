import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
const categories = ["DSA", "System Design", "Behavioral"];
export function Categories({ selectedCategories, onCategoryChange }) {
  return (
    <Card className="rounded-2xl shadow-lg card">
      <CardHeader className="py-5">
        <CardTitle className="text-base">Categories</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pb-5">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={cn(
              "font-normal rounded-lg hover:cursor-pointer hover:bg-",
              selectedCategories.includes(category) &&
                "bg-primary/20 ring-1 ring-primary text-primary"
            )}
          >
            {category}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
