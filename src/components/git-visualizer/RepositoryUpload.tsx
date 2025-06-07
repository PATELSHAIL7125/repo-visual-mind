
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Github, GitBranch, Link, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const RepositoryUpload: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlSubmit = async () => {
    setIsLoading(true);
    // TODO: Implement repository fetching logic
    console.log("Fetching repository:", repoUrl);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Files uploaded:", files);
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
                  placeholder="https://github.com/username/repository.git"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Button 
                onClick={handleUrlSubmit}
                disabled={!repoUrl || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <GitBranch className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <GitBranch className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Fetching Repository..." : "Import Repository"}
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
                  webkitdirectory=""
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
              <Button className="w-full">
                <Github className="w-4 h-4 mr-2" />
                Connect GitHub Account
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
