// app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Since your vehicle data is hardcoded in the /auto page, we'll list the slugs here.
const vehicleSlugs = [
  '2006-yamaha-r6',
  '2014-yamaha-mt09',
  '2018-yamaha-mt07',
  '2000-yamaha-yz250',
  '1992-ford-f150',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yzrobo.com';

  // 1. Get all published recipe pages dynamically from the database
  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // FIX: Added an explicit type for the 'recipe' parameter here
  const recipeUrls = recipes.map((recipe: { slug: string; updatedAt: Date | null }) => ({
    url: `${baseUrl}/cooking/${recipe.slug}`,
    lastModified: recipe.updatedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 2. Create URLs for the static vehicle pages
  const vehicleUrls = vehicleSlugs.map((slug) => ({
    url: `${baseUrl}/auto/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  // 3. Define all other static pages
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gaming`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cooking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/coding`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/links`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 4. Combine all URLs and return
  return [...staticUrls, ...recipeUrls, ...vehicleUrls];
}