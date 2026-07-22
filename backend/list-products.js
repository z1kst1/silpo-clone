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
  mozzarella: ["моцарела"],
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
  milk: ["молоко галичина", "молоко"],
  kefir: ["кефір"],
  cream: ["вершки"],
  eggs: ["яйця курячі"],
  "quail-eggs": ["яйця перепелині", "перепелині яйця"],
  yogurt: ["йогурт activia", "йогурт натур"],
  "condensed-milk": ["молоко згущене", "згущен"],

  // Бакалія
  honey: ["мед"],
  sugar: ["цукор"],
  salt: ["сіль"],
  flour: ["борошно"],
  rice: ["рис"],
  buckwheat: ["гречка"],
  "red-beans": ["квасоля"],
  penne: ["пенне"],
  "sunflower-oil": ["олія соняшников"],
  mayonnaise: ["майонез"],
  ketchup: ["кетчуп"],
  "canned-tuna": ["тунець"],
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

  // Солодощі та снеки
  "artek-waffles": ["артек"],
  cookies: ["юбілейне", "ювілейне"],
  marmelad: ["мармелад"],
  marshmallow: ["зефір"],
  halva: ["халва"],
  "kyiv-cake": ["торт київськ"],
  "roshen-candies": ["цукерки рошен"],
  "roshen-chocolate": ["шоколад roshen", "roshen молочн"],
  orbit: ["orbit", "жувальн"],

  // Овочі та фрукти
  "apples-golden": ["яблука голден", "яблука"],
  avocado: ["авокадо"],
  bananas: ["банани"],
  cucumbers: ["огірки свіжі"],
  dill: ["кріп"],
  iceberg: ["салат айсберг"],
  lemons: ["лимони"],
  mushrooms: ["печериці"],
  chanterelles: ["лисички"],
  oranges: ["апельсини"],
  potatoes: ["картопля"],
  pumpkin: ["гарбуз"],
  raspberries: ["малина"],
  "red-pepper": ["перець болгарськ червон", "болгарський червоний"],
  blueberries: ["чорниця"],
  seaweed: ["морської капусти"],

  // М'ясо та птиця
  "beef-steak": ["стейк яловичий"],
  "beef-tenderloin": ["яловичина, вирізка", "вирізка охолодж"],
  "chicken-heart": ["серце куряче"],
  "chicken-kiev": ["по-київськ"],
  "chicken-liver": ["печінка куряча"],
  "chicken-mince": ["фарш курячий"],
  "chicken-shashlik": ["шашлику з курки"],
  "chicken-thigh": ["стегно куряче"],
  "chicken-wings": ["крила курячі"],
  chicken: ["філе куряче"],
  duck: ["качка"],
  "lamb-ribs": ["баранина"],
  "lamb-shoulder": ["ягнятина"],
  "lard-garlic": ["сало солоне"],
  meatballs: ["тефтелі"],
  "mixed-mince": ["фарш свинячо"],
  "pork-neck": ["шийка"],
  "pork-shashlik": ["шашлику зі свинини"],
  "pork-shoulder": ["свинина, лопатка"],
  quail: ["перепілка"],
  rabbit: ["кролик"],
  "smoked-lard": ["сало копчене"],
  "stuffed-peppers": ["голубці"],
  "turkey-breast": ["грудка індич"],
  "veal-shank": ["телятина"],
  salami: ["салямі"],
  sausage: ["ковбаса докторськ"],

  // Риба та морепродукти
  "black-caviar": ["ікра мойви"],
  "crab-sticks": ["палички крабові"],
  "dried-roach": ["тарань"],
  "fish-batter": ["кляри"],
  hake: ["хек"],
  lobster: ["лобстер"],
  mackerel: ["скумбрія замор"],
  mussels: ["мідії"],
  oysters: ["устриці"],
  "red-caviar": ["ікра лосося"],
  shrimp: ["креветки"],
  "smoked-mackerel": ["скумбрія копчена"],
  snails: ["равлики"],
};

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

const CYRILLIC_LETTER = /[а-яіїєґА-ЯІЇЄҐ]/;
function containsWord(text, keyword) {
  const idx = text.indexOf(keyword);
  if (idx === -1) return false;
  const before = text[idx - 1];
  const after = text[idx + keyword.length];
  if (before && CYRILLIC_LETTER.test(before)) return false;
  if (after && CYRILLIC_LETTER.test(after)) return false;
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
    console.error(`Немає папки ${SOURCE_DIR}. Спочатку docker cp туди фото.`);
    process.exit(1);
  }

  const products = await prisma.product.findMany({
    where: { OR: [{ image: null }, { image: "" }] },
  });
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
