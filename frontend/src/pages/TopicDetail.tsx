import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTopicById, type RevisionTopic, type RevisionStatus } from "@/data/revisionTopics";
import { submissions } from "@/data/mock";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Clock, Target, BookOpen } from "lucide-react";

// Mock API function for topic details
const fetchTopicDetail = async (id: string): Promise<RevisionTopic | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getTopicById(id) || null;
};

export default function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: topic, isLoading, error } = useQuery({
    queryKey: ['topic-detail', id],
    queryFn: () => fetchTopicDetail(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading topic...</div>
        </div>
      </main>
    );
  }

  if (error || !topic) {
    return (
      <main className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg text-destructive mb-4">Topic not found</div>
            <Button onClick={() => navigate('/topics')}>Back to Topics</Button>
          </div>
        </div>
      </main>
    );
  }

  // Get related submissions
  const relatedSubmissions = submissions.filter(sub => 
    topic.relatedSubmissionIds.includes(sub.id)
  );

  const handleStatusChange = (newStatus: RevisionStatus) => {
    console.log(`Topic ${topic.id} status changed to: ${newStatus}`);
    // In real app, this would update the API
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <main className="container py-8">
      <Helmet>
        <title>{topic.name} – Topic Detail</title>
        <meta name="description" content={`Details for ${topic.name} revision topic.`} />
      </Helmet>

      {/* Header */}
      <header className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/topics')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topics
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">
              {topic.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {topic.description}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={getDifficultyColor(topic.difficulty)}>
              {topic.difficulty}
            </Badge>
            <Select value={topic.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Topic Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Topic Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Estimated Time:</span>
                  <span className="font-medium">{topic.estimatedTime} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="outline">{topic.status}</Badge>
                </div>
              </div>
              
              {topic.lastReviewed && (
                <div className="pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Last reviewed: {formatDistanceToNow(new Date(topic.lastReviewed), { addSuffix: true })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Related Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {relatedSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {relatedSubmissions.map((sub) => (
                    <div 
                      key={sub.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 hover:bg-muted cursor-pointer"
                      onClick={() => navigate(`/submissions/${sub.id}`)}
                    >
                      <div>
                        <div className="font-medium">{sub.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {sub.platform} • {sub.difficulty}
                        </div>
                      </div>
                      <Badge variant="outline">{sub.language}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No related submissions yet</p>
                  <p className="text-sm">Solve problems related to this topic to see them here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Mark as Reviewed
              </Button>
              <Button className="w-full" variant="outline">
                Start Practice Session
              </Button>
              <Button className="w-full" variant="outline">
                View Resources
              </Button>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Completion</span>
                  <span className="text-sm font-medium">
                    {topic.status === 'Completed' ? '100%' : 
                     topic.status === 'In Progress' ? '50%' : '0%'}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: topic.status === 'Completed' ? '100%' : 
                              topic.status === 'In Progress' ? '50%' : '0%' 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
