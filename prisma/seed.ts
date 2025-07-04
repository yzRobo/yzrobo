import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Data taken from your app/auto/page.tsx
const vehicleData = [
  { slug: '2006-yamaha-r6', name: '2006 Yamaha R6 50th Anniversary', category: 'Motorcycle' },
  { slug: '2014-yamaha-mt09', name: '2014 Yamaha MT-09', category: 'Motorcycle' },
  { slug: '2018-yamaha-mt07', name: '2018 Yamaha MT-07', category: 'Motorcycle' },
  { slug: '2000-yamaha-yz250', name: '2000 Yamaha YZ250', category: 'Motorcycle' },
  { slug: '1992-ford-f150', name: '1992 Ford F-150 XLT', category: 'OBS Truck' },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const v of vehicleData) {
    const vehicle = await prisma.vehicle.upsert({
      where: { slug: v.slug },
      update: {},
      create: {
        slug: v.slug,
        name: v.name,
        category: v.category,
      },
    });
    console.log(`Created or found vehicle with slug: ${vehicle.slug}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });