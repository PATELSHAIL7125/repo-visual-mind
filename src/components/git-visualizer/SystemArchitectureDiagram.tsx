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
    // Frontend Technologies - only detect if actually present
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
    
    // Styling & UI - only detect if actually present
    hasTailwind: false,
    hasBootstrap: false,
    hasStyledComponents: false,
    hasSass: false,
    hasLess: false,
    hasChakraUI: false,
    hasMaterialUI: false,
    hasAntDesign: false,
    
    // Backend Technologies - only detect if actually present
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
    
    // Databases - only detect if actually present
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
    
    // APIs & Services - only detect if actually present
    hasAPI: false,
    hasGraphQL: false,
    hasREST: false,
    hasWebSockets: false,
    hasMicroservices: false,
    hasServerless: false,
    
    // State Management - only detect if actually present
    hasRedux: false,
    hasZustand: false,
    hasRecoil: false,
    hasVuex: false,
    hasPinia: false,
    
    // Testing - only detect if actually present
    hasTests: false,
    hasJest: false,
    hasCypress: false,
    hasPlaywright: false,
    hasVitest: false,
    hasTesting: false,
    
    // DevOps & Infrastructure - only detect if actually present
    hasDocker: false,
    hasKubernetes: false,
    hasCI: false,
    hasVercel: false,
    hasNetlify: false,
    hasAWS: false,
    hasGCP: false,
    hasAzure: false,
    hasHeroku: false,
    
    // Development Tools - only detect if actually present
    hasESLint: false,
    hasPrettier: false,
    hasHusky: false,
    hasStorybook: false,
    
    // Additional Analysis
    architecture: 'single-page-app',
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
    framework: 'React'
  };

  const fileStructure: { [key: string]: number } = {};
  let totalFiles = 0;
  let jsFiles = 0;
  let tsFiles = 0;
  let componentCount = 0;
  let serviceCount = 0;

  // Check package.json content first for more accurate detection
  const packageJsonFile = repositoryData.tree.find((item: any) => 
    item.path === 'package.json' && item.content
  );

  let packageJsonContent = null;
  if (packageJsonFile?.content) {
    try {
      packageJsonContent = JSON.parse(packageJsonFile.content);
    } catch (e) {
      console.log('Could not parse package.json');
    }
  }

  repositoryData.tree.forEach((item: any) => {
    const path = item.path.toLowerCase();
    const fileName = path.split('/').pop() || '';
    const extension = fileName.split('.').pop() || '';
    const directory = path.split('/')[0];
    
    totalFiles++;

    // Count files in directories
    fileStructure[directory] = (fileStructure[directory] || 0) + 1;

    // VERY STRICT technology detection - only detect what's actually there
    
    // Frontend Frameworks - check for actual usage, not just mentions
    if ((extension === 'tsx' || extension === 'jsx') && 
        (item.content?.includes('import React') || item.content?.includes('from "react"') || 
         path.includes('component') || fileName.includes('app'))) {
      analysis.hasReact = true;
      analysis.framework = 'React';
    }
    
    if (extension === 'vue' || fileName.includes('.vue')) {
      analysis.hasVue = true;
      analysis.framework = 'Vue.js';
    }
    
    if (fileName === 'angular.json' || path.includes('@angular')) {
      analysis.hasAngular = true;
      analysis.framework = 'Angular';
    }
    
    // Build Tools & Meta Frameworks - check for actual config files
    if (fileName === 'next.config.js' || fileName === 'next.config.ts' || fileName === 'next.config.mjs') {
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
    
    if (fileName === 'vite.config.js' || fileName === 'vite.config.ts' || fileName === 'vite.config.mjs') {
      analysis.hasVite = true;
    }
    
    if (fileName === 'webpack.config.js' || fileName === 'webpack.config.ts') {
      analysis.hasWebpack = true;
    }
    
    // Languages - check actual file extensions
    if (extension === 'ts' || extension === 'tsx') {
      analysis.hasTypeScript = true;
      tsFiles++;
    }
    if (extension === 'js' || extension === 'jsx') {
      jsFiles++;
    }
    
    // Styling Technologies - check for actual config files
    if (fileName === 'tailwind.config.js' || fileName === 'tailwind.config.ts') {
      analysis.hasTailwind = true;
    }
    
    if (extension === 'scss' || extension === 'sass') {
      analysis.hasSass = true;
    }
    if (extension === 'less') {
      analysis.hasLess = true;
    }
    
    // Backend Technologies - only if actual server files exist
    if (fileName === 'server.js' || fileName === 'server.ts' || 
        (fileName === 'app.js' && item.content?.includes('express')) ||
        (fileName === 'index.js' && item.content?.includes('express'))) {
      analysis.hasNodeJS = true;
      if (item.content?.includes('express')) {
        analysis.hasExpress = true;
      }
    }
    
    if (extension === 'py' && (fileName.includes('app') || fileName.includes('main') || fileName.includes('server'))) {
      analysis.hasPython = true;
    }
    
    if (fileName === 'manage.py' || fileName.includes('django')) {
      analysis.hasDjango = true;
    }
    
    if (item.content?.includes('from flask import') || fileName.includes('flask')) {
      analysis.hasFlask = true;
    }
    
    // Databases & ORMs - check for actual config files
    if (fileName === 'schema.prisma') {
      analysis.hasPrisma = true;
      analysis.hasDatabase = true;
    }
    
    if (fileName.includes('sequelize') && (extension === 'js' || extension === 'ts')) {
      analysis.hasSequelize = true;
      analysis.hasDatabase = true;
    }
    
    if (item.content?.includes('mongoose') || fileName.includes('mongoose')) {
      analysis.hasMongoose = true;
      analysis.hasMongoDB = true;
      analysis.hasDatabase = true;
    }
    
    // APIs & Communication - check for actual API directories/files
    if (path.includes('/api/') && (extension === 'js' || extension === 'ts' || extension === 'tsx')) {
      analysis.hasAPI = true;
      analysis.hasREST = true;
    }
    
    if (extension === 'graphql' || fileName.includes('graphql') || item.content?.includes('graphql')) {
      analysis.hasGraphQL = true;
    }
    
    if (item.content?.includes('socket.io') || item.content?.includes('websocket')) {
      analysis.hasWebSockets = true;
    }
    
    // State Management - check for actual usage
    if (item.content?.includes('redux') || item.content?.includes('@reduxjs')) {
      analysis.hasRedux = true;
    }
    
    if (item.content?.includes('zustand')) {
      analysis.hasZustand = true;
    }
    
    if (item.content?.includes('recoil')) {
      analysis.hasRecoil = true;
    }
    
    // Testing - check for actual test files and config
    if (path.includes('test') || path.includes('spec') || fileName.includes('.test.') || fileName.includes('.spec.')) {
      analysis.hasTests = true;
    }
    
    if (fileName === 'jest.config.js' || fileName === 'jest.config.ts' || 
        (packageJsonContent?.devDependencies?.jest) ||
        item.content?.includes('describe(') || item.content?.includes('it(')) {
      analysis.hasJest = true;
      analysis.hasTesting = true;
    }
    
    if (fileName === 'cypress.config.js' || path.includes('cypress/') || 
        (packageJsonContent?.devDependencies?.cypress)) {
      analysis.hasCypress = true;
      analysis.hasTesting = true;
    }
    
    if (fileName === 'playwright.config.js' || fileName === 'playwright.config.ts' ||
        (packageJsonContent?.devDependencies?.playwright)) {
      analysis.hasPlaywright = true;
      analysis.hasTesting = true;
    }
    
    // DevOps & Infrastructure - check for actual files
    if (fileName === 'dockerfile' || fileName === 'docker-compose.yml' || fileName === 'docker-compose.yaml') {
      analysis.hasDocker = true;
    }
    
    if (fileName.includes('kubernetes') || fileName.includes('k8s') || extension === 'yaml' && path.includes('k8s')) {
      analysis.hasKubernetes = true;
    }
    
    if (path.includes('.github/workflows/') || fileName.includes('.yml') && path.includes('.github')) {
      analysis.hasCI = true;
    }
    
    if (fileName === 'vercel.json' || fileName === '.vercelignore') {
      analysis.hasVercel = true;
    }
    
    if (fileName === 'netlify.toml' || fileName === '_redirects') {
      analysis.hasNetlify = true;
    }
    
    // Development Tools - check for actual config files
    if (fileName.startsWith('.eslintrc') || fileName === 'eslint.config.js' || 
        (packageJsonContent?.devDependencies?.eslint)) {
      analysis.hasESLint = true;
    }
    
    if (fileName.startsWith('.prettierrc') || fileName === 'prettier.config.js' || 
        (packageJsonContent?.devDependencies?.prettier)) {
      analysis.hasPrettier = true;
    }
    
    if (path.includes('.storybook/') || fileName.includes('stories') || 
        (packageJsonContent?.devDependencies?.['@storybook/react'])) {
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

  // Use package.json for more accurate detection
  if (packageJsonContent) {
    const allDeps = {
      ...packageJsonContent.dependencies,
      ...packageJsonContent.devDependencies
    };

    // Check dependencies more accurately
    if (allDeps.react) analysis.hasReact = true;
    if (allDeps.vue) analysis.hasVue = true;
    if (allDeps['@angular/core']) analysis.hasAngular = true;
    if (allDeps.next) analysis.hasNextJS = true;
    if (allDeps.typescript) analysis.hasTypeScript = true;
    if (allDeps.tailwindcss) analysis.hasTailwind = true;
    if (allDeps.bootstrap) analysis.hasBootstrap = true;
    if (allDeps['styled-components']) analysis.hasStyledComponents = true;
    if (allDeps.express) analysis.hasExpress = true;
    if (allDeps.prisma) analysis.hasPrisma = true;
    if (allDeps.sequelize) analysis.hasSequelize = true;
    if (allDeps.mongoose) analysis.hasMongoose = true;
    if (allDeps.graphql) analysis.hasGraphQL = true;
    if (allDeps.redux || allDeps['@reduxjs/toolkit']) analysis.hasRedux = true;
    if (allDeps.zustand) analysis.hasZustand = true;
    if (allDeps.vite) analysis.hasVite = true;
    if (allDeps.webpack) analysis.hasWebpack = true;
  }

  // Determine architecture patterns based on what's actually detected
  if (analysis.hasAPI && analysis.hasDatabase) {
    analysis.architecture = 'full-stack';
    analysis.patterns.push('Full-Stack Application');
  } else if (analysis.hasReact || analysis.hasVue || analysis.hasAngular) {
    analysis.architecture = 'single-page-app';
    analysis.patterns.push('Single Page Application');
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
    analysis.patterns.push('Testing Strategy');
  }

  if (analysis.hasDocker) {
    analysis.patterns.push('Containerization');
  }

  if (analysis.hasCI) {
    analysis.patterns.push('Continuous Integration');
  }

  // Determine complexity based on actual file counts
  if (totalFiles > 100 || componentCount > 20) {
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

  // Create a precise architecture diagram based on actual detected technologies
  let mermaidCode = `flowchart TB
    %% Comprehensive styling for modern architecture diagrams
    classDef userLayer fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#0d47a1
    classDef frontendLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#4a148c
    classDef backendLayer fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#1b5e20
    classDef dataLayer fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#e65100
    classDef infraLayer fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#880e4f
    classDef apiLayer fill:#e0f2f1,stroke:#00695c,stroke-width:2px,color:#004d40
    classDef toolLayer fill:#f1f8e9,stroke:#558b2f,stroke-width:2px,color:#33691e
    classDef stateLayer fill:#fff8e1,stroke:#ff8f00,stroke-width:2px,color:#ef6c00

`;

  let nodeId = 1;
  const nodes: { [key: string]: string } = {};

  // User Layer
  const userNode = `U${nodeId++}`;
  nodes['user'] = userNode;
  mermaidCode += `    ${userNode}["👥 Users"]:::userLayer\n`;

  // Frontend Layer - only show what's actually detected
  if (analysis.hasReact || analysis.hasVue || analysis.hasAngular) {
    const frontendNode = `F${nodeId++}`;
    nodes['frontend'] = frontendNode;
    
    let frontendTech = 'Frontend Application';
    if (analysis.hasNextJS) frontendTech = '⚡ Next.js Application';
    else if (analysis.hasReact) frontendTech = '⚛️ React Application';
    else if (analysis.hasVue) frontendTech = '💚 Vue.js Application';
    else if (analysis.hasAngular) frontendTech = '🅰️ Angular Application';
    
    mermaidCode += `    ${frontendNode}["${frontendTech}"]:::frontendLayer\n`;
  }

  // UI/Styling Layer - only if detected
  if (analysis.hasTailwind || analysis.hasBootstrap || analysis.hasStyledComponents || analysis.hasSass) {
    const stylingNode = `S${nodeId++}`;
    nodes['styling'] = stylingNode;
    
    let stylingTech = '🎨 Styling System';
    if (analysis.hasTailwind) stylingTech = '🎨 Tailwind CSS';
    else if (analysis.hasBootstrap) stylingTech = '🎨 Bootstrap';
    else if (analysis.hasStyledComponents) stylingTech = '🎨 Styled Components';
    else if (analysis.hasSass) stylingTech = '🎨 Sass/SCSS';
    
    mermaidCode += `    ${stylingNode}["${stylingTech}"]:::frontendLayer\n`;
  }

  // State Management - only if actually detected
  if (analysis.hasRedux || analysis.hasZustand || analysis.hasRecoil) {
    const stateNode = `ST${nodeId++}`;
    nodes['state'] = stateNode;
    
    let stateTech = '🔄 State Management';
    if (analysis.hasRedux) stateTech = '🔄 Redux Store';
    else if (analysis.hasZustand) stateTech = '🔄 Zustand Store';
    else if (analysis.hasRecoil) stateTech = '🔄 Recoil State';
    
    mermaidCode += `    ${stateNode}["${stateTech}"]:::stateLayer\n`;
  }

  // API Layer - only if detected
  if (analysis.hasAPI || analysis.hasGraphQL) {
    const apiNode = `A${nodeId++}`;
    nodes['api'] = apiNode;
    
    let apiTech = '🌐 API Layer';
    if (analysis.hasGraphQL) apiTech = '🌐 GraphQL API';
    else if (analysis.hasREST) apiTech = '🌐 REST API';
    
    mermaidCode += `    ${apiNode}["${apiTech}"]:::apiLayer\n`;
  }

  // Backend Services - only if detected
  if (analysis.hasNodeJS || analysis.hasExpress || analysis.hasPython || analysis.hasJava) {
    const backendNode = `B${nodeId++}`;
    nodes['backend'] = backendNode;
    
    let backendTech = '⚙️ Backend Server';
    if (analysis.hasExpress) backendTech = '⚙️ Express.js Server';
    else if (analysis.hasKoa) backendTech = '⚙️ Koa.js Server';
    else if (analysis.hasDjango) backendTech = '⚙️ Django Server';
    else if (analysis.hasFlask) backendTech = '⚙️ Flask Server';
    else if (analysis.hasNodeJS) backendTech = '⚙️ Node.js Server';
    
    mermaidCode += `    ${backendNode}["${backendTech}"]:::backendLayer\n`;
  }

  // Business Logic/Services - only if detected
  if (analysis.services.length > 0) {
    const servicesNode = `SV${nodeId++}`;
    nodes['services'] = servicesNode;
    mermaidCode += `    ${servicesNode}["🔧 Business Logic<br/>(${analysis.services.length} services)"]:::backendLayer\n`;
  }

  // Database Layer with ORM - only if detected
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

  // Database - only if detected
  if (analysis.hasDatabase) {
    const dbNode = `DB${nodeId++}`;
    nodes['database'] = dbNode;
    
    let dbTech = '🗄️ Database';
    if (analysis.hasMongoDB) dbTech = '🗄️ MongoDB';
    else if (analysis.hasMySQL) dbTech = '🗄️ MySQL';
    else if (analysis.hasPostgreSQL) dbTech = '🗄️ PostgreSQL';
    
    mermaidCode += `    ${dbNode}["${dbTech}"]:::dataLayer\n`;
  }

  // Build Tools - only if detected
  if (analysis.hasVite || analysis.hasWebpack || analysis.hasParcel) {
    const buildNode = `BT${nodeId++}`;
    nodes['build'] = buildNode;
    
    let buildTech = '🔨 Build Tools';
    if (analysis.hasVite) buildTech = '⚡ Vite Build';
    else if (analysis.hasWebpack) buildTech = '📦 Webpack Build';
    else if (analysis.hasParcel) buildTech = '📦 Parcel Build';
    
    mermaidCode += `    ${buildNode}["${buildTech}"]:::toolLayer\n`;
  }

  // Testing Infrastructure - only if actually detected
  if (analysis.hasTests && analysis.hasTesting) {
    const testNode = `T${nodeId++}`;
    nodes['testing'] = testNode;
    
    let testTech = '🧪 Testing Suite';
    if (analysis.hasJest) testTech = '🧪 Jest Testing';
    else if (analysis.hasCypress) testTech = '🧪 Cypress E2E';
    else if (analysis.hasPlaywright) testTech = '🧪 Playwright Testing';
    
    mermaidCode += `    ${testNode}["${testTech}"]:::toolLayer\n`;
  }

  // DevOps & Infrastructure - only if detected
  if (analysis.hasDocker || analysis.hasKubernetes) {
    const infraNode = `I${nodeId++}`;
    nodes['infrastructure'] = infraNode;
    
    let infraTech = '🐳 Infrastructure';
    if (analysis.hasKubernetes) infraTech = '☸️ Kubernetes';
    else if (analysis.hasDocker) infraTech = '🐳 Docker';
    
    mermaidCode += `    ${infraNode}["${infraTech}"]:::infraLayer\n`;
  }

  // CI/CD Pipeline - only if actually detected
  if (analysis.hasCI) {
    const ciNode = `CI${nodeId++}`;
    nodes['cicd'] = ciNode;
    mermaidCode += `    ${ciNode}["🚀 CI/CD Pipeline"]:::infraLayer\n`;
  }

  // Code Quality - only if detected
  if (analysis.hasESLint || analysis.hasPrettier) {
    const qualityNode = `Q${nodeId++}`;
    nodes['quality'] = qualityNode;
    let qualityTools = [];
    if (analysis.hasESLint) qualityTools.push('ESLint');
    if (analysis.hasPrettier) qualityTools.push('Prettier');
    mermaidCode += `    ${qualityNode}["🔍 Code Quality<br/>${qualityTools.join(' • ')}"]:::toolLayer\n`;
  }

  // Documentation - only if detected
  if (analysis.hasStorybook || analysis.docs.length > 5) {
    const docsNode = `DOC${nodeId++}`;
    nodes['docs'] = docsNode;
    
    let docsTech = '📚 Documentation';
    if (analysis.hasStorybook) docsTech = '📚 Storybook Docs';
    
    mermaidCode += `    ${docsNode}["${docsTech}"]:::toolLayer\n`;
  }

  // Add realistic connections based on actual architecture
  mermaidCode += '\n    %% Realistic Data Flow Connections\n';
  
  // User to Frontend
  if (nodes['user'] && nodes['frontend']) {
    mermaidCode += `    ${nodes['user']} -->|"User Interactions"| ${nodes['frontend']}\n`;
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
    mermaidCode += `    ${nodes['backend']} -->|"Service Layer"| ${nodes['services']}\n`;
  }
  
  // Services to ORM
  if (nodes['services'] && nodes['orm']) {
    mermaidCode += `    ${nodes['services']} <-->|"Data Access"| ${nodes['orm']}\n`;
  }
  
  // ORM to Database
  if (nodes['orm'] && nodes['database']) {
    mermaidCode += `    ${nodes['orm']} <-->|"Database Queries"| ${nodes['database']}\n`;
  }
  
  // Direct Backend to Database (if no ORM)
  if (nodes['backend'] && nodes['database'] && !nodes['orm']) {
    mermaidCode += `    ${nodes['backend']} <-->|"Direct DB Access"| ${nodes['database']}\n`;
  }
  
  // Build tools
  if (nodes['build'] && nodes['frontend']) {
    mermaidCode += `    ${nodes['build']} -.->|"Build Process"| ${nodes['frontend']}\n`;
  }
  
  // Testing connections
  if (nodes['testing']) {
    if (nodes['frontend']) {
      mermaidCode += `    ${nodes['testing']} -.->|"Frontend Tests"| ${nodes['frontend']}\n`;
    }
    if (nodes['backend']) {
      mermaidCode += `    ${nodes['testing']} -.->|"Backend Tests"| ${nodes['backend']}\n`;
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
  }
  
  // Quality connections
  if (nodes['quality']) {
    if (nodes['frontend']) {
      mermaidCode += `    ${nodes['quality']} -.->|"Code Quality"| ${nodes['frontend']}\n`;
    }
    if (nodes['backend']) {
      mermaidCode += `    ${nodes['quality']} -.->|"Code Quality"| ${nodes['backend']}\n`;
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
          Real-time architecture visualization - intelligently generated from actual repository analysis
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
              Powered by Real-time Analysis
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
                    <p className="text-sm text-muted-foreground">Generating precise architecture diagram...</p>
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

            {/* Real-time Repository Insights */}
            {repositoryData && architectureAnalysis && (
              <div className="p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl border border-border/50">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Real-time Architecture Analysis
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

            {/* Enhanced Technology Stack with Detected Patterns */}
            {architectureAnalysis && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Detected Architecture Patterns</h4>
                  <div className="flex flex-wrap gap-2">
                    {architectureAnalysis.patterns.length > 0 ? (
                      architectureAnalysis.patterns.map((pattern, index) => (
                        <Badge key={index} variant="default" className="bg-gradient-to-r from-primary to-primary/80">
                          {pattern}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">Simple Application Structure</Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Detected Technology Stack</h4>
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
                        {architectureAnalysis.hasSass && <Badge variant="secondary">Sass/SCSS</Badge>}
                        {(!architectureAnalysis.hasReact && !architectureAnalysis.hasVue && !architectureAnalysis.hasAngular && !architectureAnalysis.hasNextJS) && 
                          <Badge variant="outline">No frontend framework detected</Badge>}
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
                        {(!architectureAnalysis.hasNodeJS && !architectureAnalysis.hasExpress && !architectureAnalysis.hasPython && !architectureAnalysis.hasDjango && !architectureAnalysis.hasFlask) && 
                          <Badge variant="outline">No backend detected</Badge>}
                      </div>
                    </div>
                    
                    {/* Infrastructure & Tools */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-muted-foreground">Infrastructure & Tools</h5>
                      <div className="flex flex-wrap gap-2">
                        {architectureAnalysis.hasPrisma && <Badge variant="secondary">Prisma</Badge>}
                        {architectureAnalysis.hasDocker && <Badge variant="secondary">Docker</Badge>}
                        {architectureAnalysis.hasKubernetes && <Badge variant="secondary">Kubernetes</Badge>}
                        {architectureAnalysis.hasVite && <Badge variant="secondary">Vite</Badge>}
                        {architectureAnalysis.hasWebpack && <Badge variant="secondary">Webpack</Badge>}
                        {architectureAnalysis.hasRedux && <Badge variant="secondary">Redux</Badge>}
                        {architectureAnalysis.hasZustand && <Badge variant="secondary">Zustand</Badge>}
                        {architectureAnalysis.hasJest && <Badge variant="secondary">Jest</Badge>}
                        {architectureAnalysis.hasCypress && <Badge variant="secondary">Cypress</Badge>}
                        {architectureAnalysis.hasCI && <Badge variant="secondary">CI/CD</Badge>}
                        {architectureAnalysis.hasESLint && <Badge variant="secondary">ESLint</Badge>}
                        {architectureAnalysis.hasPrettier && <Badge variant="secondary">Prettier</Badge>}
                        {(!architectureAnalysis.hasPrisma && !architectureAnalysis.hasDocker && !architectureAnalysis.hasVite && !architectureAnalysis.hasWebpack && !architectureAnalysis.hasRedux && !architectureAnalysis.hasJest && !architectureAnalysis.hasCI) && 
                          <Badge variant="outline">Minimal tooling detected</Badge>}
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
