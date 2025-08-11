import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Github, Trophy, Code, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">AlgoLog</span>
            </Link>

            <nav className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
                Dashboard
              </Link>
              <Link href="/problems" className="text-slate-600 hover:text-slate-900">
                Problems
              </Link>
              <Link href="/contests" className="text-slate-600 hover:text-slate-900">
                Contests
              </Link>
              <Link href="/discuss" className="text-slate-600 hover:text-slate-900">
                Discuss
              </Link>
              <Link href="/store" className="text-slate-600 hover:text-slate-900">
                Store
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="/professional-profile.png"
                  alt="Sophia Chen"
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4"
                />
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Sophia Chen</h1>
                <p className="text-slate-600 mb-4">
                  Aspiring software engineer | Passionate about algorithms and data structures | Always learning, always
                  coding
                </p>
                <Button className="w-full mb-4">Edit Profile</Button>
                <div className="flex items-center justify-center text-sm text-slate-600">
                  <Github className="w-4 h-4 mr-1" />
                  Connected to GitHub
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">250</div>
                  <div className="text-sm text-slate-600">Total Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">15</div>
                  <div className="text-sm text-slate-600">Current Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">730</div>
                  <div className="text-sm text-slate-600">Days Joined</div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm text-slate-600 mb-2">
                    Favorite Language: <span className="font-semibold">Python</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Language Breakdown</div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Python</span>
                    <span>JavaScript</span>
                    <span>Java</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Topic Mastery</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Arrays</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Trees</span>
                        <span>70%</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>DP</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Collections */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-slate-900 rounded-lg p-4 flex-shrink-0">
                    <code className="text-green-400 text-xs font-mono">
                      def binary_search(arr, target):
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;left, right = 0, len(arr) - 1<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;while left {"<="} right:
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mid = (left + right) // 2
                    </code>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Recent Activity Feed</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div>
                        Solved Binary Search in Python <span className="text-slate-400">2 hours ago</span>
                      </div>
                      <div>
                        Completed Arrays module <span className="text-slate-400">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievement Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Trophy className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-sm font-medium">7-Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium">Arrays Master</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Code className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-sm font-medium">DP Pro</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collections Showcase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Pinned Repositories</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="border border-slate-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm mb-2">Binary Search</h4>
                          <p className="text-xs text-slate-600 mb-3">Efficient search algorithm implementations.</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Python</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Easy
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-slate-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm mb-2">Sorting</h4>
                          <p className="text-xs text-slate-600 mb-3">Implementations of common sorts.</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Java</span>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Medium
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-slate-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-sm mb-2">Graph Traversal</h4>
                          <p className="text-xs text-slate-600 mb-3">BFS and DFS implementations.</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">C++</span>
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              Hard
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Recent Uploads</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Solution: Two Sum</div>
                          <div className="text-xs text-slate-600">Python | O(n)</div>
                        </div>
                        <div className="text-xs text-slate-500">2 hours ago</div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Solution: FizzBuzz</div>
                          <div className="text-xs text-slate-600">Java | O(n)</div>
                        </div>
                        <div className="text-xs text-slate-500">1 day ago</div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Solution: Palindrome</div>
                          <div className="text-xs text-slate-600">C++ | O(n)</div>
                        </div>
                        <div className="text-xs text-slate-500">2 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
