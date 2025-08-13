import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Star, FolderClock } from "lucide-react";

export function SavedCollections() {
  return (
    <Card className="rounded-2xl shadow-lg card">
      <CardHeader className="py-5">
        <CardTitle className="text-base">Saved Collections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-5">
        <div className="flex items-center gap-2 cursor-pointer text-sm">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>Favorites</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer text-sm">
          <FolderClock className="h-4 w-4 text-blue-500" />
          <span>To Review</span>
        </div>
      </CardContent>
    </Card>
  );
}
