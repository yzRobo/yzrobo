// app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const vehicleSlugs = [
  '2006-yamaha-r6',
  '2014-yamaha-mt09',
  '2018-yamaha-mt07',
  '2000-yamaha-yz250',
  '1992-ford-f150',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yzrobo.com';

  const recipes = await prisma.recipe.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Correctly typing the 'recipe' parameter in the map function
  const recipeUrls = recipes.map((recipe: { slug: string; updatedAt: Date | null }) => ({
    url: `${baseUrl}/cooking/${recipe.slug}`,
    lastModified: recipe.updatedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const vehicleUrls = vehicleSlugs.map((slug) => ({
    url: `${baseUrl}/auto/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  // Explicitly typing the staticUrls array to satisfy the Sitemap type
  const staticUrls: MetadataRoute.Sitemap = [
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

  return [...staticUrls, ...recipeUrls, ...vehicleUrls];
}