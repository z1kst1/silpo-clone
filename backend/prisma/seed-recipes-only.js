require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const recipes = [
  {
    title: "Сирні бейгли",
    image: "/images/figma/recipes/cheese-bagels.jpg",
    description: "Хрусткі домашні бейгли з вершковим сиром.",
  },
  {
    title: "Паста-салат з куркою",
    image: "/images/figma/recipes/pasta-salad.jpg",
    description: "Легкий салат з пастою і курячим філе.",
  },
  {
    title: "Фалафель",
    image: "/images/figma/recipes/falafel.jpg",
    description: "Хрусткі шарики з нуту з ароматними спеціями.",
  },
  {
    title: "Фісташкове тирамісу",
    image: "/images/figma/recipes/pistachio-tiramisu.jpg",
    description: "Італійський десерт з фісташковим присмаком.",
  },
  {
    title: "Відкритий сендвіч з редискою та авокадо",
    image: "/images/figma/recipes/radish-avocado-sandwich.jpg",
    description: "Свіжий і корисний перекус на щодень.",
  },
  {
    title: "Мічелада",
    image: "/images/figma/recipes/michelada.jpg",
    description: "Мексиканський пивний коктейль зі спеціями.",
  },
  {
    title: "Вівчарський пиріг",
    image: "/images/figma/recipes/shepherds-pie.jpg",
    description: "Британська класика з картопляним пюре та м'ясом.",
  },
  {
    title: "Паста з горілкою та лимоном",
    image: "/images/figma/recipes/vodka-lemon-pasta.jpg",
    description: "Вершкова паста з цитрусовими нотками.",
  },
  {
    title: "Віденський шніцель",
    image: "/images/figma/recipes/viennese-schnitzel.jpg",
    description: "Хрустка класика австрійської кухні.",
  },
  {
    title: "Пісний салат з капусти з фініковою заправкою",
    image: "/images/figma/recipes/cabbage-date-salad.jpg",
    description: "Легкий і солодкуватий овочевий салат.",
  },
  {
    title: "Запечена редиска із соусом",
    image: "/images/figma/recipes/baked-radish.jpg",
    description: "Несподіваний гарнір з печеної редиски.",
  },
];

async function main() {
  console.log("🌱 Додаю тільки рецепти (товари не чіпаю)...");

  const existingCount = await prisma.recipe.count();
  if (existingCount > 0) {
    console.log(`⚠️  В БД вже є ${existingCount} рецептів. Нічого не роблю.`);
    return;
  }

  const result = await prisma.recipe.createMany({ data: recipes });
  console.log(`✅ Додано ${result.count} рецептів.`);
}

main()
  .catch((e) => {
    console.error("❌ Помилка seed рецептів:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
