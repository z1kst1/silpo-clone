// prisma.config.js
// Цей файл замінює url в schema.prisma для Prisma 7+

require("dotenv").config();

const path = require("node:path");
const { defineConfig } = require("prisma/config");

module.exports = defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      const { PrismaPg } = require("@prisma/adapter-pg");
      const { Pool } = require("pg");

      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      return new PrismaPg(pool);
    },
  },
});
