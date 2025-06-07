
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Github, GitBranch, Link, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface RepositoryUploadProps {
  onRepositoryLoaded?: (repoData: any) => void;
}

export const RepositoryUpload: React.FC<RepositoryUploadProps> = ({ onRepositoryLoaded }) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const { toast } = useToast();

  const extractRepoInfo = (url: string) => {
    // Support various GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/,
      /github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)/,
      /github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace('.git', ''),
          branch: match[3] || 'main'
        };
      }
    }
    return null;
  };

  const fetchRepositoryData = async (owner: string, repo: string) => {
    const baseUrl = 'https://api.github.com';
    
    try {
      setLoadingStatus("Fetching repository information...");
      
      // Fetch repository basic info
      const repoResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}`);
      if (!repoResponse.ok) {
        throw new Error(`Repository not found or private: ${repoResponse.status}`);
      }
      const repoInfo = await repoResponse.json();
      
      setLoadingStatus("Fetching commit history...");
      
      // Fetch commits
      const commitsResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/commits?per_page=100`);
      const commits = commitsResponse.ok ? await commitsResponse.json() : [];
      
      setLoadingStatus("Fetching repository tree...");
      
      // Fetch repository tree
      const treeResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/git/trees/${repoInfo.default_branch}?recursive=1`);
      const treeData = treeResponse.ok ? await treeResponse.json() : { tree: [] };
      
      setLoadingStatus("Fetching contributors...");
      
      // Fetch contributors
      const contributorsResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/contributors`);
      const contributors = contributorsResponse.ok ? await contributorsResponse.json() : [];
      
      setLoadingStatus("Processing data...");
      
      const repositoryData = {
        info: repoInfo,
        commits: commits,
        tree: treeData.tree,
        contributors: contributors,
        stats: {
          totalCommits: commits.length,
          totalFiles: treeData.tree?.length || 0,
          contributors: contributors.length,
          languages: repoInfo.language ? [repoInfo.language] : []
        }
      };
      
      return repositoryData;
      
    } catch (error) {
      console.error('Error fetching repository:', error);
      throw error;
    }
  };

  const handleUrlSubmit = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a repository URL",
        variant: "destructive"
      });
      return;
    }

    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setLoadingStatus("Starting...");
    
    try {
      const repositoryData = await fetchRepositoryData(repoInfo.owner, repoInfo.repo);
      
      toast({
        title: "Success!",
        description: `Repository "${repoInfo.repo}" loaded successfully`,
      });
      
      // Call the callback if provided
      if (onRepositoryLoaded) {
        onRepositoryLoaded(repositoryData);
      }
      
      console.log("Repository data loaded:", repositoryData);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch repository. Please check the URL and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setLoadingStatus("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Files uploaded:", files);
      toast({
        title: "Files uploaded",
        description: `${files.length} files selected. Processing...`,
      });
      // TODO: Implement file parsing logic
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CardTitle className="text-2xl mb-2">Add Repository</CardTitle>
          <CardDescription>
            Import your Git repository to start visualizing
          </CardDescription>
        </motion.div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Repository URL
                </label>
                <Input
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full"
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supports GitHub, GitLab, and other Git hosting services
                </p>
              </div>
              
              {isLoading && loadingStatus && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <GitBranch className="w-4 h-4" />
                  </motion.div>
                  {loadingStatus}
                </motion.div>
              )}
              
              <Button 
                onClick={handleUrlSubmit}
                disabled={!repoUrl || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <GitBranch className="w-4 h-4" />
                    </motion.div>
                    Importing Repository...
                  </>
                ) : (
                  <>
                    <GitBranch className="w-4 h-4 mr-2" />
                    Import Repository
                  </>
                )}
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload your .git folder or repository archive
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  {...({ webkitdirectory: "" } as any)}
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    Choose Files
                  </label>
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="github" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4"
            >
              <Github className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Connect with GitHub to import your repositories
              </p>
              <Button className="w-full" disabled>
                <Github className="w-4 h-4 mr-2" />
                Connect GitHub Account (Coming Soon)
              </Button>
              <p className="text-xs text-muted-foreground">
                For now, use the URL tab to import public repositories
              </p>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
