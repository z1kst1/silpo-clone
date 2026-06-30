import { useState } from "react";
import { Link } from "react-router";

const sidebarCategories = [
  {
    id: "promo",
    name: "Добрі промо",
    icon: "/images/figma/icons/categories/promo.svg",
  },
  {
    id: "fruits",
    name: "Фрукти, овочі",
    icon: "/images/figma/icons/categories/fruits.svg",
  },
  {
    id: "meat",
    name: "М'ясо",
    icon: "/images/figma/icons/categories/meat.svg",
  },
  { id: "fish", name: "Риба", icon: "/images/figma/icons/categories/fish.svg" },
  {
    id: "sausages",
    name: "Ковбаси та делікатеси",
    icon: "/images/figma/icons/categories/sausages.svg",
  },
  {
    id: "cheese",
    name: "Сири",
    icon: "/images/figma/icons/categories/cheese.svg",
  },
  {
    id: "bakery",
    name: "Хліб та випічка",
    icon: "/images/figma/icons/categories/bread.svg",
  },
  {
    id: "food",
    name: "Готові страви і кулінарія",
    icon: "/images/figma/icons/categories/food.svg",
  },
  {
    id: "milk",
    name: "Молочка та яйця",
    icon: "/images/figma/icons/categories/milk.svg",
  },
  {
    id: "brands",
    name: "Власні марки",
    icon: "/images/figma/icons/categories/brands.svg",
  },
  {
    id: "tradition",
    name: "Лавка Традицій",
    icon: "/images/figma/icons/categories/tradition.svg",
  },
  {
    id: "healthy",
    name: "Здорове харчування",
    icon: "/images/figma/icons/categories/healthy.svg",
  },
  {
    id: "cans",
    name: "Бакалія і консерви",
    icon: "/images/figma/icons/categories/cans.svg",
  },
  {
    id: "sauces",
    name: "Соуси і спеції",
    icon: "/images/figma/icons/categories/sauces.svg",
  },
  {
    id: "sweets",
    name: "Солодощі",
    icon: "/images/figma/icons/categories/sweets.svg",
  },
];

const promoBanners = [
  {
    id: "post",
    name: "Все до посту",
    img: "/images/figma/banners/promo-post.png",
    link: "/catalog?category=Добрі промо",
  },
  {
    id: "wine",
    name: "Дрібногурт на вино - до -30%",
    img: "/images/figma/banners/promo-wine.png",
    link: "/catalog?category=Добрі промо",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/promo-all.png",
    link: "/catalog?category=Добрі промо",
  },
];

const fruitsBanners = [
  {
    id: "seasonal",
    name: "Сезонні овочі, фрукти",
    img: "/images/figma/banners/fruits/seasonal.png",
    link: "/catalog?category=Фрукти, овочі",
  },
  {
    id: "fruits",
    name: "Фрукти",
    img: "/images/figma/banners/fruits/fruits.png",
    link: "/catalog?category=Фрукти, овочі&subcategory=Фрукти",
  },
  {
    id: "berries",
    name: "Ягоди",
    img: "/images/figma/banners/fruits/berries.png",
    link: "/catalog?category=Фрукти, овочі",
  },
  {
    id: "vegetables",
    name: "Овочі",
    img: "/images/figma/banners/fruits/vegetables.png",
    link: "/catalog?category=Фрукти, овочі&subcategory=Овочі",
  },
  {
    id: "greens",
    name: "Зелень і салати",
    img: "/images/figma/banners/fruits/greens.png",
    link: "/catalog?category=Фрукти, овочі",
  },
  {
    id: "mushrooms",
    name: "Гриби",
    img: "/images/figma/banners/fruits/mushrooms.png",
    link: "/catalog?category=Фрукти, овочі",
  },
  {
    id: "smoothies",
    name: "Смузі і фреші",
    img: "/images/figma/banners/fruits/smoothies.png",
    link: "/catalog?category=Фрукти, овочі",
  },
  {
    id: "snacks",
    name: "Фруктові, овочеві снеки",
    img: "/images/figma/banners/fruits/snacks.png",
    link: "/catalog?category=Фрукти, овочі",
  },
  {
    id: "nuts",
    name: "Горіхи і сухофрукти",
    img: "/images/figma/banners/fruits/nuts.png",
    link: "/catalog?category=Фрукти, овочі",
  },
  {
    id: "pickles",
    name: "Соління",
    img: "/images/figma/banners/fruits/pickles.png",
    link: "/catalog?category=Фрукти, овочі",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/fruits/all.png",
    link: "/catalog?category=Фрукти, овочі",
  },
];

const meatBanners = [
  {
    id: "steaks",
    name: "Стейки",
    img: "/images/figma/banners/meat/steaks.png",
    link: "/catalog?category=М'ясо&subcategory=Стейки",
  },
  {
    id: "bbq",
    name: "М'ясо для шашлику",
    img: "/images/figma/banners/meat/bbq.png",
    link: "/catalog?category=М'ясо",
  },
  {
    id: "game",
    name: "Дичина",
    img: "/images/figma/banners/meat/game.png",
    link: "/catalog?category=М'ясо",
  },
  {
    id: "lamb",
    name: "Баранина та ягнятина",
    img: "/images/figma/banners/meat/lamb.png",
    link: "/catalog?category=М'ясо",
  },
  {
    id: "rabbit",
    name: "Кролятина",
    img: "/images/figma/banners/meat/rabbit.png",
    link: "/catalog?category=М'ясо",
  },
  {
    id: "lard",
    name: "Сало",
    img: "/images/figma/banners/meat/lard.png",
    link: "/catalog?category=М'ясо",
  },
  {
    id: "semi",
    name: "М'ясні напівфабрикати",
    img: "/images/figma/banners/meat/semi.png",
    link: "/catalog?category=М'ясо",
  },
  {
    id: "beef",
    name: "Яловичина та телятина",
    img: "/images/figma/banners/meat/beef.png",
    link: "/catalog?category=М'ясо&subcategory=Яловичина та телятина",
  },
  {
    id: "offal",
    name: "Субпродукти",
    img: "/images/figma/banners/meat/offal.png",
    link: "/catalog?category=М'ясо",
  },
  {
    id: "diet",
    name: "Дієтичне м'ясо",
    img: "/images/figma/banners/meat/diet.png",
    link: "/catalog?category=М'ясо",
  },
  {
    id: "mince",
    name: "Фарш",
    img: "/images/figma/banners/meat/mince.png",
    link: "/catalog?category=М'ясо&subcategory=Фарш",
  },
  {
    id: "pork",
    name: "Свинина",
    img: "/images/figma/banners/meat/pork.png",
    link: "/catalog?category=М'ясо&subcategory=Свинина",
  },
  {
    id: "poultry",
    name: "М'ясо птиці",
    img: "/images/figma/banners/meat/poultry.png",
    link: "/catalog?category=М'ясо&subcategory=М'ясо птиці",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/meat/all.png",
    link: "/catalog?category=М'ясо",
  },
];

const fishBanners = [
  {
    id: "prepared",
    name: "Приготовлена риба, салат",
    img: "/images/figma/banners/fish/prepared.png",
    link: "/catalog?category=Свіжа риба",
  },
  {
    id: "smoked",
    name: "Копчена і в'ялена риба",
    img: "/images/figma/banners/fish/smoked.png",
    link: "/catalog?category=Свіжа риба",
  },
  {
    id: "fresh",
    name: "Свіжа риба",
    img: "/images/figma/banners/fish/fresh.png",
    link: "/catalog?category=Свіжа риба&subcategory=Свіжа риба",
  },
  {
    id: "frozen",
    name: "Заморожена риба",
    img: "/images/figma/banners/fish/frozen.png",
    link: "/catalog?category=Свіжа риба&subcategory=Заморожена риба",
  },
  {
    id: "roe",
    name: "Ікра",
    img: "/images/figma/banners/fish/roe.png",
    link: "/catalog?category=Свіжа риба",
  },
  {
    id: "seafood",
    name: "Морепродукти та молюски",
    img: "/images/figma/banners/fish/seafood.png",
    link: "/catalog?category=Свіжа риба",
  },
  {
    id: "sticks",
    name: "Крабові палички",
    img: "/images/figma/banners/fish/sticks.png",
    link: "/catalog?category=Свіжа риба",
  },
  {
    id: "semi",
    name: "Рибні напівфабрикати",
    img: "/images/figma/banners/fish/semi.png",
    link: "/catalog?category=Свіжа риба&subcategory=Рибні напівфабрикати",
  },
  {
    id: "oysters",
    name: "Устриці та лобстери",
    img: "/images/figma/banners/fish/oysters.png",
    link: "/catalog?category=Свіжа риба",
  },
  {
    id: "snails",
    name: "Заморожені равлики",
    img: "/images/figma/banners/fish/snails.png",
    link: "/catalog?category=Свіжа риба",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/fish/all.png",
    link: "/catalog?category=Свіжа риба",
  },
];

const sausagesBanners = [
  {
    id: "frankfurters",
    name: "Сосиски і сардельки",
    img: "/images/figma/banners/sausages/sausages-frankfurters.png",
    link: "/catalog?category=Ковбаси та делікатеси&subcategory=Сосиски і сардельки",
  },
  {
    id: "types",
    name: "Ковбаси",
    img: "/images/figma/banners/sausages/sausages-types.png",
    link: "/catalog?category=Ковбаси та делікатеси&subcategory=Ковбаси",
  },
  {
    id: "meats",
    name: "М'ясні делікатеси",
    img: "/images/figma/banners/sausages/sausages-meats.png",
    link: "/catalog?category=Ковбаси та делікатеси&subcategory=М'ясні делікатеси",
  },
  {
    id: "ham",
    name: "Хамон",
    img: "/images/figma/banners/sausages/ham.png",
    link: "/catalog?category=Ковбаси та делікатеси",
  },
  {
    id: "lard",
    name: "Сало",
    img: "/images/figma/banners/sausages/lard.png",
    link: "/catalog?category=Ковбаси та делікатеси",
  },
  {
    id: "snacks",
    name: "М'ясні снеки",
    img: "/images/figma/banners/sausages/snacks.png",
    link: "/catalog?category=Ковбаси та делікатеси",
  },
  {
    id: "slices",
    name: "М'ясо-ковбасна нарізка",
    img: "/images/figma/banners/sausages/slices.png",
    link: "/catalog?category=Ковбаси та делікатеси&subcategory=М'ясо-ковбасна нарізка",
  },
  {
    id: "vegan",
    name: "Веган",
    img: "/images/figma/banners/sausages/vegan.png",
    link: "/catalog?category=Ковбаси та делікатеси",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/sausages/all.png",
    link: "/catalog?category=Ковбаси та делікатеси",
  },
];

const cheeseBanners = [
  {
    id: "mold",
    name: "Сири з пліснявою",
    img: "/images/figma/banners/cheese/mold.png",
    link: "/catalog?category=Сири&subcategory=Сири з пліснявою",
  },
  {
    id: "brine",
    name: "Сири розсільні",
    img: "/images/figma/banners/cheese/brine.png",
    link: "/catalog?category=Сири&subcategory=Розсільні сири",
  },
  {
    id: "hard",
    name: "Тверді і напівтверді сири",
    img: "/images/figma/banners/cheese/hard.png",
    link: "/catalog?category=Сири&subcategory=Тверді і напівтверді сири",
  },
  {
    id: "goat-sheep",
    name: "Козячі і овечі сири",
    img: "/images/figma/banners/cheese/goat-sheep.png",
    link: "/catalog?category=Сири",
  },
  {
    id: "cream",
    name: "Крем-сири",
    img: "/images/figma/banners/cheese/cream.png",
    link: "/catalog?category=Сири",
  },
  {
    id: "processed",
    name: "Сири плавлені",
    img: "/images/figma/banners/cheese/processed.png",
    link: "/catalog?category=Сири",
  },
  {
    id: "kids",
    name: "Сири для дітей",
    img: "/images/figma/banners/cheese/kids.png",
    link: "/catalog?category=Сири",
  },
  {
    id: "sets",
    name: "Набори сирів",
    img: "/images/figma/banners/cheese/sets.png",
    link: "/catalog?category=Сири",
  },
  {
    id: "sauces",
    name: "Соуси до сирів",
    img: "/images/figma/banners/cheese/sauces.png",
    link: "/catalog?category=Сири",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/cheese/all.png",
    link: "/catalog?category=Сири",
  },
];

const bakeryBanners = [
  {
    id: "own",
    name: "Власна випічка Kalpo",
    img: "/images/figma/banners/bakery/own.png",
    link: "/catalog?category=Хліб та випічка",
  },
  {
    id: "bread",
    name: "Хлібобулочні вироби",
    img: "/images/figma/banners/bakery/bread.png",
    link: "/catalog?category=Хліб та випічка&subcategory=Хлібобулочні вироби",
  },
  {
    id: "pastries",
    name: "Випічка",
    img: "/images/figma/banners/bakery/pastries.png",
    link: "/catalog?category=Хліб та випічка&subcategory=Випічка",
  },
  {
    id: "bases",
    name: "Коржі, основа для піци",
    img: "/images/figma/banners/bakery/bases.png",
    link: "/catalog?category=Хліб та випічка",
  },
  {
    id: "dry",
    name: "Сушка, хлібці пряники",
    img: "/images/figma/banners/bakery/dry.png",
    link: "/catalog?category=Хліб та випічка",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/bakery/all.png",
    link: "/catalog?category=Хліб та випічка",
  },
];

const foodBanners = [
  {
    id: "pancakes",
    name: "Млинці, сирники, запіканки",
    img: "/images/figma/banners/food/pancakes.png",
    link: "/catalog?category=Готові страви і кулінарія&subcategory=Млинці, сирники, запіканки",
  },
  {
    id: "soups",
    name: "Перші страви",
    img: "/images/figma/banners/food/soups.png",
    link: "/catalog?category=Готові страви і кулінарія",
  },
  {
    id: "main-dishes",
    name: "Другі страви",
    img: "/images/figma/banners/food/main-dishes.png",
    link: "/catalog?category=Готові страви і кулінарія&subcategory=Другі страви",
  },
  {
    id: "sushi-pizza",
    name: "Суші, піца, бургери",
    img: "/images/figma/banners/food/sushi-pizza.png",
    link: "/catalog?category=Готові страви і кулінарія&subcategory=Суші, піца, бургери",
  },
  {
    id: "salads",
    name: "Салати та закуски",
    img: "/images/figma/banners/food/salads.png",
    link: "/catalog?category=Готові страви і кулінарія&subcategory=Салати та закуски",
  },
  {
    id: "desserts",
    name: "Десерти та напої",
    img: "/images/figma/banners/food/desserts.png",
    link: "/catalog?category=Готові страви і кулінарія",
  },
  {
    id: "breakfasts",
    name: "Сніданки та комплексні обіди",
    img: "/images/figma/banners/food/breakfasts.png",
    link: "/catalog?category=Готові страви і кулінарія",
  },
  {
    id: "pies",
    name: "Пироги, пиріжки, випічка",
    img: "/images/figma/banners/food/pies.png",
    link: "/catalog?category=Готові страви і кулінарія",
  },
  {
    id: "semi",
    name: "Напівфабрикати власного виробництва",
    img: "/images/figma/banners/food/semi.png",
    link: "/catalog?category=Готові страви і кулінарія&subcategory=Напівфабрикати власного виробництва",
  },
  {
    id: "healthy",
    name: "Жуйстика Kalpo",
    img: "/images/figma/banners/food/healthy.png",
    link: "/catalog?category=Готові страви і кулінарія",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/food/all.png",
    link: "/catalog?category=Готові страви і кулінарія",
  },
];

const milkBanners = [
  {
    id: "eggs",
    name: "Яйця",
    img: "/images/figma/banners/milk/eggs.png",
    link: "/catalog?category=Молочка та яйця&subcategory=Яйця",
  },
  {
    id: "milk",
    name: "Молоко, вершки",
    img: "/images/figma/banners/milk/milk.png",
    link: "/catalog?category=Молочка та яйця&subcategory=Молоко, вершки",
  },
  {
    id: "butter",
    name: "Масло, маргарин, спред",
    img: "/images/figma/banners/milk/butter.png",
    link: "/catalog?category=Молочка та яйця&subcategory=Масло, маргарин, спред",
  },
  {
    id: "kefir",
    name: "Кисломолочні напої",
    img: "/images/figma/banners/milk/kefir.png",
    link: "/catalog?category=Молочка та яйця&subcategory=Кисломолочні напої",
  },
  {
    id: "cottage",
    name: "Сир Кисломолочний, сирок",
    img: "/images/figma/banners/milk/cottage.png",
    link: "/catalog?category=Молочка та яйця",
  },
  {
    id: "sour-cream",
    name: "Сметана",
    img: "/images/figma/banners/milk/sour-cream.png",
    link: "/catalog?category=Молочка та яйця&subcategory=Сметана",
  },
  {
    id: "yogurts",
    name: "Йогурти, десерти",
    img: "/images/figma/banners/milk/yogurts.png",
    link: "/catalog?category=Молочка та яйця&subcategory=Йогурти, десерти",
  },
  {
    id: "glazed-curds",
    name: "Глазуровані сирки",
    img: "/images/figma/banners/milk/glazed-curds.png",
    link: "/catalog?category=Молочка та яйця",
  },
  {
    id: "condensed",
    name: "Згущене молоко",
    img: "/images/figma/banners/milk/condensed.png",
    link: "/catalog?category=Молочка та яйця",
  },
  {
    id: "kids",
    name: "Молочні продукти для дітей",
    img: "/images/figma/banners/milk/kids.png",
    link: "/catalog?category=Молочка та яйця",
  },
  {
    id: "semi",
    name: "Напівфабрикати власного виробництва",
    img: "/images/figma/banners/milk/semi.png",
    link: "/catalog?category=Молочка та яйця",
  },
  {
    id: "dairy-free",
    name: "Безмолочна продукція",
    img: "/images/figma/banners/milk/dairy-free.png",
    link: "/catalog?category=Молочка та яйця",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/milk/all.png",
    link: "/catalog?category=Молочка та яйця",
  },
];

const brandsBanners = [
  {
    id: "hits",
    name: "Калпові хіти",
    img: "/images/figma/banners/brands/hits.png",
    link: "/catalog?category=Власні марки",
  },
  {
    id: "new",
    name: "Новинки",
    img: "/images/figma/banners/brands/new.png",
    link: "/catalog?category=Власні марки",
  },
  {
    id: "food",
    name: "Продукти",
    img: "/images/figma/banners/brands/food.png",
    link: "/catalog?category=Власні марки",
  },
  {
    id: "kitchen",
    name: "Для кухні",
    img: "/images/figma/banners/brands/kitchen.png",
    link: "/catalog?category=Власні марки",
  },
  {
    id: "home",
    name: "Для дому і краси",
    img: "/images/figma/banners/brands/home.png",
    link: "/catalog?category=Власні марки",
  },
  {
    id: "drinks",
    name: "Напої",
    img: "/images/figma/banners/brands/drinks.png",
    link: "/catalog?category=Власні марки",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/brands/all.png",
    link: "/catalog?category=Власні марки",
  },
];

const traditionBanners = [
  {
    id: "dairy",
    name: "Фермерське молоко, йогурти, сири",
    img: "/images/figma/banners/tradition/dairy.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "meat",
    name: "Крафтове м'ясо і ковбаса",
    img: "/images/figma/banners/tradition/meat.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "frozen",
    name: "Заморозка ручної ліпки",
    img: "/images/figma/banners/tradition/frozen.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "groceries",
    name: "Бакалія, соуси і мед",
    img: "/images/figma/banners/tradition/groceries.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "icecream",
    name: "Крафтове морозиво",
    img: "/images/figma/banners/tradition/icecream.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "snacks",
    name: "Снеки Лавка Традицій",
    img: "/images/figma/banners/tradition/snacks.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "tea",
    name: "Трав'яні збори, какао",
    img: "/images/figma/banners/tradition/tea.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "sweets",
    name: "Випічка і солодощі",
    img: "/images/figma/banners/tradition/sweets.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "drinks",
    name: "Напої і соки",
    img: "/images/figma/banners/tradition/drinks.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "decor",
    name: "Декор для дому",
    img: "/images/figma/banners/tradition/decor.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "alcohol",
    name: "Авторські алкогольні напої",
    img: "/images/figma/banners/tradition/alcohol.png",
    link: "/catalog?category=Лавка Традицій",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/tradition/all.png",
    link: "/catalog?category=Лавка Традицій",
  },
];

const healthyBanners = [
  {
    id: "organic",
    name: "Органічна їжа",
    img: "/images/figma/banners/healthy/organic.png",
    link: "/catalog?category=Здорове харчування&subcategory=Органічна їжа",
  },
  {
    id: "vegan",
    name: "Веганські продукти",
    img: "/images/figma/banners/healthy/vegan.png",
    link: "/catalog?category=Здорове харчування&subcategory=Веганські продукти",
  },
  {
    id: "lactose-free",
    name: "Безлактозні продукти",
    img: "/images/figma/banners/healthy/lactose-free.png",
    link: "/catalog?category=Здорове харчування",
  },
  {
    id: "gluten-free",
    name: "Безглютенові продукти",
    img: "/images/figma/banners/healthy/gluten-free.png",
    link: "/catalog?category=Здорове харчування",
  },
  {
    id: "sugar-free",
    name: "Без доданого цукру",
    img: "/images/figma/banners/healthy/sugar-free.png",
    link: "/catalog?category=Здорове харчування",
  },
  {
    id: "diet",
    name: "Дієтичне харчування",
    img: "/images/figma/banners/healthy/diet.png",
    link: "/catalog?category=Здорове харчування&subcategory=Дієтичне харчування",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/healthy/all.png",
    link: "/catalog?category=Здорове харчування",
  },
];

const cansBanners = [
  {
    id: "cereals",
    name: "Крупи",
    img: "/images/figma/banners/cans/cereals.png",
    link: "/catalog?category=Бакалія і консерви&subcategory=Крупи",
  },
  {
    id: "pasta",
    name: "Макаронні вироби",
    img: "/images/figma/banners/cans/pasta.png",
    link: "/catalog?category=Бакалія і консерви&subcategory=Макаронні вироби",
  },
  {
    id: "flour",
    name: "Борошно",
    img: "/images/figma/banners/cans/flour.png",
    link: "/catalog?category=Бакалія і консерви",
  },
  {
    id: "salt-sugar",
    name: "Сіль, цукор",
    img: "/images/figma/banners/cans/salt-sugar.png",
    link: "/catalog?category=Бакалія і консерви",
  },
  {
    id: "oil-vinegar",
    name: "Олія та оцет",
    img: "/images/figma/banners/cans/oil-vinegar.png",
    link: "/catalog?category=Бакалія і консерви&subcategory=Олія та оцет",
  },
  {
    id: "canned-food",
    name: "Консервація",
    img: "/images/figma/banners/cans/canned-food.png",
    link: "/catalog?category=Бакалія і консерви&subcategory=Консервація",
  },
  {
    id: "jam-honey",
    name: "Консервовані фрукти,\nварення, мед",
    img: "/images/figma/banners/cans/jam-honey.png",
    link: "/catalog?category=Бакалія і консерви",
  },
  {
    id: "instant-food",
    name: "Їжа швидкого приготування",
    img: "/images/figma/banners/cans/instant-food.png",
    link: "/catalog?category=Бакалія і консерви",
  },
  {
    id: "asian-food",
    name: "Азійська кухня",
    img: "/images/figma/banners/cans/asian-food.png",
    link: "/catalog?category=Бакалія і консерви",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/cans/all.png",
    link: "/catalog?category=Бакалія і консерви",
  },
];

const saucesBanners = [
  {
    id: "sauces",
    name: "Соуси, заправки",
    img: "/images/figma/banners/sauces/sauces.png",
    link: "/catalog?category=Соуси і спеції&subcategory=Соуси, заправки",
  },
  {
    id: "spices",
    name: "Спеції",
    img: "/images/figma/banners/sauces/spices.png",
    link: "/catalog?category=Соуси і спеції&subcategory=Спеції",
  },
  {
    id: "baking",
    name: "Все для випічки",
    img: "/images/figma/banners/sauces/baking.png",
    link: "/catalog?category=Соуси і спеції",
  },
  {
    id: "breading",
    name: "Панірування",
    img: "/images/figma/banners/sauces/breading.png",
    link: "/catalog?category=Соуси і спеції",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/sauces/all.png",
    link: "/catalog?category=Соуси і спеції",
  },
];

const sweetsBanners = [
  {
    id: "own-bakery",
    name: "Власна Кондитерська",
    img: "/images/figma/banners/sweets/own-bakery.png",
    link: "/catalog?category=Солодощі",
  },
  {
    id: "cakes",
    name: "Торти, тістечка",
    img: "/images/figma/banners/sweets/cakes.png",
    link: "/catalog?category=Солодощі",
  },
  {
    id: "chocolate",
    name: "Шоколад",
    img: "/images/figma/banners/sweets/chocolate.png",
    link: "/catalog?category=Солодощі&subcategory=Шоколад",
  },
  {
    id: "candies",
    name: "Цукерки",
    img: "/images/figma/banners/sweets/candies.png",
    link: "/catalog?category=Солодощі&subcategory=Цукерки",
  },
  {
    id: "cookies",
    name: "Печиво, вафлі, бісквіти",
    img: "/images/figma/banners/sweets/cookies.png",
    link: "/catalog?category=Солодощі&subcategory=Печиво, вафлі, бісквіти",
  },
  {
    id: "marshmallows",
    name: "Зефір, мармелад, пастила",
    img: "/images/figma/banners/sweets/marshmallows.png",
    link: "/catalog?category=Солодощі&subcategory=Зефір, мармелад, пастила",
  },
  {
    id: "oriental",
    name: "Східні солодощі",
    img: "/images/figma/banners/sweets/oriental.png",
    link: "/catalog?category=Солодощі&subcategory=Східні солодощі",
  },
  {
    id: "gum",
    name: "Жувальна гумка",
    img: "/images/figma/banners/sweets/gum.png",
    link: "/catalog?category=Солодощі",
  },
  {
    id: "all",
    name: "Дивитись всі",
    img: "/images/figma/banners/sweets/all.png",
    link: "/catalog?category=Солодощі",
  },
];

export default function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState("promo");

  return (
    <>
      <style>{`
        .kalpo-sidebar-scroll::-webkit-scrollbar { display: none; }
        .kalpo-sidebar-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "calc(100vh - 80px)",
          backgroundColor: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, backgroundColor: "#F5E6BE" }}></div>

        <div
          style={{
            width: "100%",
            maxWidth: "1440px",
            display: "flex",
            flexShrink: 0,
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{
              width: "280px",
              flexShrink: 0,
              backgroundColor: "#F5E6BE",
              borderRight: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <aside
              className="kalpo-sidebar-scroll"
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              {sidebarCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "0 24px",
                      cursor: "pointer",
                      backgroundColor: isActive
                        ? "rgba(139, 24, 27, 0.08)"
                        : "transparent",
                      position: "relative",
                      color: "#333",
                      fontSize: "14px",
                      fontWeight: isActive ? "700" : "500",
                      transition: "background-color 0.2s",
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "4px",
                          backgroundColor: "#8b181b",
                        }}
                      ></div>
                    )}
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#ccc",
                        borderRadius: "50%",
                        display: "none",
                      }}
                    ></div>
                    {cat.name}
                  </div>
                );
              })}
            </aside>
          </div>

          <main
            style={{
              flex: 1,
              padding: "32px 40px",
              backgroundColor: "#fff",
              overflowY: "auto",
              height: "100%",
            }}
          >
            <div style={{ width: "100%" }}>
              {activeCategory === "promo" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Добрі промо
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {promoBanners
                      .filter((b) => b.id !== "all" || promoBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "fruits" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Фрукти, овочі
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {fruitsBanners
                      .filter((b) => b.id !== "all" || fruitsBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "meat" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    М'ясо
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {meatBanners
                      .filter((b) => b.id !== "all" || meatBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "fish" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Риба
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {fishBanners
                      .filter((b) => b.id !== "all" || fishBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "sausages" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Ковбаси та делікатеси
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {sausagesBanners
                      .filter(
                        (b) => b.id !== "all" || sausagesBanners.length > 8,
                      )
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "cheese" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Сири
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {cheeseBanners
                      .filter((b) => b.id !== "all" || cheeseBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "bakery" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Хліб та випічка
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {bakeryBanners
                      .filter((b) => b.id !== "all" || bakeryBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "food" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Готові страви і кулінарія
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {foodBanners
                      .filter((b) => b.id !== "all" || foodBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "milk" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Молочка та яйця
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {milkBanners
                      .filter((b) => b.id !== "all" || milkBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "brands" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Власні марки
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {brandsBanners
                      .filter((b) => b.id !== "all" || brandsBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "tradition" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Лавка Традицій
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {traditionBanners
                      .filter(
                        (b) => b.id !== "all" || traditionBanners.length > 8,
                      )
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "healthy" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Здорове харчування
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {healthyBanners
                      .filter(
                        (b) => b.id !== "all" || healthyBanners.length > 8,
                      )
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "cans" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Бакалія і консерви
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {cansBanners
                      .filter((b) => b.id !== "all" || cansBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "sauces" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Соуси і спеції
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {saucesBanners
                      .filter((b) => b.id !== "all" || saucesBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory === "sweets" && (
                <div>
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "700",
                      marginBottom: "24px",
                      color: "#222",
                    }}
                  >
                    Солодощі
                  </h1>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                  >
                    {sweetsBanners
                      .filter((b) => b.id !== "all" || sweetsBanners.length > 8)
                      .map((b) => (
                        <Link
                          key={b.id}
                          to={b.link}
                          style={{ textDecoration: "none", display: "block" }}
                        >
                          <img
                            src={b.img}
                            alt={b.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                              transition: "transform 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-4px)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(0)")
                            }
                          />
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {activeCategory !== "promo" &&
                activeCategory !== "fruits" &&
                activeCategory !== "meat" &&
                activeCategory !== "fish" &&
                activeCategory !== "sausages" &&
                activeCategory !== "cheese" &&
                activeCategory !== "bakery" &&
                activeCategory !== "food" &&
                activeCategory !== "milk" &&
                activeCategory !== "brands" &&
                activeCategory !== "tradition" &&
                activeCategory !== "healthy" &&
                activeCategory !== "cans" &&
                activeCategory !== "sauces" &&
                activeCategory !== "sweets" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "50vh",
                      color: "#888",
                    }}
                  >
                    <h2>
                      {
                        sidebarCategories.find((c) => c.id === activeCategory)
                          ?.name
                      }
                    </h2>
                  </div>
                )}
            </div>
          </main>
        </div>

        <div style={{ flex: 1, backgroundColor: "#fff" }}></div>
      </div>
    </>
  );
}
