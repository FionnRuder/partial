const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.part.count(),
    prisma.workItem.count(),
  ]);
  console.log({ users: counts[0], parts: counts[1], workItems: counts[2] });
  await prisma.$disconnect();
})();
