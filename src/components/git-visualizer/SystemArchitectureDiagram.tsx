
import React, { useState, useMemo } from "react";
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
  Sparkles
} from "lucide-react";

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
    if (fileName === 'yarn.lock') {
      analysis.packageManager = 'yarn';
    } else if (fileName === 'pnpm-lock.yaml') {
      analysis.packageManager = 'pnpm';
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

const generateAdvancedArchitecture = (repositoryData: any): ArchitectureNode[] => {
  const result = analyzeRepositoryStructure(repositoryData);
  if (!result) return [];

  const { analysis, fileStructure } = result;
  const nodes: ArchitectureNode[] = [];
  const baseUrl = repositoryData?.info?.githubUrl || '';

  let nodeId = 1;

  // Create a more sophisticated layout
  const layers = {
    presentation: { y: 50, nodes: [] as ArchitectureNode[] },
    business: { y: 200, nodes: [] as ArchitectureNode[] },
    data: { y: 350, nodes: [] as ArchitectureNode[] },
    infrastructure: { y: 500, nodes: [] as ArchitectureNode[] }
  };

  // Presentation Layer
  if (analysis.hasReact || analysis.hasNextJS) {
    const mainFramework = analysis.hasNextJS ? 'Next.js' : 'React';
    const tech = [mainFramework];
    if (analysis.hasTypeScript) tech.push('TypeScript');
    if (analysis.hasTailwind) tech.push('Tailwind CSS');

    layers.presentation.nodes.push({
      id: `node-${nodeId++}`,
      name: `${mainFramework} Application`,
      type: 'frontend',
      icon: <Code className="w-5 h-5" />,
      description: `Main ${mainFramework} application with ${analysis.hasTypeScript ? 'TypeScript' : 'JavaScript'}`,
      filePath: 'src/App.tsx',
      connections: [],
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 text-blue-800',
      position: { x: 0, y: 0 },
      tech,
      fileCount: fileStructure['src'] || 0,
      importance: 'high',
      githubUrl: `${baseUrl}/blob/main/src/App.tsx`
    });
  }

  if (analysis.components.length > 0) {
    layers.presentation.nodes.push({
      id: `node-${nodeId++}`,
      name: 'UI Components',
      type: 'component',
      icon: <Package className="w-5 h-5" />,
      description: `${analysis.components.length} reusable React components`,
      filePath: 'src/components/',
      connections: [],
      color: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 text-purple-800',
      position: { x: 0, y: 0 },
      tech: ['React Components', 'Reusable UI'],
      fileCount: analysis.components.length,
      importance: 'high',
      githubUrl: `${baseUrl}/tree/main/src/components`
    });
  }

  if (analysis.styles.length > 0 || analysis.hasTailwind) {
    const tech = analysis.hasTailwind ? ['Tailwind CSS'] : ['CSS', 'SCSS'];
    layers.presentation.nodes.push({
      id: `node-${nodeId++}`,
      name: 'Styling System',
      type: 'frontend',
      icon: <Smartphone className="w-5 h-5" />,
      description: `Design system with ${analysis.hasTailwind ? 'Tailwind CSS' : 'custom styles'}`,
      filePath: analysis.hasTailwind ? 'tailwind.config.ts' : 'src/styles/',
      connections: [],
      color: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300 text-pink-800',
      position: { x: 0, y: 0 },
      tech,
      fileCount: analysis.styles.length,
      importance: 'medium',
      githubUrl: `${baseUrl}/blob/main/tailwind.config.ts`
    });
  }

  // Business Logic Layer
  if (analysis.services.length > 0) {
    layers.business.nodes.push({
      id: `node-${nodeId++}`,
      name: 'Business Logic',
      type: 'service',
      icon: <Zap className="w-5 h-5" />,
      description: `${analysis.services.length} service modules and utilities`,
      filePath: 'src/services/',
      connections: [],
      color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-800',
      position: { x: 0, y: 0 },
      tech: ['Services', 'Business Rules'],
      fileCount: analysis.services.length,
      importance: 'high',
      githubUrl: `${baseUrl}/tree/main/src/services`
    });
  }

  if (analysis.hasAPI) {
    layers.business.nodes.push({
      id: `node-${nodeId++}`,
      name: 'API Integration',
      type: 'service',
      icon: <Server className="w-5 h-5" />,
      description: 'RESTful API endpoints and data fetching',
      filePath: 'src/api/',
      connections: [],
      color: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 text-orange-800',
      position: { x: 0, y: 0 },
      tech: ['REST API', 'HTTP Client'],
      importance: 'high',
      githubUrl: `${baseUrl}/tree/main/src/api`
    });
  }

  if (analysis.hasRedux) {
    layers.business.nodes.push({
      id: `node-${nodeId++}`,
      name: 'State Management',
      type: 'service',
      icon: <Database className="w-5 h-5" />,
      description: 'Redux store for application state',
      filePath: 'src/store/',
      connections: [],
      color: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-300 text-indigo-800',
      position: { x: 0, y: 0 },
      tech: ['Redux', 'State Management'],
      importance: 'high',
      githubUrl: `${baseUrl}/tree/main/src/store`
    });
  }

  // Data Layer
  if (analysis.hasDatabase) {
    layers.data.nodes.push({
      id: `node-${nodeId++}`,
      name: 'Database',
      type: 'database',
      icon: <Database className="w-5 h-5" />,
      description: 'Data persistence and storage layer',
      filePath: 'database/',
      connections: [],
      color: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300 text-cyan-800',
      position: { x: 0, y: 0 },
      tech: ['Database', 'SQL'],
      importance: 'high',
      githubUrl: `${baseUrl}/tree/main/database`
    });
  }

  if (analysis.hasGraphQL) {
    layers.data.nodes.push({
      id: `node-${nodeId++}`,
      name: 'GraphQL API',
      type: 'service',
      icon: <Globe className="w-5 h-5" />,
      description: 'GraphQL schema and resolvers',
      filePath: 'src/graphql/',
      connections: [],
      color: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300 text-pink-800',
      position: { x: 0, y: 0 },
      tech: ['GraphQL', 'API'],
      importance: 'high',
      githubUrl: `${baseUrl}/tree/main/src/graphql`
    });
  }

  // Infrastructure Layer
  if (analysis.hasVite || analysis.hasWebpack) {
    const buildTool = analysis.hasVite ? 'Vite' : 'Webpack';
    layers.infrastructure.nodes.push({
      id: `node-${nodeId++}`,
      name: `Build System (${buildTool})`,
      type: 'infrastructure',
      icon: <Package className="w-5 h-5" />,
      description: `${buildTool} build configuration and bundling`,
      filePath: analysis.hasVite ? 'vite.config.ts' : 'webpack.config.js',
      connections: [],
      color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 text-yellow-800',
      position: { x: 0, y: 0 },
      tech: [buildTool, 'Module Bundling'],
      importance: 'medium',
      githubUrl: `${baseUrl}/blob/main/vite.config.ts`
    });
  }

  if (analysis.hasTests) {
    layers.infrastructure.nodes.push({
      id: `node-${nodeId++}`,
      name: 'Testing Framework',
      type: 'infrastructure',
      icon: <Shield className="w-5 h-5" />,
      description: 'Automated testing and quality assurance',
      filePath: 'tests/',
      connections: [],
      color: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300 text-emerald-800',
      position: { x: 0, y: 0 },
      tech: ['Testing', 'QA'],
      importance: 'high',
      githubUrl: `${baseUrl}/tree/main/tests`
    });
  }

  if (analysis.hasDocker) {
    layers.infrastructure.nodes.push({
      id: `node-${nodeId++}`,
      name: 'Containerization',
      type: 'infrastructure',
      icon: <Cloud className="w-5 h-5" />,
      description: 'Docker containerization setup',
      filePath: 'Dockerfile',
      connections: [],
      color: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 text-slate-800',
      position: { x: 0, y: 0 },
      tech: ['Docker', 'Containers'],
      importance: 'medium',
      githubUrl: `${baseUrl}/blob/main/Dockerfile`
    });
  }

  if (analysis.hasCI) {
    layers.infrastructure.nodes.push({
      id: `node-${nodeId++}`,
      name: 'CI/CD Pipeline',
      type: 'infrastructure',
      icon: <GitBranch className="w-5 h-5" />,
      description: 'Continuous integration and deployment',
      filePath: '.github/workflows/',
      connections: [],
      color: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-300 text-indigo-800',
      position: { x: 0, y: 0 },
      tech: ['GitHub Actions', 'CI/CD'],
      importance: 'high',
      githubUrl: `${baseUrl}/tree/main/.github/workflows`
    });
  }

  if (analysis.hasESLint || analysis.hasPrettier) {
    const tools = [];
    if (analysis.hasESLint) tools.push('ESLint');
    if (analysis.hasPrettier) tools.push('Prettier');
    
    layers.infrastructure.nodes.push({
      id: `node-${nodeId++}`,
      name: 'Code Quality',
      type: 'infrastructure',
      icon: <Settings className="w-5 h-5" />,
      description: `Code linting and formatting with ${tools.join(' & ')}`,
      filePath: '.eslintrc',
      connections: [],
      color: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 text-gray-800',
      position: { x: 0, y: 0 },
      tech: tools,
      importance: 'medium',
      githubUrl: `${baseUrl}/blob/main/.eslintrc`
    });
  }

  // Position nodes in each layer
  Object.entries(layers).forEach(([layerName, layer]) => {
    const nodesInLayer = layer.nodes.length;
    const spacing = Math.max(300, 800 / Math.max(nodesInLayer, 1));
    const startX = Math.max(50, (900 - (nodesInLayer - 1) * spacing) / 2);

    layer.nodes.forEach((node, index) => {
      node.position = {
        x: startX + index * spacing,
        y: layer.y
      };
      nodes.push(node);
    });
  });

  return nodes;
};

const ConnectionLine: React.FC<{ from: ArchitectureNode; to: ArchitectureNode }> = ({ from, to }) => {
  const fromX = from.position.x + 140;
  const fromY = from.position.y + 60;
  const toX = to.position.x + 140;
  const toY = to.position.y + 60;

  return (
    <motion.line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke="hsl(var(--muted-foreground))"
      strokeWidth="2"
      strokeDasharray="6,4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.3 }}
      transition={{ duration: 2, delay: Math.random() * 1 }}
      className="pointer-events-none"
    />
  );
};

const ArchitectureNodeComponent: React.FC<{ 
  node: ArchitectureNode; 
  onNodeClick: (node: ArchitectureNode) => void;
}> = ({ node, onNodeClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getImportanceIndicator = (importance: string) => {
    switch (importance) {
      case 'high':
        return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />;
      case 'medium':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="absolute cursor-pointer select-none"
            style={{ 
              left: node.position.x, 
              top: node.position.y,
              width: '280px',
              height: '120px'
            }}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.7, 
              delay: (node.position.y / 150) * 0.1,
              type: "spring",
              stiffness: 80 
            }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onNodeClick(node)}
          >
            <Card className={`${node.color} transition-all duration-500 h-full border-2 shadow-lg ${
              isHovered ? 'shadow-xl border-primary/50 ring-2 ring-primary/20' : 'shadow-md'
            }`}>
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/50 rounded-lg">
                      {node.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-tight">{node.name}</h3>
                      <Badge variant="outline" className="text-xs px-2 py-0 mt-1">
                        {node.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getImportanceIndicator(node.importance)}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
                  {node.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {node.fileCount && (
                      <span className="text-xs font-medium bg-white/30 px-2 py-1 rounded">
                        {node.fileCount} files
                      </span>
                    )}
                  </div>
                  {node.tech && (
                    <div className="text-xs font-medium bg-white/30 px-2 py-1 rounded truncate max-w-24">
                      {node.tech[0]}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-96">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary/10 rounded">
                {node.icon}
              </div>
              <p className="font-bold">{node.name}</p>
              {getImportanceIndicator(node.importance)}
            </div>
            <p className="text-sm">{node.description}</p>
            {node.tech && (
              <div className="space-y-1">
                <p className="text-xs font-semibold">Technologies:</p>
                <div className="flex flex-wrap gap-1">
                  {node.tech.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {node.filePath && (
              <p className="text-xs text-muted-foreground border-t pt-2">
                📁 {node.filePath}
              </p>
            )}
            {node.fileCount && (
              <p className="text-xs text-muted-foreground">
                📊 {node.fileCount} files
              </p>
            )}
            <p className="text-xs text-blue-600">
              Click to open in GitHub →
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const SystemArchitectureDiagram: React.FC<SystemArchitectureDiagramProps> = ({ repositoryData }) => {
  const { toast } = useToast();

  const architectureNodes = useMemo(() => {
    return generateAdvancedArchitecture(repositoryData);
  }, [repositoryData]);

  const handleNodeClick = (node: ArchitectureNode) => {
    if (node.githubUrl) {
      // Open in new tab
      window.open(node.githubUrl, '_blank', 'noopener,noreferrer');
      
      toast({
        title: `Opening ${node.name}`,
        description: `Redirecting to GitHub: ${node.filePath}`,
        duration: 2000,
      });
    } else {
      toast({
        title: `${node.name} Component`,
        description: `This component represents ${node.description.toLowerCase()}. GitHub URL not available for this repository.`,
        duration: 3000,
      });
    }
  };

  const maxHeight = Math.max(...architectureNodes.map(node => node.position.y)) + 180;
  const layerLabels = ['Presentation Layer', 'Business Logic Layer', 'Data Layer', 'Infrastructure Layer'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Advanced System Architecture
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </CardTitle>
        <CardDescription>
          Interactive layered architecture diagram - click components to view source code on GitHub
        </CardDescription>
      </CardHeader>
      <CardContent>
        {architectureNodes.length === 0 ? (
          <div className="text-center py-16">
            <Brain className="w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-3">No Repository Data</h3>
            <p className="text-muted-foreground mb-4">
              Import a repository to see its intelligent architecture analysis
            </p>
            <Badge variant="outline" className="px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Analysis
            </Badge>
          </div>
        ) : (
          <div className="relative w-full bg-gradient-to-br from-background via-accent/5 to-primary/5 rounded-xl border-2 border-border/50 overflow-hidden">
            {/* Layer Labels */}
            <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-around py-8 z-10">
              {layerLabels.map((label, index) => (
                <div
                  key={label}
                  className="writing-mode-vertical-rl text-xs font-semibold text-muted-foreground bg-background/80 px-2 py-1 rounded rotate-180"
                  style={{ transform: `translateY(${index * 130 + 60}px)` }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Architecture Nodes */}
            <div 
              className="relative overflow-auto pl-20"
              style={{ 
                minWidth: '1000px', 
                minHeight: `${maxHeight}px`, 
                height: `${Math.min(maxHeight, 700)}px` 
              }}
            >
              {/* Connection Lines */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                {architectureNodes.map((node, index) => 
                  architectureNodes.slice(index + 1).map((otherNode, otherIndex) => {
                    if (Math.abs(node.position.y - otherNode.position.y) === 150) {
                      return (
                        <ConnectionLine
                          key={`${node.id}-${otherNode.id}`}
                          from={node}
                          to={otherNode}
                        />
                      );
                    }
                    return null;
                  })
                )}
              </svg>

              {/* Nodes */}
              <div style={{ zIndex: 2, position: 'relative' }}>
                {architectureNodes.map((node) => (
                  <ArchitectureNodeComponent
                    key={node.id}
                    node={node}
                    onNodeClick={handleNodeClick}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Legend & Analytics */}
        {architectureNodes.length > 0 && (
          <div className="mt-8 space-y-6">
            {/* Component Type Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded"></div>
                <span className="text-sm font-medium">Frontend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded"></div>
                <span className="text-sm font-medium">Business Logic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-300 rounded"></div>
                <span className="text-sm font-medium">Data Layer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded"></div>
                <span className="text-sm font-medium">Infrastructure</span>
              </div>
            </div>

            {/* Importance Legend */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium">Component Importance:</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Important</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">Supporting</span>
              </div>
            </div>

            {/* Repository Insights */}
            {repositoryData && (
              <div className="p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl border border-border/50">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Architecture Analysis
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{architectureNodes.length}</div>
                    <div className="text-xs text-muted-foreground">Components</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {architectureNodes.filter(n => n.importance === 'high').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Critical</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {repositoryData.tree?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Files</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {new Set(architectureNodes.flatMap(n => n.tech || [])).size}
                    </div>
                    <div className="text-xs text-muted-foreground">Technologies</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">4</div>
                    <div className="text-xs text-muted-foreground">Layers</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
