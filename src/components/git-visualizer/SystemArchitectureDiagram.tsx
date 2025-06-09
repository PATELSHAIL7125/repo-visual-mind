
import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { 
  Server, 
  Database, 
  Globe, 
  Code, 
  FileText, 
  Settings, 
  Shield,
  Layers,
  GitBranch,
  ExternalLink,
  Zap,
  Package,
  Monitor,
  Cloud,
  Router,
  Smartphone,
  Folder,
  File,
  Brain,
  Sparkles,
  Download
} from "lucide-react";
import mermaid from 'mermaid';

interface SystemArchitectureDiagramProps {
  repositoryData?: any;
}

interface ArchitectureNode {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'service' | 'config' | 'external' | 'infrastructure' | 'component';
  icon: React.ReactNode;
  description: string;
  filePath?: string;
  connections: string[];
  color: string;
  position: { x: number; y: number };
  tech?: string[];
  fileCount?: number;
  importance: 'high' | 'medium' | 'low';
  githubUrl?: string;
}

const analyzeRepositoryStructure = (repositoryData: any) => {
  if (!repositoryData?.tree) return null;

  const analysis = {
    hasReact: false,
    hasTypeScript: false,
    hasNodeJS: false,
    hasDatabase: false,
    hasAPI: false,
    hasTests: false,
    hasDocker: false,
    hasCI: false,
    hasNextJS: false,
    hasVite: false,
    hasTailwind: false,
    hasESLint: false,
    hasPrettier: false,
    hasWebpack: false,
    hasRedux: false,
    hasGraphQL: false,
    hasStorybook: false,
    hasPrisma: false,
    hasExpress: false,
    components: [] as string[],
    services: [] as string[],
    configs: [] as string[],
    styles: [] as string[],
    assets: [] as string[],
    docs: [] as string[],
    packageManager: 'npm',
    framework: 'unknown'
  };

  const fileStructure: { [key: string]: number } = {};

  repositoryData.tree.forEach((item: any) => {
    const path = item.path.toLowerCase();
    const fileName = path.split('/').pop() || '';
    const extension = fileName.split('.').pop() || '';
    const directory = path.split('/')[0];

    // Count files in directories
    fileStructure[directory] = (fileStructure[directory] || 0) + 1;

    // Enhanced technology detection
    if (extension === 'tsx' || extension === 'jsx' || fileName.includes('react')) {
      analysis.hasReact = true;
      analysis.framework = 'React';
    }
    if (extension === 'ts' || extension === 'tsx') {
      analysis.hasTypeScript = true;
    }
    if (fileName === 'package.json' || fileName === 'server.js' || fileName === 'app.js') {
      analysis.hasNodeJS = true;
    }
    if (fileName === 'next.config.js' || fileName === 'next.config.ts') {
      analysis.hasNextJS = true;
      analysis.framework = 'Next.js';
    }
    if (fileName === 'vite.config.js' || fileName === 'vite.config.ts') {
      analysis.hasVite = true;
    }
    if (fileName === 'tailwind.config.js' || fileName === 'tailwind.config.ts') {
      analysis.hasTailwind = true;
    }
    if (fileName === 'schema.prisma' || path.includes('prisma')) {
      analysis.hasPrisma = true;
      analysis.hasDatabase = true;
    }
    if (fileName.includes('express') || path.includes('express')) {
      analysis.hasExpress = true;
    }
    if (fileName === '.eslintrc' || fileName === 'eslint.config.js') {
      analysis.hasESLint = true;
    }
    if (fileName === '.prettierrc' || fileName === 'prettier.config.js') {
      analysis.hasPrettier = true;
    }
    if (fileName === 'webpack.config.js') {
      analysis.hasWebpack = true;
    }
    if (path.includes('redux') || path.includes('store')) {
      analysis.hasRedux = true;
    }
    if (fileName.includes('graphql') || extension === 'graphql') {
      analysis.hasGraphQL = true;
    }
    if (path.includes('storybook') || fileName.includes('stories')) {
      analysis.hasStorybook = true;
    }
    if (fileName.includes('database') || fileName.includes('db') || extension === 'sql') {
      analysis.hasDatabase = true;
    }
    if (path.includes('api') || path.includes('endpoint') || fileName.includes('api')) {
      analysis.hasAPI = true;
    }
    if (path.includes('test') || path.includes('spec') || extension === 'test.js') {
      analysis.hasTests = true;
    }
    if (fileName === 'dockerfile' || fileName === 'docker-compose.yml') {
      analysis.hasDocker = true;
    }
    if (path.includes('.github') || fileName.includes('ci') || fileName.includes('pipeline')) {
      analysis.hasCI = true;
    }

    // Categorize files
    if (path.includes('component') || (extension === 'tsx' && !path.includes('page'))) {
      analysis.components.push(fileName);
    }
    if (path.includes('service') || path.includes('lib') || path.includes('util')) {
      analysis.services.push(fileName);
    }
    if (extension === 'json' || extension === 'yml' || extension === 'yaml' || extension === 'env') {
      analysis.configs.push(fileName);
    }
    if (extension === 'css' || extension === 'scss' || extension === 'sass') {
      analysis.styles.push(fileName);
    }
    if (path.includes('asset') || path.includes('image') || path.includes('static')) {
      analysis.assets.push(fileName);
    }
    if (extension === 'md' || extension === 'txt' || path.includes('doc')) {
      analysis.docs.push(fileName);
    }
  });

  return { analysis, fileStructure };
};

const generateMermaidDiagram = (repositoryData: any): string => {
  const result = analyzeRepositoryStructure(repositoryData);
  if (!result) return '';

  const { analysis } = result;

  let mermaidCode = 'graph TD\n';
  
  // Define styles
  mermaidCode += '    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px\n';
  mermaidCode += '    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px\n';
  mermaidCode += '    classDef database fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px\n';
  mermaidCode += '    classDef config fill:#fff3e0,stroke:#ef6c00,stroke-width:2px\n';
  mermaidCode += '    classDef infrastructure fill:#fce4ec,stroke:#c2185b,stroke-width:2px\n\n';

  let nodeId = 1;
  const nodes: { [key: string]: string } = {};

  // Frontend Layer
  if (analysis.hasReact || analysis.hasNextJS) {
    const mainFramework = analysis.hasNextJS ? 'Next.js' : 'React';
    const nodeKey = `A${nodeId++}`;
    nodes['frontend'] = nodeKey;
    mermaidCode += `    ${nodeKey}["🖥️ ${mainFramework} App"]:::frontend\n`;
  }

  if (analysis.components.length > 0) {
    const nodeKey = `A${nodeId++}`;
    nodes['components'] = nodeKey;
    mermaidCode += `    ${nodeKey}["🧩 UI Components<br/>${analysis.components.length} files"]:::frontend\n`;
  }

  if (analysis.hasTailwind || analysis.styles.length > 0) {
    const nodeKey = `A${nodeId++}`;
    nodes['styles'] = nodeKey;
    const tech = analysis.hasTailwind ? 'Tailwind CSS' : 'Custom CSS';
    mermaidCode += `    ${nodeKey}["🎨 ${tech}"]:::frontend\n`;
  }

  // Backend Layer
  if (analysis.hasNodeJS || analysis.hasExpress) {
    const nodeKey = `B${nodeId++}`;
    nodes['backend'] = nodeKey;
    const tech = analysis.hasExpress ? 'Express.js' : 'Node.js';
    mermaidCode += `    ${nodeKey}["⚡ ${tech} Server"]:::backend\n`;
  }

  if (analysis.hasAPI) {
    const nodeKey = `B${nodeId++}`;
    nodes['api'] = nodeKey;
    mermaidCode += `    ${nodeKey}["🔗 REST API"]:::backend\n`;
  }

  if (analysis.hasGraphQL) {
    const nodeKey = `B${nodeId++}`;
    nodes['graphql'] = nodeKey;
    mermaidCode += `    ${nodeKey}["📊 GraphQL API"]:::backend\n`;
  }

  if (analysis.services.length > 0) {
    const nodeKey = `B${nodeId++}`;
    nodes['services'] = nodeKey;
    mermaidCode += `    ${nodeKey}["🔧 Business Logic<br/>${analysis.services.length} services"]:::backend\n`;
  }

  // Database Layer
  if (analysis.hasPrisma) {
    const nodeKey = `D${nodeId++}`;
    nodes['prisma'] = nodeKey;
    mermaidCode += `    ${nodeKey}["🗃️ Prisma ORM"]:::database\n`;
  }

  if (analysis.hasDatabase) {
    const nodeKey = `D${nodeId++}`;
    nodes['database'] = nodeKey;
    mermaidCode += `    ${nodeKey}["💾 Database"]:::database\n`;
  }

  if (analysis.hasRedux) {
    const nodeKey = `D${nodeId++}`;
    nodes['redux'] = nodeKey;
    mermaidCode += `    ${nodeKey}["🏪 Redux Store"]:::database\n`;
  }

  // Infrastructure Layer
  if (analysis.hasVite || analysis.hasWebpack) {
    const nodeKey = `I${nodeId++}`;
    nodes['build'] = nodeKey;
    const tool = analysis.hasVite ? 'Vite' : 'Webpack';
    mermaidCode += `    ${nodeKey}["📦 ${tool} Build"]:::infrastructure\n`;
  }

  if (analysis.hasDocker) {
    const nodeKey = `I${nodeId++}`;
    nodes['docker'] = nodeKey;
    mermaidCode += `    ${nodeKey}["🐳 Docker"]:::infrastructure\n`;
  }

  if (analysis.hasCI) {
    const nodeKey = `I${nodeId++}`;
    nodes['ci'] = nodeKey;
    mermaidCode += `    ${nodeKey}["🔄 CI/CD Pipeline"]:::infrastructure\n`;
  }

  if (analysis.hasTests) {
    const nodeKey = `I${nodeId++}`;
    nodes['tests'] = nodeKey;
    mermaidCode += `    ${nodeKey}["🧪 Testing Suite"]:::infrastructure\n`;
  }

  // Config Layer
  if (analysis.hasESLint || analysis.hasPrettier) {
    const nodeKey = `C${nodeId++}`;
    nodes['linting'] = nodeKey;
    const tools = [];
    if (analysis.hasESLint) tools.push('ESLint');
    if (analysis.hasPrettier) tools.push('Prettier');
    mermaidCode += `    ${nodeKey}["⚙️ ${tools.join(' + ')}"]:::config\n`;
  }

  // Add connections
  mermaidCode += '\n    %% Connections\n';
  
  if (nodes['frontend'] && nodes['components']) {
    mermaidCode += `    ${nodes['frontend']} --> ${nodes['components']}\n`;
  }
  
  if (nodes['frontend'] && nodes['styles']) {
    mermaidCode += `    ${nodes['frontend']} --> ${nodes['styles']}\n`;
  }
  
  if (nodes['frontend'] && nodes['api']) {
    mermaidCode += `    ${nodes['frontend']} --> ${nodes['api']}\n`;
  }
  
  if (nodes['api'] && nodes['services']) {
    mermaidCode += `    ${nodes['api']} --> ${nodes['services']}\n`;
  }
  
  if (nodes['services'] && nodes['database']) {
    mermaidCode += `    ${nodes['services']} --> ${nodes['database']}\n`;
  }
  
  if (nodes['prisma'] && nodes['database']) {
    mermaidCode += `    ${nodes['prisma']} --> ${nodes['database']}\n`;
  }
  
  if (nodes['backend'] && nodes['api']) {
    mermaidCode += `    ${nodes['backend']} --> ${nodes['api']}\n`;
  }
  
  if (nodes['build'] && nodes['frontend']) {
    mermaidCode += `    ${nodes['build']} --> ${nodes['frontend']}\n`;
  }
  
  if (nodes['docker'] && nodes['backend']) {
    mermaidCode += `    ${nodes['docker']} --> ${nodes['backend']}\n`;
  }
  
  if (nodes['tests'] && nodes['frontend']) {
    mermaidCode += `    ${nodes['tests']} --> ${nodes['frontend']}\n`;
  }
  
  if (nodes['tests'] && nodes['backend']) {
    mermaidCode += `    ${nodes['tests']} --> ${nodes['backend']}\n`;
  }

  return mermaidCode;
};

const fixGithubUrl = (baseUrl: string, filePath: string): string => {
  if (!baseUrl || !filePath) return '';
  
  // Clean up the base URL
  const cleanBaseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  
  // Ensure we're using the correct GitHub URL format
  let githubUrl = cleanBaseUrl;
  if (githubUrl.includes('api.github.com/repos/')) {
    githubUrl = githubUrl.replace('api.github.com/repos/', 'github.com/');
  }
  
  // Build the proper GitHub file URL
  const cleanFilePath = filePath.replace(/^\//, ''); // Remove leading slash
  return `${githubUrl}/blob/main/${cleanFilePath}`;
};

export const SystemArchitectureDiagram: React.FC<SystemArchitectureDiagramProps> = ({ repositoryData }) => {
  const { toast } = useToast();
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  const mermaidDiagram = useMemo(() => {
    return generateMermaidDiagram(repositoryData);
  }, [repositoryData]);

  const architectureAnalysis = useMemo(() => {
    const result = analyzeRepositoryStructure(repositoryData);
    return result?.analysis;
  }, [repositoryData]);

  useEffect(() => {
    if (mermaidDiagram && mermaidRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
          primaryColor: '#f0f9ff',
          primaryTextColor: '#1e293b',
          primaryBorderColor: '#3b82f6',
          lineColor: '#64748b',
          sectionBkgColor: '#f8fafc',
          altSectionBkgColor: '#e2e8f0',
          gridColor: '#e2e8f0',
          secondaryColor: '#fef3c7',
          tertiaryColor: '#f0fdf4'
        }
      });

      mermaidRef.current.innerHTML = mermaidDiagram;
      mermaid.contentLoaded();
      setMermaidLoaded(true);
    }
  }, [mermaidDiagram]);

  const handleExploreCode = (filePath: string) => {
    if (!repositoryData?.info?.html_url) {
      toast({
        title: "Repository URL not available",
        description: "Cannot open file - repository URL is missing",
        variant: "destructive",
      });
      return;
    }

    const githubUrl = fixGithubUrl(repositoryData.info.html_url, filePath);
    
    console.log('Opening GitHub URL:', githubUrl);
    
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: `Opening ${filePath}`,
      description: "Redirecting to GitHub in new tab",
      duration: 2000,
    });
  };

  const downloadDiagram = () => {
    if (!mermaidRef.current) return;
    
    const svgElement = mermaidRef.current.querySelector('svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${repositoryData?.info?.name || 'repository'}-architecture.svg`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Diagram Downloaded",
        description: "Architecture diagram saved as SVG file",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          System Architecture Diagram
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </CardTitle>
        <CardDescription>
          Interactive Mermaid.js architecture diagram - dynamically generated from repository analysis
        </CardDescription>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadDiagram} disabled={!mermaidLoaded}>
            <Download className="w-4 h-4 mr-2" />
            Download SVG
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!mermaidDiagram ? (
          <div className="text-center py-16">
            <Brain className="w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-3">No Repository Data</h3>
            <p className="text-muted-foreground mb-4">
              Import a repository to see its system architecture diagram
            </p>
            <Badge variant="outline" className="px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Mermaid.js
            </Badge>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mermaid Diagram */}
            <div className="relative w-full bg-gradient-to-br from-background via-accent/5 to-primary/5 rounded-xl border-2 border-border/50 p-6 overflow-auto">
              <div ref={mermaidRef} className="flex justify-center min-h-[400px]" />
              {!mermaidLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Generating diagram...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {architectureAnalysis && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {architectureAnalysis.hasReact && (
                  <Button variant="outline" size="sm" onClick={() => handleExploreCode('src/App.tsx')}>
                    <Code className="w-4 h-4 mr-2" />
                    Explore React App
                  </Button>
                )}
                {architectureAnalysis.hasPrisma && (
                  <Button variant="outline" size="sm" onClick={() => handleExploreCode('prisma/schema.prisma')}>
                    <Database className="w-4 h-4 mr-2" />
                    View Database Schema
                  </Button>
                )}
                {architectureAnalysis.hasAPI && (
                  <Button variant="outline" size="sm" onClick={() => handleExploreCode('src/api')}>
                    <Server className="w-4 h-4 mr-2" />
                    Explore API
                  </Button>
                )}
                {architectureAnalysis.hasTests && (
                  <Button variant="outline" size="sm" onClick={() => handleExploreCode('tests')}>
                    <Shield className="w-4 h-4 mr-2" />
                    View Tests
                  </Button>
                )}
              </div>
            )}

            {/* Repository Insights */}
            {repositoryData && architectureAnalysis && (
              <div className="p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl border border-border/50">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Architecture Analysis
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {architectureAnalysis.framework}
                    </div>
                    <div className="text-xs text-muted-foreground">Framework</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {architectureAnalysis.hasTypeScript ? 'TS' : 'JS'}
                    </div>
                    <div className="text-xs text-muted-foreground">Language</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {repositoryData.tree?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Files</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {architectureAnalysis.components.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Components</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {[
                        architectureAnalysis.hasDatabase && 'DB',
                        architectureAnalysis.hasAPI && 'API',
                        architectureAnalysis.hasTests && 'Tests',
                        architectureAnalysis.hasDocker && 'Docker'
                      ].filter(Boolean).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Features</div>
                  </div>
                </div>
              </div>
            )}

            {/* Technology Stack */}
            {architectureAnalysis && (
              <div className="space-y-4">
                <h4 className="font-semibold">Technology Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {architectureAnalysis.hasReact && <Badge variant="secondary">React</Badge>}
                  {architectureAnalysis.hasNextJS && <Badge variant="secondary">Next.js</Badge>}
                  {architectureAnalysis.hasTypeScript && <Badge variant="secondary">TypeScript</Badge>}
                  {architectureAnalysis.hasNodeJS && <Badge variant="secondary">Node.js</Badge>}
                  {architectureAnalysis.hasTailwind && <Badge variant="secondary">Tailwind CSS</Badge>}
                  {architectureAnalysis.hasPrisma && <Badge variant="secondary">Prisma</Badge>}
                  {architectureAnalysis.hasVite && <Badge variant="secondary">Vite</Badge>}
                  {architectureAnalysis.hasRedux && <Badge variant="secondary">Redux</Badge>}
                  {architectureAnalysis.hasGraphQL && <Badge variant="secondary">GraphQL</Badge>}
                  {architectureAnalysis.hasDocker && <Badge variant="secondary">Docker</Badge>}
                  {architectureAnalysis.hasESLint && <Badge variant="secondary">ESLint</Badge>}
                  {architectureAnalysis.hasPrettier && <Badge variant="secondary">Prettier</Badge>}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
