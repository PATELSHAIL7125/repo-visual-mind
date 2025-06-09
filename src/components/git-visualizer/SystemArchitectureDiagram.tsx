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
  File
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
    components: [] as string[],
    services: [] as string[],
    configs: [] as string[],
    styles: [] as string[],
    assets: [] as string[],
    docs: [] as string[],
    packageManager: 'npm'
  };

  const fileStructure: { [key: string]: number } = {};

  repositoryData.tree.forEach((item: any) => {
    const path = item.path.toLowerCase();
    const fileName = path.split('/').pop() || '';
    const extension = fileName.split('.').pop() || '';
    const directory = path.split('/')[0];

    // Count files in directories
    fileStructure[directory] = (fileStructure[directory] || 0) + 1;

    // Technology detection
    if (extension === 'tsx' || extension === 'jsx' || fileName.includes('react')) {
      analysis.hasReact = true;
    }
    if (extension === 'ts' || extension === 'tsx') {
      analysis.hasTypeScript = true;
    }
    if (fileName === 'package.json' || fileName === 'server.js' || fileName === 'app.js') {
      analysis.hasNodeJS = true;
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

const generateDynamicArchitecture = (repositoryData: any): ArchitectureNode[] => {
  const result = analyzeRepositoryStructure(repositoryData);
  if (!result) return [];

  const { analysis, fileStructure } = result;
  const nodes: ArchitectureNode[] = [];

  let nodeId = 1;
  let yOffset = 0;

  // Frontend Layer
  if (analysis.hasReact) {
    nodes.push({
      id: `node-${nodeId++}`,
      name: analysis.hasTypeScript ? 'React + TypeScript' : 'React App',
      type: 'frontend',
      icon: <Code className="w-4 h-4" />,
      description: `${analysis.hasTypeScript ? 'TypeScript React' : 'JavaScript React'} application`,
      filePath: 'src/App.tsx',
      connections: [],
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      position: { x: 50, y: yOffset },
      tech: analysis.hasTypeScript ? ['React', 'TypeScript'] : ['React', 'JavaScript'],
      fileCount: fileStructure['src'] || 0
    });

    if (analysis.components.length > 0) {
      nodes.push({
        id: `node-${nodeId++}`,
        name: 'UI Components',
        type: 'component',
        icon: <Package className="w-4 h-4" />,
        description: `${analysis.components.length} reusable components`,
        filePath: 'src/components/',
        connections: [],
        color: 'bg-purple-50 border-purple-200 text-purple-700',
        position: { x: 320, y: yOffset },
        tech: ['Component Library'],
        fileCount: analysis.components.length
      });
    }

    if (analysis.styles.length > 0) {
      nodes.push({
        id: `node-${nodeId++}`,
        name: 'Styling System',
        type: 'frontend',
        icon: <Smartphone className="w-4 h-4" />,
        description: `CSS/SCSS styling with ${analysis.styles.length} files`,
        filePath: 'src/styles/',
        connections: [],
        color: 'bg-pink-50 border-pink-200 text-pink-700',
        position: { x: 590, y: yOffset },
        tech: ['CSS', 'SCSS'],
        fileCount: analysis.styles.length
      });
    }
  }

  yOffset += 120;

  // Services/Utils Layer
  if (analysis.services.length > 0) {
    nodes.push({
      id: `node-${nodeId++}`,
      name: 'Business Logic',
      type: 'service',
      icon: <Zap className="w-4 h-4" />,
      description: `${analysis.services.length} service and utility files`,
      filePath: 'src/services/',
      connections: [],
      color: 'bg-green-50 border-green-200 text-green-700',
      position: { x: 50, y: yOffset },
      tech: ['Services', 'Utilities'],
      fileCount: analysis.services.length
    });
  }

  if (analysis.hasAPI) {
    nodes.push({
      id: `node-${nodeId++}`,
      name: 'API Layer',
      type: 'service',
      icon: <Server className="w-4 h-4" />,
      description: 'API endpoints and data fetching',
      filePath: 'src/api/',
      connections: [],
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      position: { x: 320, y: yOffset },
      tech: ['REST API', 'HTTP Client']
    });
  }

  if (analysis.hasDatabase) {
    nodes.push({
      id: `node-${nodeId++}`,
      name: 'Database',
      type: 'database',
      icon: <Database className="w-4 h-4" />,
      description: 'Data storage and management',
      filePath: 'database/',
      connections: [],
      color: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      position: { x: 590, y: yOffset },
      tech: ['Database', 'SQL']
    });
  }

  yOffset += 120;

  // Configuration Layer
  if (analysis.configs.length > 0) {
    nodes.push({
      id: `node-${nodeId++}`,
      name: 'Configuration',
      type: 'config',
      icon: <Settings className="w-4 h-4" />,
      description: `${analysis.configs.length} configuration files`,
      filePath: './',
      connections: [],
      color: 'bg-gray-50 border-gray-200 text-gray-700',
      position: { x: 50, y: yOffset },
      tech: ['JSON', 'YAML', 'ENV'],
      fileCount: analysis.configs.length
    });
  }

  // Build System
  nodes.push({
    id: `node-${nodeId++}`,
    name: `Build System (${analysis.packageManager})`,
    type: 'infrastructure',
    icon: <Package className="w-4 h-4" />,
    description: `Package management with ${analysis.packageManager}`,
    filePath: 'package.json',
    connections: [],
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    position: { x: 320, y: yOffset },
    tech: [analysis.packageManager, 'Build Tools']
  });

  if (analysis.hasTests) {
    nodes.push({
      id: `node-${nodeId++}`,
      name: 'Testing Suite',
      type: 'infrastructure',
      icon: <Shield className="w-4 h-4" />,
      description: 'Automated testing and quality assurance',
      filePath: 'tests/',
      connections: [],
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      position: { x: 590, y: yOffset },
      tech: ['Unit Tests', 'Integration Tests']
    });
  }

  yOffset += 120;

  // Infrastructure Layer
  if (analysis.hasDocker) {
    nodes.push({
      id: `node-${nodeId++}`,
      name: 'Containerization',
      type: 'infrastructure',
      icon: <Cloud className="w-4 h-4" />,
      description: 'Docker containerization setup',
      filePath: 'Dockerfile',
      connections: [],
      color: 'bg-slate-50 border-slate-200 text-slate-700',
      position: { x: 50, y: yOffset },
      tech: ['Docker', 'Containers']
    });
  }

  if (analysis.hasCI) {
    nodes.push({
      id: `node-${nodeId++}`,
      name: 'CI/CD Pipeline',
      type: 'infrastructure',
      icon: <GitBranch className="w-4 h-4" />,
      description: 'Continuous integration and deployment',
      filePath: '.github/',
      connections: [],
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      position: { x: 320, y: yOffset },
      tech: ['GitHub Actions', 'CI/CD']
    });
  }

  if (analysis.docs.length > 0) {
    nodes.push({
      id: `node-${nodeId++}`,
      name: 'Documentation',
      type: 'config',
      icon: <FileText className="w-4 h-4" />,
      description: `${analysis.docs.length} documentation files`,
      filePath: 'README.md',
      connections: [],
      color: 'bg-teal-50 border-teal-200 text-teal-700',
      position: { x: 590, y: yOffset },
      tech: ['Markdown', 'Documentation'],
      fileCount: analysis.docs.length
    });
  }

  return nodes;
};

const ConnectionLine: React.FC<{ from: ArchitectureNode; to: ArchitectureNode }> = ({ from, to }) => {
  const fromX = from.position.x + 115;
  const fromY = from.position.y + 45;
  const toX = to.position.x + 115;
  const toY = to.position.y + 45;

  return (
    <motion.line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke="hsl(var(--muted-foreground))"
      strokeWidth="1.5"
      strokeDasharray="4,4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.4 }}
      transition={{ duration: 1.5, delay: Math.random() * 0.5 }}
      className="pointer-events-none"
    />
  );
};

const ArchitectureNodeComponent: React.FC<{ 
  node: ArchitectureNode; 
  onNodeClick: (node: ArchitectureNode) => void;
}> = ({ node, onNodeClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="absolute cursor-pointer select-none"
            style={{ 
              left: node.position.x, 
              top: node.position.y,
              width: '240px',
              height: '100px'
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: (node.position.y / 100) * 0.1,
              type: "spring",
              stiffness: 100 
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onNodeClick(node)}
          >
            <Card className={`${node.color} transition-all duration-300 h-full border-2 ${
              isHovered ? 'shadow-lg border-primary/30' : 'shadow-sm'
            }`}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {node.icon}
                    <h3 className="font-semibold text-sm leading-tight">{node.name}</h3>
                  </div>
                  {node.filePath && (
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {node.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    {node.type}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {node.fileCount && (
                      <span className="text-xs text-muted-foreground">
                        {node.fileCount} files
                      </span>
                    )}
                    {node.tech && (
                      <div className="text-xs text-muted-foreground">
                        {node.tech[0]}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-80">
          <div className="space-y-2">
            <p className="font-medium">{node.name}</p>
            <p className="text-sm">{node.description}</p>
            {node.tech && (
              <div className="space-y-1">
                <p className="text-xs font-medium">Technologies:</p>
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
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const SystemArchitectureDiagram: React.FC<SystemArchitectureDiagramProps> = ({ repositoryData }) => {
  const { toast } = useToast();

  const architectureNodes = useMemo(() => {
    return generateDynamicArchitecture(repositoryData);
  }, [repositoryData]);

  const handleNodeClick = (node: ArchitectureNode) => {
    if (node.filePath) {
      toast({
        title: `${node.name} Component`,
        description: `File: ${node.filePath}\n\nThis component contains ${node.fileCount || 'multiple'} files. In a real implementation, this would open the code file in your editor.`,
        duration: 3000,
      });
    } else {
      toast({
        title: `${node.name}`,
        description: `This is a ${node.type} component in your project architecture.`,
        duration: 3000,
      });
    }
  };

  const maxHeight = Math.max(...architectureNodes.map(node => node.position.y)) + 150;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Dynamic System Architecture
        </CardTitle>
        <CardDescription>
          Repository-specific architecture diagram generated from your codebase - click on components to explore
        </CardDescription>
      </CardHeader>
      <CardContent>
        {architectureNodes.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Repository Data</h3>
            <p className="text-muted-foreground">
              Import a repository to see its dynamic architecture diagram
            </p>
          </div>
        ) : (
          <div className="relative w-full bg-gradient-to-br from-background via-background/50 to-accent/5 rounded-lg border-2 border-border/50 overflow-hidden">
            {/* Architecture Nodes */}
            <div 
              className="relative overflow-auto"
              style={{ 
                minWidth: '900px', 
                minHeight: `${maxHeight}px`, 
                height: `${Math.min(maxHeight, 600)}px` 
              }}
            >
              {architectureNodes.map((node) => (
                <ArchitectureNodeComponent
                  key={node.id}
                  node={node}
                  onNodeClick={handleNodeClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Legend & Stats */}
        {architectureNodes.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded"></div>
                <span className="text-sm font-medium">Frontend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-50 border-2 border-purple-200 rounded"></div>
                <span className="text-sm font-medium">Components</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border-2 border-green-200 rounded"></div>
                <span className="text-sm font-medium">Services</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-50 border-2 border-gray-200 rounded"></div>
                <span className="text-sm font-medium">Infrastructure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-200 rounded"></div>
                <span className="text-sm font-medium">Build Tools</span>
              </div>
            </div>

            {repositoryData && (
              <div className="p-4 bg-accent/10 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Repository Analysis
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Architecture Nodes</span>
                    <span className="font-bold text-lg">{architectureNodes.length}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Total Files</span>
                    <span className="font-bold text-lg">{repositoryData.tree?.length || 0}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Commits</span>
                    <span className="font-bold text-lg">{repositoryData.commits?.length || 0}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Components</span>
                    <span className="font-bold text-lg">
                      {architectureNodes.filter(n => n.type === 'component').length}
                    </span>
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
