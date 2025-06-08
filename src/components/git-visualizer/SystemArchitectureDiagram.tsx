
import React, { useState } from "react";
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
  Smartphone
} from "lucide-react";

interface SystemArchitectureDiagramProps {
  repositoryData?: any;
}

interface ArchitectureNode {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'service' | 'config' | 'external' | 'infrastructure';
  icon: React.ReactNode;
  description: string;
  filePath?: string;
  connections: string[];
  color: string;
  position: { x: number; y: number };
  tech?: string[];
}

const architectureNodes: ArchitectureNode[] = [
  // Frontend Layer (Top Row)
  {
    id: 'react-client',
    name: 'React Client',
    type: 'frontend',
    icon: <Code className="w-4 h-4" />,
    description: 'Main React application with TypeScript',
    filePath: 'src/App.tsx',
    connections: ['router', 'state-management'],
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    position: { x: 50, y: 30 },
    tech: ['React 18', 'TypeScript', 'Vite']
  },
  {
    id: 'router',
    name: 'React Router',
    type: 'frontend',
    icon: <Router className="w-4 h-4" />,
    description: 'Client-side routing and navigation',
    filePath: 'src/App.tsx',
    connections: ['pages', 'protected-routes'],
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    position: { x: 280, y: 30 },
    tech: ['React Router DOM']
  },
  {
    id: 'state-management',
    name: 'State Management',
    type: 'frontend',
    icon: <Database className="w-4 h-4" />,
    description: 'React Query for server state management',
    filePath: 'src/App.tsx',
    connections: ['api-client'],
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    position: { x: 510, y: 30 },
    tech: ['TanStack Query', 'React Context']
  },
  {
    id: 'ui-system',
    name: 'Design System',
    type: 'frontend',
    icon: <Layers className="w-4 h-4" />,
    description: 'Shadcn/UI component library with Tailwind CSS',
    filePath: 'src/components/ui/',
    connections: ['components'],
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    position: { x: 740, y: 30 },
    tech: ['Shadcn/UI', 'Tailwind CSS', 'Radix UI']
  },
  {
    id: 'responsive-design',
    name: 'Responsive UI',
    type: 'frontend',
    icon: <Smartphone className="w-4 h-4" />,
    description: 'Mobile-first responsive design',
    filePath: 'src/index.css',
    connections: [],
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    position: { x: 970, y: 30 },
    tech: ['CSS Grid', 'Flexbox', 'Media Queries']
  },

  // Application Layer (Second Row)
  {
    id: 'pages',
    name: 'Page Components',
    type: 'frontend',
    icon: <FileText className="w-4 h-4" />,
    description: 'Application pages and route components',
    filePath: 'src/pages/',
    connections: ['components', 'git-visualizer'],
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    position: { x: 50, y: 150 },
    tech: ['Page Routing', 'Layout Components']
  },
  {
    id: 'components',
    name: 'UI Components',
    type: 'frontend',
    icon: <Package className="w-4 h-4" />,
    description: 'Reusable UI components and layouts',
    filePath: 'src/components/',
    connections: ['git-visualizer'],
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    position: { x: 280, y: 150 },
    tech: ['Component Composition', 'Props Interface']
  },
  {
    id: 'git-visualizer',
    name: 'Git Visualizer',
    type: 'frontend',
    icon: <GitBranch className="w-4 h-4" />,
    description: 'Core git visualization components',
    filePath: 'src/components/git-visualizer/',
    connections: ['data-processing', 'charts'],
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    position: { x: 510, y: 150 },
    tech: ['Git Analysis', 'Data Visualization']
  },
  {
    id: 'charts',
    name: 'Chart Library',
    type: 'frontend',
    icon: <Monitor className="w-4 h-4" />,
    description: 'Interactive charts and graphs',
    filePath: 'src/components/git-visualizer/',
    connections: [],
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    position: { x: 740, y: 150 },
    tech: ['Recharts', 'D3.js Integration']
  },
  {
    id: 'protected-routes',
    name: 'Route Guards',
    type: 'frontend',
    icon: <Shield className="w-4 h-4" />,
    description: 'Authentication-based route protection',
    filePath: 'src/components/ProtectedRoute.tsx',
    connections: ['auth-service'],
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    position: { x: 970, y: 150 },
    tech: ['Route Protection', 'Auth Guards']
  },

  // Service Layer (Third Row)
  {
    id: 'git-service',
    name: 'Git Service',
    type: 'service',
    icon: <GitBranch className="w-4 h-4" />,
    description: 'Git repository analysis and processing',
    filePath: 'src/services/gitService.ts',
    connections: ['github-api', 'file-parser'],
    color: 'bg-green-50 border-green-200 text-green-700',
    position: { x: 50, y: 270 },
    tech: ['Git Analysis', 'Repository Parsing']
  },
  {
    id: 'auth-service',
    name: 'Auth Service',
    type: 'service',
    icon: <Shield className="w-4 h-4" />,
    description: 'Authentication and authorization logic',
    filePath: 'src/services/authService.ts',
    connections: ['external-auth'],
    color: 'bg-green-50 border-green-200 text-green-700',
    position: { x: 280, y: 270 },
    tech: ['JWT Tokens', 'OAuth 2.0']
  },
  {
    id: 'api-client',
    name: 'HTTP Client',
    type: 'service',
    icon: <Server className="w-4 h-4" />,
    description: 'HTTP client for API requests and data fetching',
    filePath: 'src/lib/api.ts',
    connections: ['github-api', 'caching'],
    color: 'bg-green-50 border-green-200 text-green-700',
    position: { x: 510, y: 270 },
    tech: ['Fetch API', 'Axios', 'Error Handling']
  },
  {
    id: 'data-processing',
    name: 'Data Processor',
    type: 'service',
    icon: <Zap className="w-4 h-4" />,
    description: 'Repository data analysis and transformation',
    filePath: 'src/utils/dataProcessing.ts',
    connections: ['file-parser'],
    color: 'bg-green-50 border-green-200 text-green-700',
    position: { x: 740, y: 270 },
    tech: ['Data Transformation', 'Analytics Engine']
  },
  {
    id: 'file-parser',
    name: 'File Parser',
    type: 'service',
    icon: <FileText className="w-4 h-4" />,
    description: 'Parse and analyze code files and structures',
    filePath: 'src/utils/fileParser.ts',
    connections: [],
    color: 'bg-green-50 border-green-200 text-green-700',
    position: { x: 970, y: 270 },
    tech: ['AST Parsing', 'Code Analysis']
  },

  // Infrastructure Layer (Fourth Row)
  {
    id: 'github-api',
    name: 'GitHub API',
    type: 'external',
    icon: <Globe className="w-4 h-4" />,
    description: 'External GitHub REST and GraphQL APIs',
    filePath: null,
    connections: [],
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    position: { x: 50, y: 390 },
    tech: ['REST API', 'GraphQL', 'Webhooks']
  },
  {
    id: 'external-auth',
    name: 'Auth Provider',
    type: 'external',
    icon: <Shield className="w-4 h-4" />,
    description: 'External authentication service (OAuth)',
    filePath: null,
    connections: [],
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    position: { x: 280, y: 390 },
    tech: ['OAuth 2.0', 'OpenID Connect']
  },
  {
    id: 'caching',
    name: 'Browser Cache',
    type: 'infrastructure',
    icon: <Database className="w-4 h-4" />,
    description: 'Browser-based caching and storage',
    filePath: null,
    connections: [],
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    position: { x: 510, y: 390 },
    tech: ['LocalStorage', 'SessionStorage', 'IndexedDB']
  },
  {
    id: 'build-system',
    name: 'Build System',
    type: 'infrastructure',
    icon: <Settings className="w-4 h-4" />,
    description: 'Vite build system and development server',
    filePath: 'vite.config.ts',
    connections: [],
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    position: { x: 740, y: 390 },
    tech: ['Vite', 'ESBuild', 'Hot Reload']
  },
  {
    id: 'deployment',
    name: 'Deployment',
    type: 'infrastructure',
    icon: <Cloud className="w-4 h-4" />,
    description: 'Static site hosting and deployment',
    filePath: null,
    connections: [],
    color: 'bg-gray-50 border-gray-200 text-gray-700',
    position: { x: 970, y: 390 },
    tech: ['Static Hosting', 'CDN', 'CI/CD']
  }
];

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
              width: '230px',
              height: '90px'
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
                  {node.tech && (
                    <div className="text-xs text-muted-foreground">
                      {node.tech[0]}
                    </div>
                  )}
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
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const SystemArchitectureDiagram: React.FC<SystemArchitectureDiagramProps> = ({ repositoryData }) => {
  const { toast } = useToast();

  const handleNodeClick = (node: ArchitectureNode) => {
    if (node.filePath) {
      toast({
        title: `${node.name} Component`,
        description: `File: ${node.filePath}\n\nIn a real implementation, this would open the code file in your editor.`,
        duration: 3000,
      });
    } else {
      toast({
        title: `${node.name}`,
        description: `This is an external service or infrastructure component that doesn't have a local file.`,
        duration: 3000,
      });
    }
  };

  const connections = architectureNodes.reduce((acc: Array<{from: ArchitectureNode, to: ArchitectureNode}>, node) => {
    node.connections.forEach(connectionId => {
      const connectedNode = architectureNodes.find(n => n.id === connectionId);
      if (connectedNode) {
        acc.push({ from: node, to: connectedNode });
      }
    });
    return acc;
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          System Architecture
        </CardTitle>
        <CardDescription>
          Interactive system architecture diagram - click on components to learn more about them
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full bg-gradient-to-br from-background via-background/50 to-accent/5 rounded-lg border-2 border-border/50 overflow-hidden">
          {/* Connection Lines */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ zIndex: 1, minWidth: '1250px', minHeight: '500px' }}
            viewBox="0 0 1250 500"
            preserveAspectRatio="xMidYMid meet"
          >
            {connections.map((connection, index) => (
              <ConnectionLine
                key={index}
                from={connection.from}
                to={connection.to}
              />
            ))}
          </svg>

          {/* Architecture Nodes */}
          <div 
            className="relative overflow-auto"
            style={{ zIndex: 2, minWidth: '1250px', minHeight: '500px', height: '500px' }}
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

        {/* Enhanced Legend */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border-2 border-blue-200 rounded"></div>
              <span className="text-sm font-medium">Frontend Layer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-50 border-2 border-purple-200 rounded"></div>
              <span className="text-sm font-medium">Application Layer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border-2 border-green-200 rounded"></div>
              <span className="text-sm font-medium">Service Layer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-200 rounded"></div>
              <span className="text-sm font-medium">External APIs</span>
            </div>
          </div>

          {repositoryData && (
            <div className="p-4 bg-accent/10 rounded-lg border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Repository Insights
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Total Files</span>
                  <span className="font-bold text-lg">{repositoryData.tree?.length || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Commits</span>
                  <span className="font-bold text-lg">{repositoryData.commits?.length || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Branches</span>
                  <span className="font-bold text-lg">{repositoryData.branches?.length || 1}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">Contributors</span>
                  <span className="font-bold text-lg">{repositoryData.contributors?.length || 1}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
