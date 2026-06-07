const defaultProducts = [
<<<<<<< HEAD
  {
    id: 1,
    name: "Яблука",
    price: 25,
    category: "Фрукти",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    weight: "1 кг",
    description:
      "Свіжі соковиті яблука для щоденного раціону. Підійдуть для перекусу, випічки та фруктових салатів.",
  },
  {
    id: 2,
    name: "Банани",
    price: 40,
    category: "Фрукти",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    weight: "1 кг",
    description:
      "Стиглі банани з ніжною м’якоттю. Добре смакують на сніданок, у десертах та смузі.",
  },
  {
    id: 3,
    name: "Апельсини",
    price: 48,
    category: "Фрукти",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg",
    weight: "1 кг",
    description:
      "Ароматні апельсини з приємною кислинкою. Чудовий вибір для соків та свіжих перекусів.",
  },
  {
    id: 4,
    name: "Молоко",
    price: 32,
    category: "Молочні продукти",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Bottle_of_milk.jpg",
    weight: "900 мл",
    description:
      "Молоко щоденного споживання, яке підходить для сніданків, випічки та гарячих напоїв.",
  },
  {
    id: 5,
    name: "Сир",
    price: 85,
    category: "Молочні продукти",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Cheese.jpg",
    weight: "300 г",
    description:
      "Твердий сир із насиченим смаком. Добре підходить для бутербродів, пасти та салатів.",
  },
  {
    id: 6,
    name: "Йогурт",
    price: 38,
    category: "Молочні продукти",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/69/Yogurt.jpg",
    weight: "280 г",
    description:
      "Ніжний йогурт для легкого перекусу. Зручний варіант для сніданку або паузи протягом дня.",
  },
  {
    id: 7,
    name: "Помідори",
    price: 55,
    category: "Овочі",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    weight: "1 кг",
    description:
      "Соковиті червоні помідори для салатів, гарнірів та щоденного використання на кухні.",
  },
  {
    id: 8,
    name: "Огірки",
    price: 48,
    category: "Овочі",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Cucumis_sativus_001.JPG",
    weight: "1 кг",
    description:
      "Свіжі хрусткі огірки, які чудово підходять для салатів і легких закусок.",
  },
  {
    id: 9,
    name: "Картопля",
    price: 27,
    category: "Овочі",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/60/Potato_and_cross_section.jpg",
    weight: "1 кг",
    description:
      "Універсальна картопля для смаження, варіння та запікання. Базовий продукт для багатьох страв.",
  },
=======
  // --- ТВІЙ СТАРИЙ СПИСОК ---
  {
    id: 1,
    title: 'Філе куряче "Епікур" охолоджене, малий лоток',
    price: 19.40,
    oldPrice: 27.40,
    discount: 29,
    weight: "100 г",
    image: "/images/figma/products/chicken.png",
    badgeText: "Ціно тижики",
    badgeBg: "#ffdf00",
    badgeColor: "#000"
  },
  {
    id: 2,
    title: "Виноград білий без кісточки",
    price: 120.12,
    oldPrice: 154.00,
    discount: 22,
    weight: "500 г",
    image: "/images/figma/products/grapes.png",
    badgeText: "%",
    badgeBg: "#ff9900",
    badgeColor: "#fff"
  },
  {
    id: 3,
    title: "Пиво Corona Extra світле",
    price: 42.99,
    oldPrice: 74.99,
    discount: 43,
    weight: "0,33 л",
    image: "/images/figma/products/corona.png",
    badgeText: "Ціно тижики",
    badgeBg: "#ffdf00",
    badgeColor: "#000"
  },
  {
    id: 4,
    title: "Томати чері свіжі",
    price: 72.53,
    oldPrice: 92.90,
    discount: 22,
    weight: "200 г",
    image: "/images/figma/products/tomatoes.png",
    badgeText: "Ціно тижики",
    badgeBg: "#ffdf00",
    badgeColor: "#000"
  },
  {
    id: 5,
    title: "Напій Pepsi Cola",
    price: 54.99,
    oldPrice: 62.40,
    discount: 12,
    weight: "1,75 л",
    image: "/images/figma/products/pepsi.png",
    badgeText: "5+1",
    badgeBg: "#bbf3ff",
    badgeColor: "#0066cc",
    additionalInfo: "0.19 грн за кожну 6-у од"
  },
  {
    id: 6,
    title: "Папір туалетний NUA 3-шаровий",
    price: 359.00,
    oldPrice: 799.00,
    discount: 55,
    weight: "32 шт",
    image: "/images/figma/products/toilet-paper.png",
    badgeText: "Ціно тижики",
    badgeBg: "#ffdf00",
    badgeColor: "#000"
  },

  // --- НОВІ ЛОСОСІ ---
  {
    id: 101,
    title: "Сьомга, стейк охолоджений фасований",
    price: 94.90,
    weight: "100 г",
    rating: 4.3,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-1.jpg",
    description: "Свіжий стейк сьомги, ідеально підходить для запікання або смаження на грилі.",
    allergens: "РИБА"
  },
  {
    id: 102,
    title: "Сьомга (лосось) філе охолоджене",
    price: 109.90,
    weight: "100 г",
    rating: 3.9,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-2.jpg",
    description: "Ніжне філе сьомги без кісток, багате на Омега-3.",
    allergens: "РИБА"
  },
  {
    id: 103,
    title: "Форель, стейк охолоджений фасований",
    price: 98.89,
    weight: "100 г",
    rating: 4.3,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-3.jpg",
    description: "Стейк форелі преміум якості.",
    allergens: "РИБА"
  },
  {
    id: 104,
    title: "Форель, філе охолоджене",
    price: 109.90,
    weight: "100 г",
    rating: 3.9,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-4.jpg",
    description: "Свіже філе форелі, готове до кулінарної обробки.",
    allergens: "РИБА"
  },
  {
    id: 105,
    title: "Голець арктичний, шматок охолоджений",
    price: 109.90,
    weight: "100 г",
    rating: 4.1,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-5.jpg",
    description: "Арктичний голець з ніжним смаком, що нагадує лосося.",
    allergens: "РИБА"
  },
  {
    id: 106,
    title: "Форель, філе охолоджене в упаковці",
    price: 119.90,
    weight: "100 г",
    rating: 3.4,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-6.jpg",
    description: "Філе форелі у зручній вакуумній упаковці.",
    allergens: "РИБА"
  },
  {
    id: 107,
    title: "Шматочки з форелі охолоджені",
    price: 94.90,
    weight: "100 г",
    rating: 4.0,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-7.jpg",
    description: "Шматочки форелі, ідеальні для супів або салатів.",
    allergens: "РИБА"
  },
  {
    id: 108,
    title: "Лосось, хребти дефростовані",
    price: 16.90,
    weight: "100 г",
    rating: 3.4,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-8.jpg",
    description: "Хребти лосося, чудово підходять для наваристих рибних бульйонів.",
    allergens: "РИБА"
  },
  {
    id: 109,
    title: "Сьомга (лосось) охолоджена спецобробка",
    price: 99.90,
    weight: "100 г",
    rating: 4.2,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-9.jpg",
    description: "Сьомга спеціальної обробки, підготовлена для тривалого зберігання.",
    allergens: "РИБА"
  },
  {
    id: 110,
    title: "Форель охолоджена спецобробка",
    price: 86.90,
    weight: "100 г",
    rating: 4.5,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-10.jpg",
    description: "Форель спеціальної обробки, готова до запікання.",
    allergens: "РИБА"
  },
  {
    id: 111,
    title: "Лосось шотландський Lable Rouge, стейки охолоджені",
    price: 259.90,
    weight: "100 г",
    rating: 4.8,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-11.jpg",
    description: "Преміальний шотландський лосось стандарту Label Rouge.",
    allergens: "РИБА"
  },
  {
    id: 112,
    title: "Сьомга (лосось) стейк фасований 300-600 г охолоджений",
    price: 96.90,
    weight: "100 г",
    rating: 3.2,
    category: "Свіжа риба",
    image: "/images/figma/products/fish/fish-12.jpg",
    description: "Великі стейки сьомги у фасовці від 300 до 600 грамів.",
    allergens: "РИБА"
  }
>>>>>>> feature/reviews-orders
];

export default defaultProducts;
