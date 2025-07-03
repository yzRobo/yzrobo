// types/vehicle.ts

export interface VehicleBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  heroImage?: string | null;
  heroImageAlt?: string | null;
  published: boolean;
  featured: boolean;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  vehicleId: string;
  vehicle?: Vehicle;
  tags?: VehicleTag[];
}

export interface VehicleTag {
  id: string;
  name: string;
  slug: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  category: string;
  heroImage?: string | null;
  gallery?: string[];
  story?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  modifications?: Modification[];
  specs?: Spec[];
  blogPosts?: VehicleBlogPost[];
}

export interface Modification {
  id: string;
  category: string;
  items: string[];
  order: number;
  vehicleId: string;
}

export interface Spec {
  id: string;
  label: string;
  value: string;
  order: number;
  vehicleId: string;
}