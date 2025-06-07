
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  lastModified: string;
  children?: FileNode[];
  path: string;
}

const mockFileTree: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    lastModified: "2024-01-15",
    path: "src",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        lastModified: "2024-01-14",
        path: "src/components",
        children: [
          {
            id: "3",
            name: "Button.tsx",
            type: "file",
            size: 1240,
            lastModified: "2024-01-13",
            path: "src/components/Button.tsx"
          },
          {
            id: "4",
            name: "Modal.tsx",
            type: "file",
            size: 2300,
            lastModified: "2024-01-12",
            path: "src/components/Modal.tsx"
          }
        ]
      },
      {
        id: "5",
        name: "utils",
        type: "folder",
        lastModified: "2024-01-11",
        path: "src/utils",
        children: [
          {
            id: "6",
            name: "helpers.ts",
            type: "file",
            size: 890,
            lastModified: "2024-01-10",
            path: "src/utils/helpers.ts"
          }
        ]
      },
      {
        id: "7",
        name: "App.tsx",
        type: "file",
        size: 1560,
        lastModified: "2024-01-15",
        path: "src/App.tsx"
      }
    ]
  },
  {
    id: "8",
    name: "public",
    type: "folder",
    lastModified: "2024-01-08",
    path: "public",
    children: [
      {
        id: "9",
        name: "index.html",
        type: "file",
        size: 450,
        lastModified: "2024-01-08",
        path: "public/index.html"
      }
    ]
  },
  {
    id: "10",
    name: "package.json",
    type: "file",
    size: 1200,
    lastModified: "2024-01-15",
    path: "package.json"
  },
  {
    id: "11",
    name: "README.md",
    type: "file",
    size: 2800,
    lastModified: "2024-01-14",
    path: "README.md"
  }
];

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const iconClass = "w-4 h-4";
  
  switch (extension) {
    case 'tsx':
    case 'ts':
      return <File className={cn(iconClass, "text-blue-500")} />;
    case 'js':
    case 'jsx':
      return <File className={cn(iconClass, "text-yellow-500")} />;
    case 'json':
      return <File className={cn(iconClass, "text-green-500")} />;
    case 'md':
      return <File className={cn(iconClass, "text-gray-600")} />;
    case 'html':
      return <File className={cn(iconClass, "text-orange-500")} />;
    default:
      return <File className={cn(iconClass, "text-gray-500")} />;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  onSelect: (node: FileNode) => void;
  selectedFile: string | null;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ node, level, onSelect, selectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const handleToggle = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded);
    }
    onSelect(node);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: level * 0.05 }}
        className={cn(
          "flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer transition-colors",
          "hover:bg-accent/50",
          selectedFile === node.id && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {node.type === "folder" && (
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )}
        
        {node.type === "folder" ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-blue-400" />
          ) : (
            <Folder className="w-4 h-4 text-blue-400" />
          )
        ) : (
          getFileIcon(node.name)
        )}
        
        <span className="text-sm font-medium truncate flex-1">{node.name}</span>
        
        {node.type === "file" && node.size && (
          <span className="text-xs text-muted-foreground">
            {formatFileSize(node.size)}
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {node.type === "folder" && isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <FileTreeNode
                key={child.id}
                node={child}
                level={level + 1}
                onSelect={onSelect}
                selectedFile={selectedFile}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FileTreeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileSelect = (node: FileNode) => {
    setSelectedFile(node.id);
    console.log("Selected file:", node);
  };

  const filteredTree = mockFileTree; // TODO: Implement search filtering

  return (
    <div className="h-full flex flex-col bg-card border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg mb-3">Repository Structure</h3>
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredTree.map((node) => (
            <FileTreeNode
              key={node.id}
              node={node}
              level={0}
              onSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
