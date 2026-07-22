require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const all = await prisma.product.count();
  const withNull = await prisma.product.count({ where: { image: null } });
  const withEmpty = await prisma.product.count({ where: { image: "" } });
  const withHttp = await prisma.product.count({ where: { image: { startsWith: "http" } } });
  
  console.log("Всього товарів:", all);
  console.log("image = null:", withNull);
  console.log("image = '' (порожній):", withEmpty);
  console.log("image починається з http:", withHttp);
  console.log("Реально без фото:", withNull + withEmpty);
  
  await prisma.$disconnect();
}

main();
