/* This JavaScript React code defines a functional component called `ConnectCard` that displays a list
of roadmaps for learning to code. Each roadmap item includes an image, title, description, and a
link to the respective website. */
import React from "react";
import { Card, CardContent } from "../../components/ui/card";

// Data array containing information for various coding roadmaps/platforms.
const roadmaps = [
  {
    image:
      "https://cdn-1.webcatalog.io/catalog/neetcode/neetcode-icon-filled-256.png?v=1714776663849",
    title: "Neetcode.io",
    description:
      "Learn to code using a curated list of questions and video solutions.",
    link: "https://neetcode.io/",
  },
  {
    image:
      "https://yt3.googleusercontent.com/ytc/AIdro_lGRc-05M2OoE1ejQdxeFhyP7OkJg9h4Y-7CK_5je3QqFI=s900-c-k-c0x00ffffff-no-rj",
    title: "FreeCodeCamp",
    description: "Learn to code for free. Build projects. Earn certifications.",
    link: "https://www.freecodecamp.org/",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_nhtk3PtrTCv5cYGivaw6tpYh-ig5SirEXfmG3hsxJlGLAsKq17GMU8c&s=10",
    title: "GeeksforGeeks",
    description:
      "It contains well written, well thought and well explained computer science and programming articles.",
    link: "https://www.geeksforgeeks.org/",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4kZ-JmOmHQUodfdVxLsbXKdg8NAT4REfogwW57ZbaMfDfDeYJLDaQkGw&s=10",
    title: "HackerRank",
    description: "Practice coding, prepare for interviews, and get hired.",
    link: "https://www.hackerrank.com/",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJtEKlEsHDl9A0jfbabX3x3k8L6Hb5kUGM1t8mrLTnD0Gj-z3f0PwUyxzW&s=10",
    title: "LeetCode",
    description:
      "The world's leading online programming learning platform. Prepare for coding interviews.",
    link: "https://leetcode.com/",
  },
  {
    image:
      "https://yt3.googleusercontent.com/ytc/AIdro_mCSBhrcmwijL2iu8fyKVJlqrYptHjYpJfLm81epG-eO4U=s900-c-k-c0x00ffffff-no-rj",
    title: "InterviewBit",
    description: "A platform to help you ace your next coding interview.",
    link: "https://www.interviewbit.com/",
  },
];

// Component to display a card of coding roadmaps.
export default function ConnectCard() {
  // Handles opening the roadmap's link in a new tab when a card is clicked.
  const handleClick = (roadmap) => {
    window.open(roadmap.link, "_blank");
  };

  return (
    <div className="w-full pb-10">
      <h2 className="text-lg font-semibold text-foreground mb-4 tracking-tight">
        Connecting Roadmaps
      </h2>
      {/* Container for the roadmap cards with horizontal scrolling. */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 pr-1 pb-1 overflow-x-auto"
        style={{ scrollbarWidth: "none" }} // Firefox-specific style to hide scrollbar.
      >
        {/* CSS to hide scrollbar for Webkit browsers (Chrome, Safari). */}
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {/* Map over the roadmaps array to render each roadmap as a clickable card. */}
        {roadmaps.map((roadmap, index) => (
          <Card
            key={index}
            className="rounded-2xl transition-all duration-200 cursor-pointer bg-card dark:bg-slate-800/45"
            onClick={() => handleClick(roadmap)}
          >
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              {/* Image container with rounded-full styling. */}
              <div className="h-16 w-16 rounded-full border-2 border-foreground/50 flex items-center justify-center overflow-hidden">
                <img
                  src={roadmap.image}
                  alt={roadmap.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Title and description of the roadmap. */}
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground">
                  {roadmap.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {roadmap.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
