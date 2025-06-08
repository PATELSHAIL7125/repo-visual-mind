
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, GitCommit, FileText, Calendar, TrendingUp, Code } from "lucide-react";

interface AnalyticsDashboardProps {
  repositoryData?: any;
}

// Mock data for demonstration
const mockCommitActivity = [
  { date: "2024-01-08", commits: 3 },
  { date: "2024-01-09", commits: 7 },
  { date: "2024-01-10", commits: 2 },
  { date: "2024-01-11", commits: 8 },
  { date: "2024-01-12", commits: 4 },
  { date: "2024-01-13", commits: 6 },
  { date: "2024-01-14", commits: 5 },
  { date: "2024-01-15", commits: 9 }
];

const mockLanguageDistribution = [
  { name: "TypeScript", value: 45, color: "#3178c6" },
  { name: "JavaScript", value: 30, color: "#f7df1e" },
  { name: "CSS", value: 15, color: "#1572b6" },
  { name: "HTML", value: 10, color: "#e34f26" }
];

const mockContributorStats = [
  { name: "John Doe", commits: 28, additions: 1240, deletions: 320 },
  { name: "Jane Smith", commits: 22, additions: 980, deletions: 180 },
  { name: "Bob Wilson", commits: 15, additions: 650, deletions: 90 },
  { name: "Alice Brown", commits: 12, additions: 420, deletions: 150 }
];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ repositoryData }) => {
  // Use real data if available, otherwise use mock data
  const stats = repositoryData?.stats || {
    totalCommits: 77,
    totalFiles: 156,
    contributors: 4,
    languages: ["TypeScript", "JavaScript", "CSS", "HTML"]
  };

  const commitActivity = repositoryData?.commitActivity || mockCommitActivity;
  const languageDistribution = repositoryData?.languageDistribution || mockLanguageDistribution;
  const contributorStats = repositoryData?.contributorStats || mockContributorStats;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCommits}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <p className="text-xs text-muted-foreground">
              Across all directories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contributors}</div>
            <p className="text-xs text-muted-foreground">
              Active developers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.languages.length}</div>
            <p className="text-xs text-muted-foreground">
              Programming languages
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commit Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Commit Activity
              </CardTitle>
              <CardDescription>Daily commit frequency over the last week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={commitActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="commits" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Language Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Language Distribution
              </CardTitle>
              <CardDescription>Codebase composition by language</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={languageDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {languageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {languageDistribution.map((lang) => (
                  <Badge key={lang.name} variant="outline" className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: lang.color }}
                    />
                    {lang.name} ({lang.value}%)
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Contributor Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Contributors
            </CardTitle>
            <CardDescription>Most active developers in the repository</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contributorStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="commits" fill="hsl(var(--primary))" name="Commits" />
                <Bar dataKey="additions" fill="hsl(var(--accent))" name="Lines Added" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
