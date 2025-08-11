import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Search, Moon, User, Upload, Play, Flame, Calendar, Star, Clock, Tag } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">AlgoLog</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input placeholder="Search problems... (⌘K)" className="pl-10 pr-4 h-10 bg-slate-50 border-slate-200" />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Moon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="dsa" />
                  <label htmlFor="dsa" className="text-sm">
                    DSA
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="system-design" />
                  <label htmlFor="system-design" className="text-sm">
                    System Design
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="behavioral" />
                  <label htmlFor="behavioral" className="text-sm">
                    Behavioral
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Difficulty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Easy
                </Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 ml-2">
                  Medium
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800 ml-2">
                  Hard
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    Arrays (18)
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Trees (15)
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    DP (8)
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Graphs (12)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saved Collections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Favorites</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">To Review</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="text-sm text-slate-600">Current Streak</div>
                  <div className="text-2xl font-bold">3 days</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">Total Solved</div>
                  <div className="text-2xl font-bold">120</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-slate-600">Daily Goals</div>
                  <div className="text-2xl font-bold text-blue-600">3/5</div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-500 py-8">GitHub-style activity heatmap</div>
              </CardContent>
            </Card>

            {/* Code Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Code Cards</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Recent
                  </Button>
                  <Button variant="outline" size="sm">
                    All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Code Card 1 */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-blue-100 text-blue-800">LeetCode</Badge>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Easy
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Two Sum</h3>
                        <div className="bg-slate-900 rounded-lg p-3 mb-3">
                          <code className="text-green-400 text-sm font-mono">
                            class Solution:
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;def twoSum(self, nums, target):
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hash_map = {}
                          </code>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Jan 15, 2024</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>15 min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span>Arrays, Hash Table</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Code Card 2 */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-green-100 text-green-800">HackerRank</Badge>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Medium
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Reverse Linked List</h3>
                        <div className="bg-slate-900 rounded-lg p-3 mb-3">
                          <code className="text-green-400 text-sm font-mono">
                            def reverseList(head):
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;prev = None
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;curr = head
                          </code>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Jan 10, 2024</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>25 min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span>Linked List</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Code Card 3 */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-blue-100 text-blue-800">LeetCode</Badge>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Hard
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Binary Tree Inorder</h3>
                        <div className="bg-slate-900 rounded-lg p-3 mb-3">
                          <code className="text-green-400 text-sm font-mono">
                            def inorderTraversal(root):
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;res = []
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;if root:
                          </code>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Jan 5, 2024</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>45 min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span>Binary Tree, DFS</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Code
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
