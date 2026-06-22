require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const p = new PrismaClient({ adapter });

const email = process.argv[2];

if (!email) {
  console.error('Вкажи email: node make-admin.js твій@email.com');
  process.exit(1);
}

p.user.update({ where: { email }, data: { isAdmin: true } })
  .then(u => console.log(`✅ ${u.email} тепер адмін!`))
  .catch(e => console.error('Помилка:', e.message))
  .finally(() => p.$disconnect());
