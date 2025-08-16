// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// // import {DonutChart} from "../../components/DonutChart"
// import { Check } from "lucide-react";

// export function Stats() {
//   return (
//     <div className="grid grid-cols-2 gap-6">
//       <Card className="rounded-2xl card">
//         <CardContent className="flex flex-col items-center justify-center h-full p-6">
//           <div className="bg-green-500 rounded-full p-2">
//             <Check className="h-6 w-6 text-white" />
//           </div>
//           <div className="text-center mt-2">
//             <p className="text-sm font-medium text-muted-foreground">
//               Total Solved
//             </p>
//             <p className="text-4xl font-bold">120</p>
//           </div>
//         </CardContent>
//       </Card>
//       <Card className="rounded-2xl card">
//         <CardContent className="flex flex-col items-center justify-center h-full p-6">
//           <CardTitle className="text-sm font-medium text-muted-foreground mb-2">
//             Daily Goals
//           </CardTitle>
//           <div className="relative h-24 w-24">
//             <svg className="h-full w-full" viewBox="0 0 100 100">
//               <circle
//                 className="stroke-current text-blue-700"
//                 strokeWidth="10"
//                 cx="50"
//                 cy="50"
//                 r="40"
//                 fill="transparent"
//               ></circle>
//               <circle
//                 className="stroke-current text-purple-500"
//                 strokeWidth="10"
//                 cx="50"
//                 cy="50"
//                 r="40"
//                 fill="transparent"
//                 strokeDasharray="251.2"
//                 strokeDashoffset={`calc(251.2 - (251.2 * 60) / 100)`}
//                 strokeLinecap="round"
//                 transform="rotate(-90 50 50)"
//               ></circle>
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <span className="text-2xl font-bold text-primary">3/5</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Check } from "lucide-react";
import DonutChart from "../../components/DonutChart";

const difficultyData = [
  { name: "Easy", value: 4, color: "#22c55e" },
  { name: "Medium", value: 3, color: "#eab308" },
  { name: "Hard", value: 1, color: "#ef4444" },
];

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="rounded-2xl card">
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <div className="bg-green-500 rounded-full p-2">
            <Check className="h-6 w-6 text-white" />
          </div>
          <div className="text-center mt-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Solved
            </p>
            <p className="text-4xl font-bold">120</p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-2xl card">
        <CardContent className="flex flex-col items-center justify-center h-full p-6">
          <DonutChart data={difficultyData} />
        </CardContent>
      </Card>
    </div>
  );
}
