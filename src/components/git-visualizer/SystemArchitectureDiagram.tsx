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

const analyzeRepositoryStructure = (repositoryData: any) => {
  if (!repositoryData?.tree) return null;

  const analysis = {
    // Frontend Technologies
    hasReact: false,
    hasVue: false,
    hasAngular: false,
    hasTypeScript: false,
    hasNextJS: false,
    hasNuxt: false,
    hasGatsby: false,
    hasVite: false,
    hasWebpack: false,
    hasParcel: false,
    
    // Styling & UI
    hasTailwind: false,
    hasBootstrap: false,
    hasStyledComponents: false,
    hasSass: false,
    hasLess: false,
    hasChakraUI: false,
    hasMaterialUI: false,
    hasAntDesign: false,
    
    // Backend Technologies
    hasNodeJS: false,
    hasExpress: false,
    hasKoa: false,
    hasFastify: false,
    hasPython: false,
    hasDjango: false,
    hasFlask: false,
    hasRuby: false,
    hasRails: false,
    hasPhp: false,
    hasLaravel: false,
    hasJava: false,
    hasSpring: false,
    
    // Databases
    hasDatabase: false,
    hasPrisma: false,
    hasSequelize: false,
    hasMongoose: false,
    hasTypeORM: false,
    hasMySQL: false,
    hasPostgreSQL: false,
    hasMongoDB: false,
    hasRedis: false,
    hasSQLite: false,
    
    // APIs & Services
    hasAPI: false,
    hasGraphQL: false,
    hasREST: false,
    hasWebSockets: false,
    hasMicroservices: false,
    hasServerless: false,
    
    // State Management
    hasRedux: false,
    hasZustand: false,
    hasRecoil: false,
    hasVuex: false,
    hasPinia: false,
    
    // Testing
    hasTests: false,
    hasJest: false,
    hasCypress: false,
    hasPlaywright: false,
    hasVitest: false,
    hasTesting: false,
    
    // DevOps & Infrastructure
    hasDocker: false,
    hasKubernetes: false,
    hasCI: false,
    hasVercel: false,
    hasNetlify: false,
    hasAWS: false,
    hasGCP: false,
    hasAzure: false,
    hasHeroku: false,
    
    // Development Tools
    hasESLint: false,
    hasPrettier: false,
    hasHusky: false,
    hasStorybook: false,
    
    // Additional Analysis
    architecture: 'monolith',
    complexity: 'simple',
    scale: 'small',
    patterns: [] as string[],
    
    // File categorization
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
  let totalFiles = 0;
  let jsFiles = 0;
  let tsFiles = 0;
  let componentCount = 0;
  let serviceCount = 0;

  repositoryData.tree.forEach((item: any) => {
    const path = item.path.toLowerCase();
    const fileName = path.split('/').pop() || '';
    const extension = fileName.split('.').pop() || '';
    const directory = path.split('/')[0];
    
    totalFiles++;

    // Count files in directories
    fileStructure[directory] = (fileStructure[directory] || 0) + 1;

    // Enhanced technology detection with more patterns
    
    // Frontend Frameworks
    if (extension === 'tsx' || extension === 'jsx' || fileName.includes('react') || path.includes('react')) {
      analysis.hasReact = true;
      analysis.framework = 'React';
    }
    if (fileName.includes('vue') || extension === 'vue' || path.includes('vue')) {
      analysis.hasVue = true;
      analysis.framework = 'Vue.js';
    }
    if (fileName.includes('angular') || path.includes('angular') || fileName === 'angular.json') {
      analysis.hasAngular = true;
      analysis.framework = 'Angular';
    }
    
    // Build Tools & Meta Frameworks
    if (fileName === 'next.config.js' || fileName === 'next.config.ts' || path.includes('next')) {
      analysis.hasNextJS = true;
      analysis.framework = 'Next.js';
    }
    if (fileName === 'nuxt.config.js' || fileName === 'nuxt.config.ts') {
      analysis.hasNuxt = true;
      analysis.framework = 'Nuxt.js';
    }
    if (fileName === 'gatsby-config.js' || fileName === 'gatsby-node.js') {
      analysis.hasGatsby = true;
      analysis.framework = 'Gatsby';
    }
    if (fileName === 'vite.config.js' || fileName === 'vite.config.ts') {
      analysis.hasVite = true;
    }
    if (fileName === 'webpack.config.js' || fileName.includes('webpack')) {
      analysis.hasWebpack = true;
    }
    
    // Languages
    if (extension === 'ts' || extension === 'tsx') {
      analysis.hasTypeScript = true;
      tsFiles++;
    }
    if (extension === 'js' || extension === 'jsx') {
      jsFiles++;
    }
    
    // Styling Technologies
    if (fileName === 'tailwind.config.js' || fileName === 'tailwind.config.ts' || path.includes('tailwind')) {
      analysis.hasTailwind = true;
    }
    if (fileName.includes('bootstrap') || path.includes('bootstrap')) {
      analysis.hasBootstrap = true;
    }
    if (fileName.includes('styled-components') || path.includes('styled')) {
      analysis.hasStyledComponents = true;
    }
    if (extension === 'scss' || extension === 'sass') {
      analysis.hasSass = true;
    }
    if (extension === 'less') {
      analysis.hasLess = true;
    }
    
    // Backend Technologies
    if (fileName === 'package.json' || fileName === 'server.js' || fileName === 'app.js' || path.includes('node')) {
      analysis.hasNodeJS = true;
    }
    if (fileName.includes('express') || path.includes('express')) {
      analysis.hasExpress = true;
    }
    if (fileName.includes('koa') || path.includes('koa')) {
      analysis.hasKoa = true;
    }
    if (extension === 'py' || fileName.includes('python')) {
      analysis.hasPython = true;
    }
    if (fileName.includes('django') || path.includes('django')) {
      analysis.hasDjango = true;
    }
    if (fileName.includes('flask') || path.includes('flask')) {
      analysis.hasFlask = true;
    }
    
    // Databases & ORMs
    if (fileName === 'schema.prisma' || path.includes('prisma')) {
      analysis.hasPrisma = true;
      analysis.hasDatabase = true;
    }
    if (fileName.includes('sequelize') || path.includes('sequelize')) {
      analysis.hasSequelize = true;
      analysis.hasDatabase = true;
    }
    if (fileName.includes('mongoose') || path.includes('mongoose')) {
      analysis.hasMongoose = true;
      analysis.hasMongoDB = true;
      analysis.hasDatabase = true;
    }
    if (fileName.includes('typeorm') || path.includes('typeorm')) {
      analysis.hasTypeORM = true;
      analysis.hasDatabase = true;
    }
    
    // APIs & Communication
    if (path.includes('api') || path.includes('endpoint') || fileName.includes('api')) {
      analysis.hasAPI = true;
      analysis.hasREST = true;
    }
    if (fileName.includes('graphql') || extension === 'graphql' || path.includes('graphql')) {
      analysis.hasGraphQL = true;
    }
    if (fileName.includes('websocket') || fileName.includes('socket') || path.includes('socket')) {
      analysis.hasWebSockets = true;
    }
    
    // State Management
    if (path.includes('redux') || fileName.includes('redux') || path.includes('store')) {
      analysis.hasRedux = true;
    }
    if (fileName.includes('zustand') || path.includes('zustand')) {
      analysis.hasZustand = true;
    }
    if (fileName.includes('recoil') || path.includes('recoil')) {
      analysis.hasRecoil = true;
    }
    
    // Testing
    if (path.includes('test') || path.includes('spec') || extension.includes('test') || extension.includes('spec')) {
      analysis.hasTests = true;
    }
    if (fileName.includes('jest') || path.includes('jest')) {
      analysis.hasJest = true;
      analysis.hasTesting = true;
    }
    if (fileName.includes('cypress') || path.includes('cypress')) {
      analysis.hasCypress = true;
      analysis.hasTesting = true;
    }
    if (fileName.includes('playwright') || path.includes('playwright')) {
      analysis.hasPlaywright = true;
      analysis.hasTesting = true;
    }
    
    // DevOps & Infrastructure
    if (fileName === 'dockerfile' || fileName === 'docker-compose.yml' || path.includes('docker')) {
      analysis.hasDocker = true;
    }
    if (fileName.includes('kubernetes') || fileName.includes('k8s') || path.includes('k8s')) {
      analysis.hasKubernetes = true;
    }
    if (path.includes('.github') || fileName.includes('ci') || fileName.includes('pipeline') || fileName.includes('workflow')) {
      analysis.hasCI = true;
    }
    if (fileName === 'vercel.json' || path.includes('vercel')) {
      analysis.hasVercel = true;
    }
    if (fileName === 'netlify.toml' || path.includes('netlify')) {
      analysis.hasNetlify = true;
    }
    
    // Development Tools
    if (fileName === '.eslintrc' || fileName === 'eslint.config.js' || fileName.includes('eslint')) {
      analysis.hasESLint = true;
    }
    if (fileName === '.prettierrc' || fileName === 'prettier.config.js' || fileName.includes('prettier')) {
      analysis.hasPrettier = true;
    }
    if (path.includes('storybook') || fileName.includes('stories') || fileName.includes('storybook')) {
      analysis.hasStorybook = true;
    }

    // Categorize files for counting
    if (path.includes('component') || (extension === 'tsx' && !path.includes('page') && !path.includes('layout'))) {
      analysis.components.push(fileName);
      componentCount++;
    }
    if (path.includes('service') || path.includes('lib') || path.includes('util') || path.includes('helper')) {
      analysis.services.push(fileName);
      serviceCount++;
    }
    if (extension === 'json' || extension === 'yml' || extension === 'yaml' || extension === 'env') {
      analysis.configs.push(fileName);
    }
    if (extension === 'css' || extension === 'scss' || extension === 'sass' || extension === 'less') {
      analysis.styles.push(fileName);
    }
    if (path.includes('asset') || path.includes('image') || path.includes('static') || path.includes('public')) {
      analysis.assets.push(fileName);
    }
    if (extension === 'md' || extension === 'txt' || path.includes('doc') || path.includes('readme')) {
      analysis.docs.push(fileName);
    }
  });

  // Determine architecture patterns
  if (serviceCount > 10 || analysis.hasKubernetes || analysis.hasMicroservices) {
    analysis.architecture = 'microservices';
    analysis.patterns.push('Microservices');
  } else if (analysis.hasAPI && analysis.hasDatabase) {
    analysis.architecture = 'layered';
    analysis.patterns.push('Layered Architecture');
  }

  if (analysis.hasRedux || analysis.hasZustand || analysis.hasRecoil) {
    analysis.patterns.push('State Management');
  }
  
  if (analysis.hasGraphQL) {
    analysis.patterns.push('GraphQL API');
  } else if (analysis.hasREST) {
    analysis.patterns.push('REST API');
  }

  if (analysis.hasTests || analysis.hasTesting) {
    analysis.patterns.push('Test-Driven Development');
  }

  if (analysis.hasDocker || analysis.hasKubernetes) {
    analysis.patterns.push('Containerization');
  }

  // Determine complexity
  if (totalFiles > 100 || componentCount > 20 || serviceCount > 10) {
    analysis.complexity = 'complex';
    analysis.scale = 'large';
  } else if (totalFiles > 50 || componentCount > 10) {
    analysis.complexity = 'moderate';
    analysis.scale = 'medium';
  }

  return { analysis, fileStructure, stats: { totalFiles, jsFiles, tsFiles, componentCount, serviceCount } };
};

const generateAdvancedMermaidDiagram = (repositoryData: any): string => {
  const result = analyzeRepositoryStructure(repositoryData);
  if (!result) return '';

  const { analysis } = result;

  // Create a comprehensive architecture diagram
  let mermaidCode = `flowchart TB
    %% Define comprehensive styles for better visual hierarchy
    classDef userLayer fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#0d47a1
    classDef frontendLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#4a148c
    classDef backendLayer fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#1b5e20
    classDef dataLayer fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#e65100
    classDef infraLayer fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#880e4f
    classDef apiLayer fill:#e0f2f1,stroke:#00695c,stroke-width:2px,color:#004d40
    classDef toolLayer fill:#f1f8e9,stroke:#558b2f,stroke-width:2px,color:#33691e
    classDef securityLayer fill:#ffebee,stroke:#d32f2f,stroke-width:2px,color:#b71c1c

`;

  let nodeId = 1;
  const nodes: { [key: string]: string } = {};

  // User Layer
  const userNode = `U${nodeId++}`;
  nodes['user'] = userNode;
  mermaidCode += `    ${userNode}["👥 Users"]:::userLayer\n`;

  // Frontend Layer - More sophisticated detection
  if (analysis.hasReact || analysis.hasVue || analysis.hasAngular || analysis.hasNextJS) {
    const frontendNode = `F${nodeId++}`;
    nodes['frontend'] = frontendNode;
    
    let frontendTech = 'Frontend';
    if (analysis.hasNextJS) frontendTech = '⚡ Next.js App';
    else if (analysis.hasReact) frontendTech = '⚛️ React App';
    else if (analysis.hasVue) frontendTech = '💚 Vue.js App';
    else if (analysis.hasAngular) frontendTech = '🅰️ Angular App';
    
    mermaidCode += `    ${frontendNode}["${frontendTech}"]:::frontendLayer\n`;
  }

  // UI/Styling Layer
  if (analysis.hasTailwind || analysis.hasBootstrap || analysis.hasStyledComponents || analysis.styles.length > 0) {
    const stylingNode = `S${nodeId++}`;
    nodes['styling'] = stylingNode;
    
    let stylingTech = '🎨 Styling';
    if (analysis.hasTailwind) stylingTech = '🎨 Tailwind CSS';
    else if (analysis.hasBootstrap) stylingTech = '🎨 Bootstrap';
    else if (analysis.hasStyledComponents) stylingTech = '🎨 Styled Components';
    
    mermaidCode += `    ${stylingNode}["${stylingTech}"]:::frontendLayer\n`;
  }

  // State Management
  if (analysis.hasRedux || analysis.hasZustand || analysis.hasRecoil) {
    const stateNode = `ST${nodeId++}`;
    nodes['state'] = stateNode;
    
    let stateTech = '🔄 State Management';
    if (analysis.hasRedux) stateTech = '🔄 Redux Store';
    else if (analysis.hasZustand) stateTech = '🔄 Zustand Store';
    else if (analysis.hasRecoil) stateTech = '🔄 Recoil State';
    
    mermaidCode += `    ${stateNode}["${stateTech}"]:::frontendLayer\n`;
  }

  // API Gateway/Layer
  if (analysis.hasAPI || analysis.hasGraphQL) {
    const apiNode = `A${nodeId++}`;
    nodes['api'] = apiNode;
    
    let apiTech = '🌐 API Layer';
    if (analysis.hasGraphQL) apiTech = '🌐 GraphQL API';
    else if (analysis.hasREST) apiTech = '🌐 REST API';
    
    mermaidCode += `    ${apiNode}["${apiTech}"]:::apiLayer\n`;
  }

  // Backend Services
  if (analysis.hasNodeJS || analysis.hasExpress || analysis.hasPython || analysis.hasJava) {
    const backendNode = `B${nodeId++}`;
    nodes['backend'] = backendNode;
    
    let backendTech = '⚙️ Backend Services';
    if (analysis.hasExpress) backendTech = '⚙️ Express.js Server';
    else if (analysis.hasKoa) backendTech = '⚙️ Koa.js Server';
    else if (analysis.hasDjango) backendTech = '⚙️ Django Server';
    else if (analysis.hasFlask) backendTech = '⚙️ Flask Server';
    else if (analysis.hasNodeJS) backendTech = '⚙️ Node.js Server';
    
    mermaidCode += `    ${backendNode}["${backendTech}"]:::backendLayer\n`;
  }

  // Business Logic/Services
  if (analysis.services.length > 0) {
    const servicesNode = `SV${nodeId++}`;
    nodes['services'] = servicesNode;
    mermaidCode += `    ${servicesNode}["🔧 Business Logic<br/>(${analysis.services.length} services)"]:::backendLayer\n`;
  }

  // Database Layer with ORM
  if (analysis.hasPrisma || analysis.hasSequelize || analysis.hasTypeORM || analysis.hasMongoose) {
    const ormNode = `O${nodeId++}`;
    nodes['orm'] = ormNode;
    
    let ormTech = '🗃️ ORM Layer';
    if (analysis.hasPrisma) ormTech = '🗃️ Prisma ORM';
    else if (analysis.hasSequelize) ormTech = '🗃️ Sequelize ORM';
    else if (analysis.hasTypeORM) ormTech = '🗃️ TypeORM';
    else if (analysis.hasMongoose) ormTech = '🗃️ Mongoose ODM';
    
    mermaidCode += `    ${ormNode}["${ormTech}"]:::dataLayer\n`;
  }

  // Database
  if (analysis.hasDatabase || analysis.hasMongoDB || analysis.hasMySQL || analysis.hasPostgreSQL) {
    const dbNode = `DB${nodeId++}`;
    nodes['database'] = dbNode;
    
    let dbTech = '🗄️ Database';
    if (analysis.hasMongoDB) dbTech = '🗄️ MongoDB';
    else if (analysis.hasMySQL) dbTech = '🗄️ MySQL';
    else if (analysis.hasPostgreSQL) dbTech = '🗄️ PostgreSQL';
    
    mermaidCode += `    ${dbNode}["${dbTech}"]:::dataLayer\n`;
  }

  // Caching Layer
  if (analysis.hasRedis) {
    const cacheNode = `C${nodeId++}`;
    nodes['cache'] = cacheNode;
    mermaidCode += `    ${cacheNode}["⚡ Redis Cache"]:::dataLayer\n`;
  }

  // Build Tools
  if (analysis.hasVite || analysis.hasWebpack || analysis.hasParcel) {
    const buildNode = `BT${nodeId++}`;
    nodes['build'] = buildNode;
    
    let buildTech = '🔨 Build Tools';
    if (analysis.hasVite) buildTech = '⚡ Vite';
    else if (analysis.hasWebpack) buildTech = '📦 Webpack';
    else if (analysis.hasParcel) buildTech = '📦 Parcel';
    
    mermaidCode += `    ${buildNode}["${buildTech}"]:::toolLayer\n`;
  }

  // Testing Infrastructure
  if (analysis.hasTests || analysis.hasTesting) {
    const testNode = `T${nodeId++}`;
    nodes['testing'] = testNode;
    
    let testTech = '🧪 Testing';
    if (analysis.hasJest) testTech = '🧪 Jest Testing';
    else if (analysis.hasCypress) testTech = '🧪 Cypress E2E';
    else if (analysis.hasPlaywright) testTech = '🧪 Playwright Testing';
    
    mermaidCode += `    ${testNode}["${testTech}"]:::toolLayer\n`;
  }

  // DevOps & Infrastructure
  if (analysis.hasDocker || analysis.hasKubernetes) {
    const infraNode = `I${nodeId++}`;
    nodes['infrastructure'] = infraNode;
    
    let infraTech = '🐳 Infrastructure';
    if (analysis.hasKubernetes) infraTech = '☸️ Kubernetes';
    else if (analysis.hasDocker) infraTech = '🐳 Docker';
    
    mermaidCode += `    ${infraNode}["${infraTech}"]:::infraLayer\n`;
  }

  // CI/CD Pipeline
  if (analysis.hasCI) {
    const ciNode = `CI${nodeId++}`;
    nodes['cicd'] = ciNode;
    mermaidCode += `    ${ciNode}["🚀 CI/CD Pipeline"]:::infraLayer\n`;
  }

  // Security Layer
  if (analysis.hasESLint || analysis.hasPrettier) {
    const securityNode = `SEC${nodeId++}`;
    nodes['security'] = securityNode;
    mermaidCode += `    ${securityNode}["🔒 Code Quality<br/>ESLint • Prettier"]:::securityLayer\n`;
  }

  // Documentation
  if (analysis.hasStorybook || analysis.docs.length > 0) {
    const docsNode = `DOC${nodeId++}`;
    nodes['docs'] = docsNode;
    
    let docsTech = '📚 Documentation';
    if (analysis.hasStorybook) docsTech = '📚 Storybook';
    
    mermaidCode += `    ${docsNode}["${docsTech}"]:::toolLayer\n`;
  }

  // Add sophisticated connections with data flow
  mermaidCode += '\n    %% Data Flow Connections\n';
  
  // User to Frontend
  if (nodes['user'] && nodes['frontend']) {
    mermaidCode += `    ${nodes['user']} -->|"HTTP Requests"| ${nodes['frontend']}\n`;
  }
  
  // Frontend connections
  if (nodes['frontend']) {
    if (nodes['styling']) {
      mermaidCode += `    ${nodes['frontend']} -.->|"Styling"| ${nodes['styling']}\n`;
    }
    if (nodes['state']) {
      mermaidCode += `    ${nodes['frontend']} <-->|"State Updates"| ${nodes['state']}\n`;
    }
    if (nodes['api']) {
      mermaidCode += `    ${nodes['frontend']} <-->|"API Calls"| ${nodes['api']}\n`;
    }
  }
  
  // API to Backend
  if (nodes['api'] && nodes['backend']) {
    mermaidCode += `    ${nodes['api']} <-->|"Business Logic"| ${nodes['backend']}\n`;
  }
  
  // Backend to Services
  if (nodes['backend'] && nodes['services']) {
    mermaidCode += `    ${nodes['backend']} -->|"Service Calls"| ${nodes['services']}\n`;
  }
  
  // Services to ORM
  if (nodes['services'] && nodes['orm']) {
    mermaidCode += `    ${nodes['services']} <-->|"Data Queries"| ${nodes['orm']}\n`;
  }
  
  // ORM to Database
  if (nodes['orm'] && nodes['database']) {
    mermaidCode += `    ${nodes['orm']} <-->|"SQL/NoSQL"| ${nodes['database']}\n`;
  }
  
  // Direct Backend to Database (if no ORM)
  if (nodes['backend'] && nodes['database'] && !nodes['orm']) {
    mermaidCode += `    ${nodes['backend']} <-->|"Direct DB Access"| ${nodes['database']}\n`;
  }
  
  // Cache connections
  if (nodes['cache']) {
    if (nodes['backend']) {
      mermaidCode += `    ${nodes['backend']} <-->|"Cache Layer"| ${nodes['cache']}\n`;
    }
    if (nodes['api']) {
      mermaidCode += `    ${nodes['api']} <-->|"Response Cache"| ${nodes['cache']}\n`;
    }
  }
  
  // Build tools
  if (nodes['build'] && nodes['frontend']) {
    mermaidCode += `    ${nodes['build']} -.->|"Builds"| ${nodes['frontend']}\n`;
  }
  
  // Testing connections
  if (nodes['testing']) {
    if (nodes['frontend']) {
      mermaidCode += `    ${nodes['testing']} -.->|"Tests"| ${nodes['frontend']}\n`;
    }
    if (nodes['backend']) {
      mermaidCode += `    ${nodes['testing']} -.->|"Tests"| ${nodes['backend']}\n`;
    }
  }
  
  // Infrastructure connections
  if (nodes['infrastructure']) {
    if (nodes['backend']) {
      mermaidCode += `    ${nodes['infrastructure']} -.->|"Containerizes"| ${nodes['backend']}\n`;
    }
    if (nodes['database']) {
      mermaidCode += `    ${nodes['infrastructure']} -.->|"Hosts"| ${nodes['database']}\n`;
    }
  }
  
  // CI/CD connections
  if (nodes['cicd']) {
    if (nodes['build']) {
      mermaidCode += `    ${nodes['cicd']} -.->|"Automated Build"| ${nodes['build']}\n`;
    }
    if (nodes['testing']) {
      mermaidCode += `    ${nodes['cicd']} -.->|"Runs Tests"| ${nodes['testing']}\n`;
    }
    if (nodes['infrastructure']) {
      mermaidCode += `    ${nodes['cicd']} -.->|"Deploys"| ${nodes['infrastructure']}\n`;
    }
  }
  
  // Security/Quality connections
  if (nodes['security']) {
    if (nodes['frontend']) {
      mermaidCode += `    ${nodes['security']} -.->|"Code Quality"| ${nodes['frontend']}\n`;
    }
    if (nodes['backend']) {
      mermaidCode += `    ${nodes['security']} -.->|"Code Quality"| ${nodes['backend']}\n`;
    }
  }
  
  // Documentation connections
  if (nodes['docs'] && nodes['frontend']) {
    mermaidCode += `    ${nodes['docs']} -.->|"Documents"| ${nodes['frontend']}\n`;
  }

  return mermaidCode;
};

const fixGithubUrl = (baseUrl: string, filePath: string): string => {
  if (!baseUrl || !filePath) return '';
  
  // Clean up the base URL
  let githubUrl = baseUrl.replace(/\/$/, '');
  
  // Convert API URL to regular GitHub URL
  if (githubUrl.includes('api.github.com/repos/')) {
    githubUrl = githubUrl.replace('api.github.com/repos/', 'github.com/');
  }
  
  // Build the proper GitHub file URL
  const cleanFilePath = filePath.replace(/^\//, '');
  return `${githubUrl}/blob/main/${cleanFilePath}`;
};

export const SystemArchitectureDiagram: React.FC<SystemArchitectureDiagramProps> = ({ repositoryData }) => {
  const { toast } = useToast();
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  const [diagramId] = useState(() => `mermaid-${Date.now()}`);

  const mermaidDiagram = useMemo(() => {
    return generateAdvancedMermaidDiagram(repositoryData);
  }, [repositoryData]);

  const architectureAnalysis = useMemo(() => {
    const result = analyzeRepositoryStructure(repositoryData);
    return result?.analysis;
  }, [repositoryData]);

  useEffect(() => {
    if (mermaidDiagram && mermaidRef.current) {
      // Initialize mermaid with enhanced configuration
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
          padding: 20,
          nodeSpacing: 50,
          rankSpacing: 80,
          diagramPadding: 20,
          useMaxWidth: true,
        },
        themeVariables: {
          primaryColor: '#f0f9ff',
          primaryTextColor: '#1e293b',
          primaryBorderColor: '#3b82f6',
          lineColor: '#64748b',
          sectionBkgColor: '#f8fafc',
          altSectionBkgColor: '#e2e8f0',
          gridColor: '#e2e8f0',
          secondaryColor: '#fef3c7',
          tertiaryColor: '#f0fdf4',
          background: '#ffffff',
          mainBkg: '#ffffff',
          secondBkg: '#f8fafc',
          tertiaryBkg: '#f1f5f9'
        }
      });

      // Clear previous content
      mermaidRef.current.innerHTML = '';
      
      // Render the diagram
      mermaid.render(diagramId, mermaidDiagram).then(({ svg }) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
          setMermaidLoaded(true);
        }
      }).catch((error) => {
        console.error('Mermaid rendering error:', error);
        console.log('Mermaid diagram code:', mermaidDiagram);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `
            <div class="text-center text-red-500 p-8">
              <p class="font-semibold">Error rendering diagram</p>
              <p class="text-sm mt-2">Check console for details</p>
              <details class="mt-4 text-left">
                <summary class="cursor-pointer">View diagram code</summary>
                <pre class="mt-2 p-4 bg-gray-100 text-xs overflow-auto">${mermaidDiagram}</pre>
              </details>
            </div>
          `;
        }
      });
    }
  }, [mermaidDiagram, diagramId]);

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
    if (!mermaidRef.current) {
      toast({
        title: "No diagram to download",
        description: "Please wait for the diagram to load",
        variant: "destructive",
      });
      return;
    }
    
    const svgElement = mermaidRef.current.querySelector('svg');
    if (svgElement) {
      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      
      // Set proper dimensions for download
      clonedSvg.setAttribute('width', '1200');
      clonedSvg.setAttribute('height', '800');
      clonedSvg.setAttribute('viewBox', clonedSvg.getAttribute('viewBox') || '0 0 1200 800');
      
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${repositoryData?.info?.name || 'repository'}-architecture.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Diagram Downloaded",
        description: "Architecture diagram saved as SVG file",
      });
    } else {
      toast({
        title: "Download failed",
        description: "No SVG diagram found to download",
        variant: "destructive",
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
          Advanced Mermaid.js architecture visualization - intelligently generated from deep repository analysis
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
              Import a repository to see its intelligent system architecture diagram
            </p>
            <Badge variant="outline" className="px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced Mermaid.js
            </Badge>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Mermaid Diagram */}
            <div className="relative w-full bg-gradient-to-br from-background via-accent/5 to-primary/5 rounded-xl border-2 border-border/50 p-6 overflow-auto">
              <div ref={mermaidRef} className="flex justify-center min-h-[500px] items-center" />
              {!mermaidLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Generating advanced architecture diagram...</p>
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

            {/* Enhanced Repository Insights */}
            {repositoryData && architectureAnalysis && (
              <div className="p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl border border-border/50">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Advanced Architecture Analysis
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {architectureAnalysis.framework}
                    </div>
                    <div className="text-xs text-muted-foreground">Framework</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {architectureAnalysis.architecture}
                    </div>
                    <div className="text-xs text-muted-foreground">Architecture</div>
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
                      {architectureAnalysis.complexity}
                    </div>
                    <div className="text-xs text-muted-foreground">Complexity</div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Technology Stack with Patterns */}
            {architectureAnalysis && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Architecture Patterns</h4>
                  <div className="flex flex-wrap gap-2">
                    {architectureAnalysis.patterns.map((pattern, index) => (
                      <Badge key={index} variant="default" className="bg-gradient-to-r from-primary to-primary/80">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Technology Stack</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Frontend Technologies */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-muted-foreground">Frontend</h5>
                      <div className="flex flex-wrap gap-2">
                        {architectureAnalysis.hasReact && <Badge variant="secondary">React</Badge>}
                        {architectureAnalysis.hasNextJS && <Badge variant="secondary">Next.js</Badge>}
                        {architectureAnalysis.hasVue && <Badge variant="secondary">Vue.js</Badge>}
                        {architectureAnalysis.hasAngular && <Badge variant="secondary">Angular</Badge>}
                        {architectureAnalysis.hasTypeScript && <Badge variant="secondary">TypeScript</Badge>}
                        {architectureAnalysis.hasTailwind && <Badge variant="secondary">Tailwind CSS</Badge>}
                        {architectureAnalysis.hasStyledComponents && <Badge variant="secondary">Styled Components</Badge>}
                      </div>
                    </div>
                    
                    {/* Backend Technologies */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-muted-foreground">Backend</h5>
                      <div className="flex flex-wrap gap-2">
                        {architectureAnalysis.hasNodeJS && <Badge variant="secondary">Node.js</Badge>}
                        {architectureAnalysis.hasExpress && <Badge variant="secondary">Express.js</Badge>}
                        {architectureAnalysis.hasPython && <Badge variant="secondary">Python</Badge>}
                        {architectureAnalysis.hasDjango && <Badge variant="secondary">Django</Badge>}
                        {architectureAnalysis.hasFlask && <Badge variant="secondary">Flask</Badge>}
                        {architectureAnalysis.hasGraphQL && <Badge variant="secondary">GraphQL</Badge>}
                      </div>
                    </div>
                    
                    {/* Infrastructure */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-muted-foreground">Infrastructure</h5>
                      <div className="flex flex-wrap gap-2">
                        {architectureAnalysis.hasPrisma && <Badge variant="secondary">Prisma</Badge>}
                        {architectureAnalysis.hasDocker && <Badge variant="secondary">Docker</Badge>}
                        {architectureAnalysis.hasKubernetes && <Badge variant="secondary">Kubernetes</Badge>}
                        {architectureAnalysis.hasVite && <Badge variant="secondary">Vite</Badge>}
                        {architectureAnalysis.hasRedux && <Badge variant="secondary">Redux</Badge>}
                        {architectureAnalysis.hasJest && <Badge variant="secondary">Jest</Badge>}
                        {architectureAnalysis.hasCypress && <Badge variant="secondary">Cypress</Badge>}
                      </div>
                    </div>
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
