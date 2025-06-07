
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, GitCommit, User, Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const mockCommits = [
  {
    id: "a1b2c3d",
    message: "Add user authentication system",
    author: "John Doe",
    date: "2024-01-15",
    branch: "main",
    x: 100,
    y: 50,
    parents: ["b2c3d4e"]
  },
  {
    id: "b2c3d4e",
    message: "Update API endpoints",
    author: "Jane Smith",
    date: "2024-01-14",
    branch: "main",
    x: 100,
    y: 120,
    parents: ["c3d4e5f"]
  },
  {
    id: "c3d4e5f",
    message: "Implement file upload feature",
    author: "Bob Wilson",
    date: "2024-01-13",
    branch: "feature/upload",
    x: 200,
    y: 190,
    parents: ["d4e5f6g"]
  },
  {
    id: "d4e5f6g",
    message: "Fix responsive design issues",
    author: "Alice Brown",
    date: "2024-01-12",
    branch: "main",
    x: 100,
    y: 260,
    parents: ["e5f6g7h"]
  },
  {
    id: "e5f6g7h",
    message: "Initial project setup",
    author: "John Doe",
    date: "2024-01-10",
    branch: "main",
    x: 100,
    y: 330,
    parents: []
  }
];

const branchColors = {
  main: "hsl(var(--primary))",
  "feature/upload": "hsl(var(--destructive))",
  develop: "hsl(var(--accent))"
};

interface CommitNodeProps {
  commit: typeof mockCommits[0];
  isSelected: boolean;
  onSelect: () => void;
}

const CommitNode: React.FC<CommitNodeProps> = ({ commit, isSelected, onSelect }) => {
  const branchColor = branchColors[commit.branch as keyof typeof branchColors] || "hsl(var(--muted))";
  
  return (
    <g className="commit-node cursor-pointer" onClick={onSelect}>
      <circle
        cx={commit.x}
        cy={commit.y}
        r="8"
        fill={branchColor}
        stroke={isSelected ? "hsl(var(--ring))" : "white"}
        strokeWidth={isSelected ? "3" : "2"}
        className="transition-all duration-200 hover:r-10"
      />
      <text
        x={commit.x + 20}
        y={commit.y + 5}
        className="text-sm fill-foreground font-medium"
      >
        {commit.message.substring(0, 40)}...
      </text>
      <text
        x={commit.x + 20}
        y={commit.y + 20}
        className="text-xs fill-muted-foreground"
      >
        {commit.id} • {commit.author}
      </text>
    </g>
  );
};

export const CommitGraph: React.FC = () => {
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const selected = mockCommits.find(c => c.id === selectedCommit);

  const renderConnections = () => {
    return mockCommits.map(commit => 
      commit.parents.map(parentId => {
        const parent = mockCommits.find(c => c.id === parentId);
        if (!parent) return null;
        
        return (
          <line
            key={`${commit.id}-${parentId}`}
            x1={commit.x}
            y1={commit.y}
            x2={parent.x}
            y2={parent.y}
            stroke="hsl(var(--border))"
            strokeWidth="2"
            className="transition-colors duration-200"
          />
        );
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Branch Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(branchColors).map(([branch, color]) => (
          <Badge key={branch} variant="outline" className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <GitBranch className="w-3 h-3" />
            {branch}
          </Badge>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Commit Graph */}
        <div className="flex-1 border rounded-lg p-4 bg-card">
          <svg width="100%" height="400" className="overflow-visible">
            {renderConnections()}
            {mockCommits.map(commit => (
              <CommitNode
                key={commit.id}
                commit={commit}
                isSelected={selectedCommit === commit.id}
                onSelect={() => setSelectedCommit(commit.id)}
              />
            ))}
          </svg>
        </div>

        {/* Commit Details Panel */}
        {selected && (
          <div className="w-80 space-y-4">
            <div className="border rounded-lg p-4 bg-card">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4" />
                  <span className="font-mono text-sm">{selected.id}</span>
                </div>
                
                <h3 className="font-semibold text-lg">{selected.message}</h3>
                
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
