/**
 * Прив'язує нові фото товарів до товарів у БД і завантажує їх в Cloudinary.
 *
 * Крок 1 — перевірка (dry-run, нічого не змінює):
 *   node scripts/linkNewProductPhotos.js
 *
 * Крок 2 — застосувати:
 *   node scripts/linkNewProductPhotos.js --apply
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

const FILE_KEYWORDS = {
  // Молочні продукти
  brie: ["брі"],
  cheddar: ["чеддер"],
  mozzarella: ["моцарел"],
  parmesan: ["пармезан"],
  gouda: ["гауда"],
  feta: ["фета"],
  "dor-blue": ["дор блю", "дорблю"],
  "goat-cheese": ["козячий"],
  "cottage-cheese": ["кисломолочний"],
  "cream-cheese": ["крем-сир"],
  "glazed-curds": ["сирки глазуров"],
  butter: ["масло вершков"],
  "sour-cream": ["сметана"],
  milk: ["молоко галичина"],
  kefir: ["кефір"],
  cream: ["вершки 33%"],
  eggs: ["яйця курячі"],
  "quail-eggs": ["яйця перепелині"],
  yogurt: ["йогурт activia"],
  "condensed-milk": ["молоко згущене"],

  // Бакалія
  honey: ["мед квітков"],
  sugar: ["цукор білий"],
  salt: ["сіль кухонна"],
  flour: ["борошно пшенич"],
  rice: ["рис круглозернист"],
  buckwheat: ["гречка ядриця"],
  "red-beans": ["квасоля червона"],
  penne: ["макарони пенне"],
  "sunflower-oil": ["олія соняшников"],
  mayonnaise: ["майонез торчин"],
  ketchup: ["кетчуп томатний"],
  "canned-tuna": ["тунець консервов"],
  pepper: ["перець чорний мелений"],
  pickles: ["огірки солені"],

  // Хліб та випічка
  lavash: ["лаваш"],
  "pizza-dough": ["коржі для піци"],
  "burger-buns": ["булочки для бургера"],
  "sliced-loaf": ["батон нарізний"],
  "whole-grain-bread": ["цільнозернов"],
  "borodinsky-bread": ["бородинськ"],
  croissant: ["круасан"],

  // Солодощі
  "artek-waffles": ["артек"],
  cookies: ["юбілейне", "ювілейне"],
  marmelad: ["мармелад фруктов"],
  marshmallow: ["зефір ванільний"],
  halva: ["халва соняшников"],
  "kyiv-cake": ["торт київськ"],
  "roshen-candies": ["цукерки рошен"],
  "roshen-chocolate": ["шоколад roshen"],
  orbit: ["жувальна гумка orbit"],

  // Овочі та фрукти
  "apples-golden": ["яблука голден"],
  avocado: ["авокадо"],
  bananas: ["банани свіжі"],
  cucumbers: ["огірки свіжі"],
  dill: ["кріп свіжий"],
  iceberg: ["салат айсберг"],
  lemons: ["лимони свіжі"],
  mushrooms: ["гриби печериці"],
  chanterelles: ["гриби лисички"],
  oranges: ["апельсини свіжі"],
  potatoes: ["картопля молода"],
  pumpkin: ["гарбуз свіжий"],
  raspberries: ["малина свіжа"],
  "red-pepper": ["перець болгарський червоний"],
  blueberries: ["чорниця свіжа"],
  seaweed: ["морської капусти"],

  // М'ясо та птиця
  "beef-steak": ["стейк яловичий"],
  "beef-tenderloin": ["яловичина, вирізка"],
  "chicken-heart": ["серце куряче"],
  "chicken-kiev": ["по-київськ"],
  "chicken-liver": ["печінка куряча"],
  "chicken-mince": ["фарш курячий"],
  "chicken-shashlik": ["шашлику з курки"],
  "chicken-thigh": ["стегно куряче"],
  "chicken-wings": ["крила курячі"],
  chicken: ["філе куряче"],
  duck: ["качка тушка"],
  "lamb-ribs": ["баранина, реберця"],
  "lamb-shoulder": ["ягнятина, лопатка"],
  "lard-garlic": ["сало солоне з часником"],
  meatballs: ["тефтелі м'ясні"],
  "mixed-mince": ["фарш свинячо-яловичий"],
  "pork-neck": ["свинина, шийка"],
  "pork-shashlik": ["шашлику зі свинини"],
  "pork-shoulder": ["свинина, лопатка"],
  quail: ["перепілка тушка"],
  rabbit: ["кролик тушка"],
  "smoked-lard": ["сало копчене"],
  "turkey-breast": ["грудка індич"],
  "veal-shank": ["телятина, гомілка"],
  salami: ["салямі мілано"],
  sausage: ["ковбаса докторськ"],

  // Риба та морепродукти
  "black-caviar": ["ікра мойви"],
  "crab-sticks": ["палички крабові"],
  "dried-roach": ["тарань в'ялена"],
  "fish-batter": ["філе риби в кляр"],
  hake: ["хек заморожений"],
  lobster: ["лобстер"],
  mackerel: ["скумбрія заморожена"],
  mussels: ["мідії в стулках"],
  oysters: ["устриці свіжі"],
  "red-caviar": ["ікра лосося"],
  shrimp: ["креветки очищені"],
  "smoked-mackerel": ["скумбрія копчена"],
  snails: ["равлики helix"],
};

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

// Перевіряє що keyword зустрічається в тексті
// і перед ним немає кириличної літери (щоб уникнути false positives)
// Після слова перевірка НЕ робиться — ключові слова є префіксами назв
const CYRILLIC_LETTER = /[а-яіїєґА-ЯІЇЄҐ]/;
function containsWord(text, keyword) {
  const idx = text.indexOf(keyword);
  if (idx === -1) return false;
  const before = text[idx - 1];
  // Блокуємо лише якщо перед ключовим словом є кирилична буква
  if (before && CYRILLIC_LETTER.test(before)) return false;
  return true;
}

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
    console.error(`Немає папки ${SOURCE_DIR}.`);
    process.exit(1);
  }

  const products = await prisma.$queryRaw`
  SELECT id, name FROM "Product" WHERE image IS NULL OR image = '' ORDER BY id ASC
`;
  console.log(`Товарів без фото в БД: ${products.length}\n`);

  const files = fs.readdirSync(SOURCE_DIR).filter((f) => IMAGE_EXT.test(f));

  const matches = [];
  const unmatchedFiles = [];
  const usedProductIds = new Set();

  for (const file of files) {
    const base = file.replace(IMAGE_EXT, "");
    const keywords = FILE_KEYWORDS[base];
    if (!keywords) {
      unmatchedFiles.push(file);
      continue;
    }
    const found = products.find(
      (p) =>
        !usedProductIds.has(p.id) &&
        keywords.some((kw) =>
          containsWord(p.name.toLowerCase(), kw.toLowerCase()),
        ),
    );
    if (found) {
      matches.push({ file, product: found });
      usedProductIds.add(found.id);
    } else {
      unmatchedFiles.push(file);
    }
  }

  console.log("=== ЗНАЙДЕНІ ВІДПОВІДНОСТІ ===");
  matches.forEach((m) =>
    console.log(`  ${m.file}  ->  [id ${m.product.id}] ${m.product.name}`),
  );

  console.log("\n=== ФАЙЛИ БЕЗ ПАРИ (товарів немає в БД) ===");
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
