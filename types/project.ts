// types/project.ts

export interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    longDescription?: string | null;
    category: string;
    status: ProjectStatus;
    featured: boolean;
    published: boolean;
    heroImage?: string | null;
    heroImageAlt?: string | null;
    demoUrl?: string | null;
    githubUrl?: string | null;
    videoUrl?: string | null;
    order: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    publishedAt?: Date | string | null;
    technologies?: ProjectTechnology[];
    features?: ProjectFeature[];
    images?: ProjectImage[];
    updates?: ProjectUpdate[];
  }
  
  export interface ProjectTechnology {
    id: string;
    name: string;
    icon?: string | null;
    category?: string | null;
    order: number;
    projectId: string;
  }
  
  export interface ProjectFeature {
    id: string;
    title: string;
    description: string;
    order: number;
    projectId: string;
  }
  
  export interface ProjectImage {
    id: string;
    url: string;
    alt: string;
    caption?: string | null;
    order: number;
    projectId: string;
  }
  
  export interface ProjectUpdate {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    projectId: string;
  }
  
  export enum ProjectStatus {
    PLANNING = 'planning',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
    ON_HOLD = 'on-hold',
    ARCHIVED = 'archived'
  }
  
  export enum ProjectCategory {
    WEB_APP = 'web-app',
    MOBILE_APP = 'mobile-app',
    GAME = 'game',
    TOOL = 'tool',
    LIBRARY = 'library',
    AUTOMATION = 'automation',
    BLOCKCHAIN = 'blockchain',
    AI_ML = 'ai-ml',
    OTHER = 'other'
  }