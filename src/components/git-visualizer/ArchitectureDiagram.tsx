
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder, FileText, Code, Package, Settings, GitBranch } from "lucide-react";

interface ArchitectureDiagramProps {
  repositoryData?: any;
}

interface FileNode {
  name: string;
  type: "folder" | "file";
  path: string;
  extension?: string;
  children?: FileNode[];
}

const getFileIcon = (extension: string) => {
  switch (extension) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return <Code className="w-4 h-4 text-blue-500" />;
    case "json":
      return <Settings className="w-4 h-4 text-yellow-500" />;
    case "md":
      return <FileText className="w-4 h-4 text-gray-500" />;
    case "css":
    case "scss":
      return <FileText className="w-4 h-4 text-purple-500" />;
    default:
      return <FileText className="w-4 h-4 text-gray-400" />;
  }
};

const getFileTypeColor = (extension: string) => {
  switch (extension) {
    case "js":
    case "jsx":
      return "bg-yellow-100 border-yellow-300 text-yellow-800";
    case "ts":
    case "tsx":
      return "bg-blue-100 border-blue-300 text-blue-800";
    case "json":
      return "bg-orange-100 border-orange-300 text-orange-800";
    case "css":
    case "scss":
      return "bg-purple-100 border-purple-300 text-purple-800";
    case "md":
      return "bg-gray-100 border-gray-300 text-gray-800";
    default:
      return "bg-slate-100 border-slate-300 text-slate-800";
  }
};

const processRepositoryStructure = (tree: any[]): FileNode[] => {
  if (!tree || tree.length === 0) return [];
  
  const root: { [key: string]: FileNode } = {};
  
  tree.forEach((item: any) => {
    if (!item.path) return;
    
    const parts = item.path.split('/');
    let current = root;
    
    parts.forEach((part: string, index: number) => {
      const isFile = index === parts.length - 1 && item.type === 'blob';
      const extension = isFile ? part.split('.').pop() || '' : '';
      
      if (!current[part]) {
        current[part] = {
          name: part,
          type: isFile ? 'file' : 'folder',
          path: parts.slice(0, index + 1).join('/'),
          extension: isFile ? extension : undefined,
          children: isFile ? undefined : []
        };
      }
      
      if (!isFile && current[part].children) {
        current = current[part].children.reduce((acc: any, child: FileNode) => {
          acc[child.name] = child;
          return acc;
        }, {});
      }
    });
  });
  
  const convertToArray = (obj: any): FileNode[] => {
    return Object.values(obj).map((node: any) => ({
      ...node,
      children: node.children && node.children.length > 0 ? convertToArray(node.children) : undefined
    }));
  };
  
  return convertToArray(root);
};

const FileNodeComponent: React.FC<{ node: FileNode; level: number }> = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = React.useState(level < 2);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="select-none"
    >
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-accent/50 ${
          node.type === 'file' ? getFileTypeColor(node.extension || '') : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => node.children && setIsExpanded(!isExpanded)}
      >
        {node.type === 'folder' ? (
          <>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <GitBranch className="w-3 h-3" />
            </motion.div>
            <Folder className="w-4 h-4 text-blue-600" />
          </>
        ) : (
          <>
            <div className="w-3" />
            {getFileIcon(node.extension || '')}
          </>
        )}
        <span className="text-sm font-medium">{node.name}</span>
        {node.type === 'file' && node.extension && (
          <Badge variant="secondary" className="text-xs px-1 py-0">
            {node.extension}
          </Badge>
        )}
      </div>
      
      {node.children && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {node.children.map((child) => (
            <FileNodeComponent
              key={child.path}
              node={child}
              level={level + 1}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ repositoryData }) => {
  const structure = React.useMemo(() => {
    return repositoryData?.tree ? processRepositoryStructure(repositoryData.tree) : [];
  }, [repositoryData]);

  const stats = React.useMemo(() => {
    if (!repositoryData?.tree) return { folders: 0, files: 0, types: [] };
    
    let folders = 0;
    let files = 0;
    const extensions = new Set<string>();
    
    repositoryData.tree.forEach((item: any) => {
      if (item.type === 'tree') {
        folders++;
      } else if (item.type === 'blob') {
        files++;
        const ext = item.path?.split('.').pop();
        if (ext && ext.length < 5) {
          extensions.add(ext);
        }
      }
    });
    
    return {
      folders,
      files,
      types: Array.from(extensions).slice(0, 8)
    };
  }, [repositoryData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Repository Structure
        </CardTitle>
        <CardDescription>
          Interactive file tree and architecture overview
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-accent/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.folders}</div>
            <div className="text-sm text-muted-foreground">Folders</div>
          </div>
          <div className="text-center p-3 bg-accent/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.files}</div>
            <div className="text-sm text-muted-foreground">Files</div>
          </div>
          <div className="text-center p-3 bg-accent/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.types.length}</div>
            <div className="text-sm text-muted-foreground">File Types</div>
          </div>
        </div>

        {/* File Types */}
        {stats.types.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">File Types</h4>
            <div className="flex flex-wrap gap-2">
              {stats.types.map((type) => (
                <Badge key={type} variant="outline" className="flex items-center gap-1">
                  {getFileIcon(type)}
                  .{type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Repository Structure */}
        <div className="border rounded-lg p-4 bg-card max-h-96 overflow-y-auto">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" />
            File Tree
          </h4>
          {structure.length > 0 ? (
            <div className="space-y-1">
              {structure.map((node) => (
                <FileNodeComponent
                  key={node.path}
                  node={node}
                  level={0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No repository structure available</p>
              <p className="text-sm">Import a repository to see the file tree</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
