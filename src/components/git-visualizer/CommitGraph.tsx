
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, GitCommit, User, Calendar, FileText } from "lucide-react";

interface CommitGraphProps {
  repositoryData?: any;
}

// Mock data for demonstration
const mockCommits = [
  {
    id: "a1b2c3d",
    message: "Add user authentication system",
    author: "John Doe",
    date: "2024-01-15",
    branch: "main",
    y: 50
  },
  {
    id: "b2c3d4e",
    message: "Update API endpoints",
    author: "Jane Smith",
    date: "2024-01-14",
    branch: "main",
    y: 120
  },
  {
    id: "c3d4e5f",
    message: "Implement file upload feature",
    author: "Bob Wilson",
    date: "2024-01-13",
    branch: "feature/upload",
    y: 190
  }
];

const branchColors = {
  main: "hsl(var(--primary))",
  "feature/upload": "hsl(var(--destructive))",
  develop: "hsl(var(--accent))"
};

export const CommitGraph: React.FC<CommitGraphProps> = ({ repositoryData }) => {
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  
  // Use real data if available, otherwise use mock data
  const commits = repositoryData?.commits ? repositoryData.commits.map((commit: any, index: number) => ({
    id: commit.sha?.substring(0, 7) || `commit-${index}`,
    message: commit.commit?.message || "No message",
    author: commit.commit?.author?.name || "Unknown",
    date: commit.commit?.author?.date?.substring(0, 10) || "Unknown",
    branch: "main",
    y: 80 + (index * 80)
  })).slice(0, 15) : mockCommits;
  
  const selected = commits.find((c: any) => c.id === selectedCommit);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Commit Graph
        </CardTitle>
        <CardDescription>Interactive visualization of commit history</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Branch Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <GitBranch className="w-3 h-3" />
            main
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <GitBranch className="w-3 h-3" />
            feature/upload
          </Badge>
        </div>

        <div className="flex gap-6">
          {/* Commit Timeline */}
          <div className="flex-1">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
              
              {/* Commits */}
              <div className="space-y-4">
                {commits.map((commit: any, index: number) => (
                  <motion.div
                    key={`commit-${commit.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`relative flex items-start gap-4 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 ${
                      selectedCommit === commit.id ? 'bg-accent border-primary' : 'bg-card'
                    }`}
                    onClick={() => setSelectedCommit(commit.id)}
                  >
                    {/* Commit dot */}
                    <div className="relative z-10 w-3 h-3 rounded-full bg-primary border-2 border-background mt-2"></div>
                    
                    {/* Commit info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                          {commit.id}
                        </code>
                        <span className="text-xs text-muted-foreground">by {commit.author}</span>
                      </div>
                      <p className="font-medium text-sm mb-1 leading-tight">{commit.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {commit.date}
                        <GitBranch className="w-3 h-3 ml-2" />
                        {commit.branch}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Commit Details Panel */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-80"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GitCommit className="w-5 h-5" />
                    Commit Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                        {selected.id}
                      </code>
                    </div>
                    
                    <h3 className="font-semibold">{selected.message}</h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {selected.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {selected.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        {selected.branch}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      View Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
