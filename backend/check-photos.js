require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

Promise.all([
  prisma.product.count(),
  prisma.product.count({ where: { image: { not: null } } }),
  prisma.product.count({ where: { OR: [{ image: null }, { image: "" }] } }),
]).then(([all, withImg, withoutImg]) => {
  console.log("Всього товарів:", all);
  console.log("З фото:", withImg);
  console.log("Без фото:", withoutImg);
  prisma.$disconnect();
});
