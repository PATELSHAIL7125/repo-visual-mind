
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CommitGraph } from "@/components/git-visualizer/CommitGraph";
import { FileTreeExplorer } from "@/components/git-visualizer/FileTreeExplorer";
import { RepositoryUpload } from "@/components/git-visualizer/RepositoryUpload";
import { AnalyticsDashboard } from "@/components/git-visualizer/AnalyticsDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GitBranch, FileText, BarChart, Upload, Github, Sparkles } from "lucide-react";

const Index = () => {
  const [hasRepository, setHasRepository] = useState(false);
  const [repositoryData, setRepositoryData] = useState<any>(null);

  const handleRepositoryImport = () => {
    // TODO: Implement actual repository import logic
    setHasRepository(true);
  };

  const handleRepositoryLoaded = (repoData: any) => {
    console.log("Repository loaded in Index:", repoData);
    setRepositoryData(repoData);
    setHasRepository(true);
  };

  if (!hasRepository) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                Git Visualizer Pro
              </h1>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-accent" />
              </motion.div>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transform your Git repositories into beautiful, interactive visualizations. 
              Understand your codebase like never before with advanced analytics and stunning visual representations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary"
              >
                <GitBranch className="w-4 h-4" />
                <span className="text-sm font-medium">Interactive Commit Graphs</span>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent-foreground"
              >
                <BarChart className="w-4 h-4" />
                <span className="text-sm font-medium">Advanced Analytics</span>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Smart File Explorer</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Repository Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <RepositoryUpload onRepositoryLoaded={handleRepositoryLoaded} />
          </motion.div>

          {/* Demo Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Button 
              size="lg" 
              onClick={handleRepositoryImport}
              className="px-8 py-4 text-lg font-medium"
            >
              <Github className="w-5 h-5 mr-2" />
              Try Demo Repository
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Explore with sample data to see the full potential
            </p>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="text-center p-6">
              <GitBranch className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Visual Commit History</h3>
              <p className="text-muted-foreground">
                Interactive timeline with branch relationships and merge patterns
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <BarChart className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-semibold mb-2">Developer Analytics</h3>
              <p className="text-muted-foreground">
                Track productivity, code ownership, and collaboration patterns
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <FileText className="w-12 h-12 mx-auto mb-4 text-secondary-foreground" />
              <h3 className="text-xl font-semibold mb-2">Smart File Browser</h3>
              <p className="text-muted-foreground">
                Explore repository structure with intelligent file insights
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const repoName = repositoryData?.info?.name || "sample-repository";
  const repoDescription = repositoryData?.info?.description || "Imported repository";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Repository Analysis
              </h1>
              <p className="text-muted-foreground">{repoName}</p>
              {repositoryData?.info?.description && (
                <p className="text-sm text-muted-foreground">{repositoryData.info.description}</p>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={() => setHasRepository(false)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import New Repository
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="commits" className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Commits
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Files
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 xl:grid-cols-3 gap-6"
                >
                  <div className="xl:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Commit Graph</CardTitle>
                        <CardDescription>Interactive visualization of commit history</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CommitGraph repositoryData={repositoryData} />
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <FileTreeExplorer repositoryData={repositoryData} />
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="commits">
                <motion.div
                  key="commits"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Commit History</CardTitle>
                      <CardDescription>Comprehensive view of all repository commits</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CommitGraph repositoryData={repositoryData} />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="files">
                <motion.div
                  key="files"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FileTreeExplorer repositoryData={repositoryData} />
                </motion.div>
              </TabsContent>

              <TabsContent value="analytics">
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnalyticsDashboard repositoryData={repositoryData} />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
