
import React from "react";
import { motion } from "framer-motion";
import { Users, GitCommit, Calendar, TrendingUp, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockAnalytics = {
  totalCommits: 342,
  totalContributors: 8,
  activeThisWeek: 12,
  linesOfCode: 15420,
  topContributors: [
    { name: "John Doe", commits: 89, avatar: "JD" },
    { name: "Jane Smith", commits: 67, avatar: "JS" },
    { name: "Bob Wilson", commits: 45, avatar: "BW" },
    { name: "Alice Brown", commits: 38, avatar: "AB" }
  ],
  recentActivity: [
    { type: "commit", message: "Add user authentication", time: "2 hours ago", author: "John Doe" },
    { type: "merge", message: "Merge feature/upload branch", time: "4 hours ago", author: "Jane Smith" },
    { type: "commit", message: "Fix responsive design", time: "6 hours ago", author: "Bob Wilson" }
  ],
  languageBreakdown: [
    { name: "TypeScript", percentage: 65, color: "bg-blue-500" },
    { name: "CSS", percentage: 20, color: "bg-purple-500" },
    { name: "HTML", percentage: 10, color: "bg-orange-500" },
    { name: "JSON", percentage: 5, color: "bg-green-500" }
  ]
};

export const AnalyticsDashboard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
              <GitCommit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.totalCommits}</div>
              <p className="text-xs text-muted-foreground">
                +12 from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contributors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.totalContributors}</div>
              <p className="text-xs text-muted-foreground">
                +2 this month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.activeThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                commits this week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lines of Code</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.linesOfCode.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +1,234 this week
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Contributors */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>Most active developers in this repository</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAnalytics.topContributors.map((contributor, index) => (
                <motion.div
                  key={contributor.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {contributor.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{contributor.name}</p>
                    <p className="text-xs text-muted-foreground">{contributor.commits} commits</p>
                  </div>
                  <Badge variant="secondary">{contributor.commits}</Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Language Breakdown */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Language Breakdown</CardTitle>
              <CardDescription>Code composition by programming language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAnalytics.languageBreakdown.map((language, index) => (
                <motion.div
                  key={language.name}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span>{language.name}</span>
                    <span>{language.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${language.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${language.percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes in the repository</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    {activity.type === "commit" ? (
                      <GitCommit className="w-4 h-4" />
                    ) : (
                      <GitCommit className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
