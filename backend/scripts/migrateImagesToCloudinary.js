/**
 * Одноразовий скрипт міграції: завантажує статичні демо-фото товарів і
 * рецептів (які зараз лежать у frontend/public/images/figma/...) у Cloudinary,
 * а потім оновлює поля `image` в таблицях Product і Recipe на нові URL.
 *
 * Навіщо: ці фото зараз "запечені" у Docker-образ фронтенду (COPY . .),
 * тобто роздуваю образ і не мають CDN/оптимізації. Cloudinary вже
 * підключений і використовується для фото, які завантажує адмін —
 * логічно перенести туди і решту.
 *
 * Запуск (з папки backend, де є .env з CLOUDINARY_* та DATABASE_URL):
 *   node scripts/migrateImagesToCloudinary.js
 *
 * Скрипт ідемпотентний: якщо запустити повторно, він пропустить записи,
 * які вже вказують на res.cloudinary.com.
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Джерело: тимчасова папка всередині контейнера, куди ви заздалегідь
// скопіювали зображення командою docker cp (бекенд-контейнер не бачить
// папку frontend напряму — це окремий Docker-образ з іншим build-контекстом).
const SOURCE_DIR = "/tmp/migrate-images";

const FOLDERS_TO_MIGRATE = [
  {
    localDir: "products",
    dbPrefix: "/images/figma/products",
    cloudFolder: "kalpo-shop/products",
  },
  {
    localDir: "recipes",
    dbPrefix: "/images/figma/recipes",
    cloudFolder: "kalpo-shop/recipes",
  },
];

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

function walk(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(full));
    } else if (IMAGE_EXT.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function uploadFile(absPath, cloudFolder) {
  const publicId = path.basename(absPath).replace(IMAGE_EXT, "");
  const result = await cloudinary.uploader.upload(absPath, {
    folder: cloudFolder,
    public_id: publicId,
    overwrite: false,
    resource_type: "image",
  });
  return result.secure_url;
}

async function main() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error(
      "Немає CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET у .env. Зупиняюсь.",
    );
    process.exit(1);
  }

  // localPath (як в БД, напр. "/images/figma/products/fish/fish-2.jpg") -> cloudinary URL
  const mapping = {};

  for (const { localDir, dbPrefix, cloudFolder } of FOLDERS_TO_MIGRATE) {
    const absDir = path.join(SOURCE_DIR, localDir);
    if (!fs.existsSync(absDir)) {
      console.warn(`Пропускаю — папки немає: ${absDir}`);
      continue;
    }

    const files = walk(absDir);
    console.log(`\n📁 ${localDir}: знайдено ${files.length} файлів`);

    for (const absPath of files) {
      const relative = path.relative(absDir, absPath).split(path.sep).join("/");
      const dbPath = `${dbPrefix}/${relative}`;

      try {
        const url = await uploadFile(absPath, cloudFolder);
        mapping[dbPath] = url;
        console.log(`  ✔ ${dbPath} -> ${url}`);
      } catch (err) {
        console.error(`  ✘ Помилка завантаження ${dbPath}:`, err.message);
      }
    }
  }

  console.log(
    `\nЗавантажено ${Object.keys(mapping).length} фото в Cloudinary.`,
  );
  console.log("Оновлюю посилання в базі даних...\n");

  let updatedProducts = 0;
  let updatedRecipes = 0;

  const products = await prisma.product.findMany();
  for (const product of products) {
    if (product.image && mapping[product.image]) {
      await prisma.product.update({
        where: { id: product.id },
        data: { image: mapping[product.image] },
      });
      updatedProducts++;
    }
  }

  const recipes = await prisma.recipe.findMany();
  for (const recipe of recipes) {
    if (recipe.image && mapping[recipe.image]) {
      await prisma.recipe.update({
        where: { id: recipe.id },
        data: { image: mapping[recipe.image] },
      });
      updatedRecipes++;
    }
  }

  console.log(`Оновлено товарів: ${updatedProducts}`);
  console.log(`Оновлено рецептів: ${updatedRecipes}`);
  console.log(
    "\nГотово. Тепер можна видалити локальні файли з frontend/public/images/figma/products та /recipes.",
  );

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Migration failed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
