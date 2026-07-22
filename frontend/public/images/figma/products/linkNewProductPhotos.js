/**
 * Прив'язує нові фото товарів (додані колегою в frontend/public/images/figma/products)
 * до товарів у БД, у яких image = null, і одразу завантажує ці фото в Cloudinary
 * (щоб не порушувати вимогу "не тримати фото товарів локально").
 *
 * ВАЖЛИВО: скрипт зіставляє файл із товаром за ключовими словами в назві —
 * автоматичний підбір може помилятись, тому за замовчуванням це DRY RUN:
 * він лише ВИВОДИТЬ таблицю передбачуваних відповідностей і НІЧОГО не змінює.
 *
 * Крок 1 — перевірка (нічого не змінює в БД/Cloudinary):
 *   node scripts/linkNewProductPhotos.js
 *
 * Крок 2 — після того, як візуально перевірили список і всі відповідності
 * виглядають правильно, застосувати реально:
 *   node scripts/linkNewProductPhotos.js --apply
 *
 * Джерело файлів — та сама тимчасова папка всередині контейнера, куди
 * копіюєте картинки командою docker cp (як і минулого разу):
 *   docker exec silpo_backend mkdir -p /tmp/migrate-images
 *   docker cp frontend\public\images\figma\products silpo_backend:/tmp/migrate-images/products
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

// Джерело файлів. Дві можливі ситуації:
// 1) Скрипт запущено всередині Docker-контейнера бекенду (docker exec) —
//    тоді файли мають бути заздалегідь скопійовані туди через docker cp
//    у /tmp/migrate-images/products.
// 2) Скрипт запущено напряму на хості через `railway run` (щоб мати доступ
//    до продакшн-БД/Cloudinary, але виконання відбувається на вашій
//    машині) — тоді простіше й надійніше брати файли напряму з
//    frontend/public/images/figma/products відносним шляхом.
const DOCKER_SOURCE_DIR = "/tmp/migrate-images/products";
const HOST_SOURCE_DIR = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "public",
  "images",
  "figma",
  "products",
);
const SOURCE_DIR = fs.existsSync(DOCKER_SOURCE_DIR)
  ? DOCKER_SOURCE_DIR
  : HOST_SOURCE_DIR;
const CLOUD_FOLDER = "kalpo-shop/products";
const APPLY = process.argv.includes("--apply");

// Ім'я файлу (без розширення) -> ключові слова, які мають зустрічатись
// в назві товару (регістронезалежно), щоб вважати це відповідністю.
const FILE_KEYWORDS = {
  brie: ["брі"],
  cheddar: ["чеддер"],
  mozzarella: ["моцарел"],
  parmesan: ["пармезан"],
  gouda: ["гауда"],
  feta: ["фета"],
  "dor-blue": ["дор блю", "дорблю"],
  "goat-cheese": ["козячий сир", "козячого сиру"],
  "cottage-cheese": ["творог", "творож"],
  "cream-cheese": ["вершковий сир"],
  "glazed-curds": ["сирок глазуров", "глазуров"],
  butter: ["масло вершков"],
  "sour-cream": ["сметана"],
  milk: ["молоко"],
  kefir: ["кефір"],
  cream: ["вершки"],
  eggs: ["яйця курячі"],
  "quail-eggs": ["перепелині яйця"],
  yogurt: ["йогурт"],
  "condensed-milk": ["згущене молоко", "згущенка"],
  honey: ["мед"],
  sugar: ["цукор"],
  salt: ["сіль"],
  flour: ["борошно"],
  rice: ["рис"],
  buckwheat: ["гречка", "гречан"],
  "red-beans": ["квасоля"],
  penne: ["пенне"],
  "sunflower-oil": ["олія соняшник"],
  mayonnaise: ["майонез"],
  ketchup: ["кетчуп"],
  "canned-tuna": ["тунець"],
  lavash: ["лаваш"],
  "pizza-dough": ["тісто для піци"],
  "burger-buns": ["булочки для бургер"],
  "sliced-loaf": ["нарізний батон", "хліб нарізний"],
  "whole-grain-bread": ["цільнозернов"],
  "borodinsky-bread": ["бородинськ"],
  croissant: ["круасан"],
  "artek-waffles": ["артек"],
  "jubilee-cookies": ["ювілейне"],
  marmelad: ["мармелад"],
  marshmallow: ["зефір"],
  halva: ["халва"],
  "kyiv-cake": ["київський торт"],
  "roshen-candies": ["рошен"],
  "roshen-chocolate": ["рошен"],
  zewa: ["туалетний папір"],
  nivea_creme: ["nivea", "крем для"],
  orbit: ["orbit", "жувальн"],
};

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

async function uploadFile(absPath) {
  const publicId = path.basename(absPath).replace(IMAGE_EXT, "");
  const result = await cloudinary.uploader.upload(absPath, {
    folder: CLOUD_FOLDER,
    public_id: publicId,
    overwrite: false,
    resource_type: "image",
  });
  return result.secure_url;
}

async function main() {
  console.log(`Джерело фото: ${SOURCE_DIR}\n`);
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Немає папки ${SOURCE_DIR}. Спочатку docker cp туди фото.`);
    process.exit(1);
  }

  const products = await prisma.product.findMany({ where: { image: null } });
  console.log(`Товарів без фото в БД: ${products.length}\n`);

  const files = fs.readdirSync(SOURCE_DIR).filter((f) => IMAGE_EXT.test(f));

  const matches = [];
  const unmatchedFiles = [];

  for (const file of files) {
    const base = file.replace(IMAGE_EXT, "");
    const keywords = FILE_KEYWORDS[base];
    if (!keywords) {
      unmatchedFiles.push(file);
      continue;
    }
    const found = products.find((p) =>
      keywords.some((kw) => p.name.toLowerCase().includes(kw.toLowerCase())),
    );
    if (found) {
      matches.push({ file, product: found });
    } else {
      unmatchedFiles.push(file);
    }
  }

  console.log("=== ЗНАЙДЕНІ ВІДПОВІДНОСТІ ===");
  matches.forEach((m) =>
    console.log(`  ${m.file}  ->  [id ${m.product.id}] ${m.product.name}`),
  );

  console.log("\n=== ФАЙЛИ БЕЗ ПАРИ (перевірте вручну) ===");
  unmatchedFiles.forEach((f) => console.log(`  ${f}`));

  console.log(
    `\nВсього: ${matches.length} відповідностей, ${unmatchedFiles.length} без пари.`,
  );

  if (!APPLY) {
    console.log(
      "\n(Це dry-run, нічого не змінено. Перевірте список вище і запустіть з --apply.)",
    );
    await prisma.$disconnect();
    return;
  }

  console.log("\nЗастосовую: завантажую в Cloudinary і оновлюю БД...\n");
  for (const { file, product } of matches) {
    try {
      const url = await uploadFile(path.join(SOURCE_DIR, file));
      await prisma.product.update({
        where: { id: product.id },
        data: { image: url },
      });
      console.log(`  OK [id ${product.id}] ${product.name} -> ${url}`);
    } catch (err) {
      console.error(`  ERROR ${file}:`, err.message);
    }
  }

  console.log("\nГотово.");
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Failed:", err);
  await prisma.$disconnect();
  process.exit(1);
});
