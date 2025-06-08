
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  Zap
} from "lucide-react";

interface SystemArchitectureDiagramProps {
  repositoryData?: any;
}

interface ArchitectureNode {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'database' | 'service' | 'config';
  icon: React.ReactNode;
  description: string;
  filePath?: string;
  connections: string[];
  color: string;
  position: { x: number; y: number };
}

const architectureNodes: ArchitectureNode[] = [
  // Frontend Layer
  {
    id: 'react-client',
    name: 'React Client',
    type: 'frontend',
    icon: <Code className="w-5 h-5" />,
    description: 'Main React application entry point',
    filePath: 'src/App.tsx',
    connections: ['router', 'auth-context'],
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    position: { x: 50, y: 50 }
  },
  {
    id: 'router',
    name: 'App Router',
    type: 'frontend',
    icon: <GitBranch className="w-5 h-5" />,
    description: 'React Router for navigation',
    filePath: 'src/App.tsx',
    connections: ['pages', 'protected-routes'],
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    position: { x: 200, y: 50 }
  },
  {
    id: 'auth-context',
    name: 'Auth Context',
    type: 'frontend',
    icon: <Shield className="w-5 h-5" />,
    description: 'Authentication state management',
    filePath: 'src/contexts/AuthContext.tsx',
    connections: ['protected-routes'],
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    position: { x: 350, y: 50 }
  },
  {
    id: 'pages',
    name: 'Pages',
    type: 'frontend',
    icon: <FileText className="w-5 h-5" />,
    description: 'Application pages and routes',
    filePath: 'src/pages/',
    connections: ['components'],
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    position: { x: 500, y: 50 }
  },
  {
    id: 'components',
    name: 'Components',
    type: 'frontend',
    icon: <Layers className="w-5 h-5" />,
    description: 'Reusable UI components',
    filePath: 'src/components/',
    connections: ['ui-components'],
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    position: { x: 650, y: 50 }
  },
  {
    id: 'ui-components',
    name: 'UI Library',
    type: 'frontend',
    icon: <Code className="w-5 h-5" />,
    description: 'Shadcn/UI component library',
    filePath: 'src/components/ui/',
    connections: [],
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    position: { x: 800, y: 50 }
  },
  {
    id: 'protected-routes',
    name: 'Protected Routes',
    type: 'frontend',
    icon: <Shield className="w-5 h-5" />,
    description: 'Route protection and guards',
    filePath: 'src/components/ProtectedRoute.tsx',
    connections: ['auth-service'],
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    position: { x: 950, y: 50 }
  },

  // Backend/Service Layer
  {
    id: 'git-service',
    name: 'Git Service',
    type: 'service',
    icon: <GitBranch className="w-5 h-5" />,
    description: 'Git repository analysis service',
    filePath: 'src/services/gitService.ts',
    connections: ['github-api'],
    color: 'bg-green-100 border-green-300 text-green-800',
    position: { x: 50, y: 200 }
  },
  {
    id: 'auth-service',
    name: 'Auth Service',
    type: 'service',
    icon: <Shield className="w-5 h-5" />,
    description: 'Authentication service logic',
    filePath: 'src/services/authService.ts',
    connections: ['external-auth'],
    color: 'bg-green-100 border-green-300 text-green-800',
    position: { x: 200, y: 200 }
  },
  {
    id: 'api-client',
    name: 'API Client',
    type: 'service',
    icon: <Server className="w-5 h-5" />,
    description: 'HTTP client for API requests',
    filePath: 'src/lib/api.ts',
    connections: ['github-api'],
    color: 'bg-green-100 border-green-300 text-green-800',
    position: { x: 350, y: 200 }
  },
  {
    id: 'data-processing',
    name: 'Data Processing',
    type: 'service',
    icon: <Zap className="w-5 h-5" />,
    description: 'Repository data analysis and processing',
    filePath: 'src/utils/dataProcessing.ts',
    connections: ['visualization'],
    color: 'bg-green-100 border-green-300 text-green-800',
    position: { x: 500, y: 200 }
  },
  {
    id: 'visualization',
    name: 'Visualization',
    type: 'service',
    icon: <Layers className="w-5 h-5" />,
    description: 'Data visualization components',
    filePath: 'src/components/git-visualizer/',
    connections: [],
    color: 'bg-green-100 border-green-300 text-green-800',
    position: { x: 650, y: 200 }
  },

  // External Services
  {
    id: 'github-api',
    name: 'GitHub API',
    type: 'service',
    icon: <Globe className="w-5 h-5" />,
    description: 'External GitHub API service',
    filePath: null,
    connections: [],
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    position: { x: 50, y: 350 }
  },
  {
    id: 'external-auth',
    name: 'Auth Provider',
    type: 'service',
    icon: <Shield className="w-5 h-5" />,
    description: 'External authentication provider',
    filePath: null,
    connections: [],
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    position: { x: 200, y: 350 }
  },

  // Configuration
  {
    id: 'config',
    name: 'Configuration',
    type: 'config',
    icon: <Settings className="w-5 h-5" />,
    description: 'Application configuration files',
    filePath: 'src/config/',
    connections: [],
    color: 'bg-gray-100 border-gray-300 text-gray-800',
    position: { x: 350, y: 350 }
  }
];

const ConnectionLine: React.FC<{ from: ArchitectureNode; to: ArchitectureNode }> = ({ from, to }) => {
  const fromX = from.position.x + 100; // Assuming node width of 200px
  const fromY = from.position.y + 40;  // Assuming node height of 80px
  const toX = to.position.x + 100;
  const toY = to.position.y + 40;

  return (
    <motion.line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke="hsl(var(--muted-foreground))"
      strokeWidth="2"
      strokeDasharray="5,5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="opacity-60"
    />
  );
};

const ArchitectureNodeComponent: React.FC<{ 
  node: ArchitectureNode; 
  onNodeClick: (filePath: string | null) => void;
}> = ({ node, onNodeClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`absolute cursor-pointer`}
            style={{ 
              left: node.position.x, 
              top: node.position.y,
              width: '200px'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: Math.random() * 0.5 }}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onNodeClick(node.filePath)}
          >
            <Card className={`${node.color} transition-all duration-200 ${isHovered ? 'shadow-lg' : 'shadow'}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {node.icon}
                  <h3 className="font-semibold text-sm">{node.name}</h3>
                  {node.filePath && (
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {node.type}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-48">{node.description}</p>
          {node.filePath && (
            <p className="text-xs text-muted-foreground mt-1">Click to view: {node.filePath}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const SystemArchitectureDiagram: React.FC<SystemArchitectureDiagramProps> = ({ repositoryData }) => {
  const handleNodeClick = (filePath: string | null) => {
    if (filePath) {
      // In a real implementation, this would open the file in an editor or navigate to it
      console.log(`Opening file: ${filePath}`);
      alert(`This would open: ${filePath}\n\n(In a real implementation, this would redirect to the code file)`);
    } else {
      alert("This is an external service - no local file to view");
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
          Interactive system architecture diagram - click on components to view their code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] bg-gradient-to-br from-background to-accent/5 rounded-lg border overflow-auto">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {connections.map((connection, index) => (
              <ConnectionLine
                key={index}
                from={connection.from}
                to={connection.to}
              />
            ))}
          </svg>

          {/* Architecture Nodes */}
          <div className="relative" style={{ zIndex: 2, minWidth: '1100px', minHeight: '450px' }}>
            {architectureNodes.map((node) => (
              <ArchitectureNodeComponent
                key={node.id}
                node={node}
                onNodeClick={handleNodeClick}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-sm">Frontend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm">Services</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-sm">External</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-sm">Configuration</span>
          </div>
        </div>

        {repositoryData && (
          <div className="mt-4 p-4 bg-accent/10 rounded-lg">
            <h4 className="font-semibold mb-2">Repository Analysis</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Files:</span>
                <span className="ml-2 font-medium">{repositoryData.tree?.length || 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Commits:</span>
                <span className="ml-2 font-medium">{repositoryData.commits?.length || 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Branches:</span>
                <span className="ml-2 font-medium">{repositoryData.branches?.length || 1}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Contributors:</span>
                <span className="ml-2 font-medium">{repositoryData.contributors?.length || 1}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
