
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Globe, Zap, Code, GitBranch } from "lucide-react";

interface ArchitectureDiagramProps {
  repositoryData?: any;
}

interface ComponentNode {
  id: string;
  name: string;
  type: "frontend" | "backend" | "database" | "service";
  description?: string;
  technologies?: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const mockArchitecture: ComponentNode[] = [
  {
    id: "react-client",
    name: "React Client",
    type: "frontend",
    description: "Main frontend application",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    position: { x: 50, y: 50 },
    size: { width: 200, height: 80 }
  },
  {
    id: "api-gateway",
    name: "API Gateway",
    type: "backend",
    description: "Request routing and authentication",
    technologies: ["Node.js", "Express"],
    position: { x: 300, y: 50 },
    size: { width: 180, height: 80 }
  },
  {
    id: "auth-service",
    name: "Auth Service",
    type: "service",
    description: "Authentication and authorization",
    technologies: ["JWT", "OAuth"],
    position: { x: 520, y: 50 },
    size: { width: 160, height: 80 }
  },
  {
    id: "database",
    name: "MongoDB",
    type: "database",
    description: "Primary data storage",
    technologies: ["MongoDB", "Mongoose"],
    position: { x: 300, y: 200 },
    size: { width: 160, height: 80 }
  },
  {
    id: "git-service",
    name: "Git Service",
    type: "service",
    description: "Repository analysis",
    technologies: ["GitHub API", "Git"],
    position: { x: 520, y: 200 },
    size: { width: 160, height: 80 }
  }
];

const connections = [
  { from: "react-client", to: "api-gateway", type: "HTTP" },
  { from: "api-gateway", to: "auth-service", type: "API" },
  { from: "api-gateway", to: "database", type: "Query" },
  { from: "api-gateway", to: "git-service", type: "API" }
];

const getComponentIcon = (type: string) => {
  switch (type) {
    case "frontend":
      return <Globe className="w-5 h-5" />;
    case "backend":
      return <Server className="w-5 h-5" />;
    case "database":
      return <Database className="w-5 h-5" />;
    case "service":
      return <Zap className="w-5 h-5" />;
    default:
      return <Code className="w-5 h-5" />;
  }
};

const getComponentColor = (type: string) => {
  switch (type) {
    case "frontend":
      return "bg-blue-100 border-blue-300 text-blue-800";
    case "backend":
      return "bg-green-100 border-green-300 text-green-800";
    case "database":
      return "bg-purple-100 border-purple-300 text-purple-800";
    case "service":
      return "bg-orange-100 border-orange-300 text-orange-800";
    default:
      return "bg-gray-100 border-gray-300 text-gray-800";
  }
};

const ComponentBox: React.FC<{ component: ComponentNode; index: number }> = ({ component, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`absolute rounded-lg border-2 p-4 ${getComponentColor(component.type)}`}
      style={{
        left: component.position.x,
        top: component.position.y,
        width: component.size.width,
        height: component.size.height
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {getComponentIcon(component.type)}
        <h4 className="font-semibold text-sm">{component.name}</h4>
      </div>
      {component.description && (
        <p className="text-xs opacity-80 mb-2">{component.description}</p>
      )}
      {component.technologies && (
        <div className="flex flex-wrap gap-1">
          {component.technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs px-1 py-0">
              {tech}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const ConnectionLine: React.FC<{ 
  from: ComponentNode; 
  to: ComponentNode; 
  type: string;
  index: number;
}> = ({ from, to, type, index }) => {
  const startX = from.position.x + from.size.width / 2;
  const startY = from.position.y + from.size.height / 2;
  const endX = to.position.x + to.size.width / 2;
  const endY = to.position.y + to.size.height / 2;

  return (
    <motion.g
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeDasharray="5,5"
        markerEnd="url(#arrowhead)"
      />
      <text
        x={(startX + endX) / 2}
        y={(startY + endY) / 2 - 10}
        textAnchor="middle"
        className="text-xs fill-current text-muted-foreground"
      >
        {type}
      </text>
    </motion.g>
  );
};

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ repositoryData }) => {
  const architecture = repositoryData?.architecture || mockArchitecture;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          System Architecture
        </CardTitle>
        <CardDescription>
          Visual representation of the repository's system architecture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-96 bg-gradient-to-br from-background to-accent/5 rounded-lg border overflow-hidden">
          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="hsl(var(--primary))"
                />
              </marker>
            </defs>
            {connections.map((connection, index) => {
              const fromComponent = architecture.find(c => c.id === connection.from);
              const toComponent = architecture.find(c => c.id === connection.to);
              
              if (!fromComponent || !toComponent) return null;
              
              return (
                <ConnectionLine
                  key={`${connection.from}-${connection.to}`}
                  from={fromComponent}
                  to={toComponent}
                  type={connection.type}
                  index={index}
                />
              );
            })}
          </svg>

          {/* Components */}
          {architecture.map((component, index) => (
            <ComponentBox key={component.id} component={component} index={index} />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Frontend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Backend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
            <span>Database</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
            <span>Service</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
