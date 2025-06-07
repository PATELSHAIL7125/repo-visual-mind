
import { CommitGraph } from "@/components/git-visualizer/CommitGraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Git Repository Visualizer
          </h1>
          <p className="text-xl text-muted-foreground">
            Interactive visualization of Git repositories and commit history
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Commit Graph</CardTitle>
            <CardDescription>
              Interactive visualization of commit history and branch relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CommitGraph />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
