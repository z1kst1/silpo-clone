<<<<<<< HEAD
export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 Сільпо клон | Навчальний проєкт</p>
=======
import { useLocation, Link } from "react-router"; // Додай цей імпорт зверху

export default function Footer() {
  const location = useLocation(); // Отримуємо поточну сторінку

  if (
    location.pathname.startsWith("/catalog") ||
    location.pathname.startsWith("/categories")
  ) {
    return null;
  }

  return (
    <footer style={{ width: "100%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#333", backgroundColor: "#f5f5f5" }}>

      {/* 1. ВЕРХНІЙ БЛОК (SEO ТА ТЕКСТ) - БІЛИЙ ФОН */}
      <div style={{ backgroundColor: "#ffffff", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: "#000" }}>
            Онлайн-супермаркет “Kalpo” - ваша зручна доставка продуктів додому
          </h2>
          <p style={{ fontSize: "12px", lineHeight: "1.5", color: "#444", marginBottom: "16px" }}>
            Доставка продуктів у будь-який куточок міста - найкраще рішення, якщо немає часу або бажання ходити ринком й магазином чи тягати важкі пакунки. Замовити все для смакування, готування й прибирання ви зможете у зручному онлайн-супермаркеті “Kalpo”. Наші Смаковершники оперативно привезуть все необхідне прямісінько до дверей.
          </p>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", color: "#000" }}>
            Все як в магазині, але зі зручним замовленням продуктів онлайн
          </h3>
          <p style={{ fontSize: "12px", lineHeight: "1.5", color: "#444", marginBottom: "16px" }}>
            Супермаркет “Kalpo” в форматі онлайн - це великий асортимент товарів, включаючи власний імпорт, кулінарних шедеврів власної пекарні й товари марки “Премія”. Ціни
          </p>
          <button style={{ background: "none", border: "none", color: "#1e40af", fontSize: "14px", fontWeight: "600", cursor: "pointer", padding: 0 }}>
            Читати більше
          </button>
        </div>
      </div>

      {/* 2. СЕРЕДНІЙ БЛОК (НАВІГАЦІЯ ПО КОЛОНКАХ) */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>

        {/* Колонка 1 */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", color: "#000" }}>Онлайн-супермаркет</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { name: "Головна", path: "/" },
              { name: "Замовлення", path: "/orders" },
              { name: "Формування замовлення", path: "#" },
              { name: "Отримання замовлення", path: "#" },
              { name: "Зміни у замовленні", path: "#" },
              { name: "Види доставок", path: "#" },
              { name: "Правила інтернет-продажів", path: "#" }
            ].map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  /* Додаємо прокрутку вгору при кліку */
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Колонка 2 */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", color: "#000" }}>Для Гостей</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Про Власний Рахунок", "Правила програми Власний Рахунок", "Підписка Власний Рахунок Плюс", "Запитання та відповіді", "Супермаркети", "Цінотижики", "Події", "Подарункові сертифікати", "“Kalpo” для Бізнесу", "Доставка для бізнесу (Безготівкова оплата)", "Гостям"].map((item) => (
              <li key={item}><Link to="#" style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}>{item}</Link></li>
            ))}
          </ul>
        </div>

        {/* Колонка 3 */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", color: "#000" }}>Цікавинки</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Екодружність", "Соціальна турбота", "“Лавка Традицій”", "“Власна кондитерська”", "Простір Фестивалю", "Друзі “Kalpo”", "Дизайнерські супермаркети", "Радіо “Kalpo”", "Більше Цікавинок"].map((item) => (
              <li key={item}><Link to="#" style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}>{item}</Link></li>
            ))}
          </ul>
        </div>

        {/* Колонка 4 */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", color: "#000" }}>Про Компанію</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Робота в “Kalpo”", "Новини", "Звітність", "Контакти", "Політики Компанії", "Публічна оферта", "Політика конфіденційності", "Правила безпеки", "Регламент роботи Гарячої Лінії"].map((item) => (
              <li key={item}><Link to="#" style={{ fontSize: "12px", color: "#666", textDecoration: "none" }}>{item}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. НИЖНІЙ БЛОК (КОНТАКТИ ТА СОЦМЕРЕЖІ) */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px", borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>

        {/* Контакти */}
        <div style={{ display: "flex", gap: "40px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>Гаряча лінія у межах України</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              0 800 301 707
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#333" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              program@kalpo.ua
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>Для дзвінків з-за кордону</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "700" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              +38 044 496 32 38
            </div>
          </div>
        </div>

        {/* Додаток та Соцмережі */}
        <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          {/* Мобільний застосунок */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fdf8e4", padding: "8px 12px", borderRadius: "8px" }}>
             <div style={{ fontWeight: "700", color: "#d97706", fontSize: "14px" }}>Kalpo</div>
             <div>
               <div style={{ fontSize: "10px", color: "#888" }}>Завантажити</div>
               <div style={{ fontSize: "12px", fontWeight: "600" }}>Мобільний застосунок</div>
             </div>
          </div>

          {/* Соціальні мережі */}
          <div>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "8px", textAlign: "right" }}>“Kalpo” у соціальних мережах</div>
            <div style={{ display: "flex", gap: "12px" }}>
              {/* FB */}
              <a href="#" style={{ width: "24px", height: "24px", background: "#1877F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none" }}>f</a>
              {/* Telegram */}
              <a href="#" style={{ width: "24px", height: "24px", background: "#0088cc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.282-.346-.09l-6.4 4.024-2.76-.86c-.6-.185-.61-.6.125-.89l10.736-4.133c.5-.186.936.115.753.89z"/></svg>
              </a>
              {/* Viber (Generic icon) */}
              <a href="#" style={{ width: "24px", height: "24px", background: "#7360f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
              {/* Instagram */}
              <a href="#" style={{ width: "24px", height: "24px", background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              {/* X / Twitter */}
              <a href="#" style={{ width: "24px", height: "24px", background: "#000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                 <span style={{ fontSize: "14px", fontWeight: "bold" }}>X</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Копірайт */}
      <div style={{ backgroundColor: "#e8e8e8", padding: "16px 24px", fontSize: "12px", color: "#666", textAlign: "left" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          © Kalpo, 2026
        </div>
      </div>
>>>>>>> feature/reviews-orders
    </footer>
  );
}
