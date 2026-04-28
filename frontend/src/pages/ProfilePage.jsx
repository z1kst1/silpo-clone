import { useState } from "react";

const orders = [
  { id: 1256, date: "12.05.2024", total: "1 238 ₴", status: "Доставлено" },
  { id: 1189, date: "03.05.2024", total: "856 ₴", status: "Доставлено" },
  { id: 1123, date: "27.04.2024", total: "1 459 ₴", status: "Доставлено" },
];

export default function ProfilePage() {
  const savedUser = JSON.parse(localStorage.getItem("silpo-user"));

  const initialUser = {
    name: savedUser?.user?.name || savedUser?.name || "Олександра",
    email:
      savedUser?.user?.email ||
      savedUser?.email ||
      "aleksandrar.6478392@gmail.com",
    phone: savedUser?.user?.phone || savedUser?.phone || "+38 (097) 123 45 67",
    address: "вул. Таращанська, 161, Біла Церква",
  };

  const [user, setUser] = useState(initialUser);
  const [formData, setFormData] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave(event) {
    event.preventDefault();
    setUser(formData);

    const previousData = JSON.parse(localStorage.getItem("silpo-user")) || {};
    localStorage.setItem(
      "silpo-user",
      JSON.stringify({
        ...previousData,
        user: formData,
      })
    );

    setIsEditing(false);
  }

  function handleCancel() {
    setFormData(user);
    setIsEditing(false);
  }

  return (
    <>
      <style>{`
        .profile-page-final {
          min-height: calc(100vh - 120px);
          background: #f6f6f6;
          padding: 26px 0 46px;
        }

        .profile-container-final {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 220px 1fr;
          background: #ffffff;
          min-height: 760px;
        }

        .profile-sidebar-final {
          background: #f7e7c4;
          padding: 22px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .profile-nav-final {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .profile-nav-final button {
          border: none;
          background: transparent;
          text-align: left;
          padding: 11px 14px;
          border-radius: 8px;
          color: #5b3324;
          font-weight: 700;
          cursor: pointer;
        }

        .profile-nav-final button.active {
          background: #ead0ad;
          color: #9f1013;
        }

        .profile-help-final {
          border: none;
          background: transparent;
          color: #9f1013;
          text-align: left;
          padding: 10px 14px;
          cursor: pointer;
        }

        .profile-main-final {
          padding: 30px 36px 40px;
        }

        .profile-title-final {
          margin: 0;
          font-size: 36px;
          color: #191919;
        }

        .profile-subtitle-final {
          margin: 4px 0 24px;
          color: #777;
          font-size: 14px;
        }

        .profile-card-final,
        .profile-block-final {
          background: #fff;
          border: 1px solid #ededed;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.05);
        }

        .profile-card-final {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .profile-user-final {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .profile-avatar-final {
          width: 74px;
          height: 74px;
          border-radius: 16px;
          background: #f8f1ee;
          color: #9f1013;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
        }

        .profile-user-final h2 {
          margin: 0 0 8px;
          font-size: 24px;
        }

        .profile-user-final p {
          margin: 4px 0;
          color: #666;
        }

        .profile-red-final {
          border: none;
          background: #9f1013;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .profile-grid-final {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .profile-block-final {
          padding: 22px;
          min-height: 220px;
        }

        .profile-block-final h3 {
          margin: 0 0 4px;
          font-size: 18px;
          color: #333;
        }

        .profile-hint-final {
          margin: 0 0 18px;
          color: #888;
          font-size: 13px;
        }

        .profile-row-final,
        .profile-order-final,
        .profile-security-final {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
          color: #555;
        }

        .profile-row-final b,
        .profile-order-final b {
          text-align: right;
          color: #333;
        }

        .profile-order-final {
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          align-items: center;
        }

        .profile-order-final em {
          font-style: normal;
          color: #328a35;
          font-weight: 700;
          text-align: right;
        }

        .profile-security-final {
          grid-template-columns: 1fr auto;
        }

        .profile-security-final span {
          color: #328a35;
          font-weight: 800;
        }

        .profile-outline-final {
          margin-top: 18px;
          width: 100%;
          height: 38px;
          border: 1px solid #c94939;
          background: #fff;
          color: #9f1013;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .profile-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .profile-modal-final {
          position: relative;
          width: 100%;
          max-width: 560px;
          background: #ffffff;
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.25);
        }

        .profile-modal-close {
          position: absolute;
          top: 14px;
          right: 16px;
          border: none;
          background: transparent;
          font-size: 22px;
          cursor: pointer;
          color: #5b3324;
        }

        .profile-modal-final h2 {
          margin: 0 0 18px;
          font-size: 24px;
        }

        .profile-form-final {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .profile-form-final label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
        }

        .profile-form-final input {
          height: 42px;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 0 12px;
          outline: none;
          font-weight: 600;
        }

        .profile-form-final input:focus {
          border-color: #c94939;
        }

        .profile-actions-final {
          grid-column: 1 / -1;
          display: flex;
          gap: 12px;
          margin-top: 4px;
        }

        .profile-cancel-final {
          border: 1px solid #ddd;
          background: white;
          color: #333;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .profile-container-final {
            grid-template-columns: 1fr;
          }

          .profile-sidebar-final {
            display: none;
          }

          .profile-main-final {
            padding: 22px;
          }

          .profile-grid-final,
          .profile-form-final {
            grid-template-columns: 1fr;
          }

          .profile-card-final {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
          }
        }
      `}</style>

      <section className="profile-page-final">
        <div className="profile-container-final">
          <aside className="profile-sidebar-final">
            <nav className="profile-nav-final">
              <button className="active">⌂ Профіль</button>
              <button>♡ Мої дані</button>
              <button>♢ Безпека</button>
              <button>⌖ Адреси</button>
              <button>▣ Історія покупок</button>
            </nav>

            <button className="profile-help-final">♧ Допомога</button>
          </aside>

          <main className="profile-main-final">
            <h1 className="profile-title-final">Профіль</h1>
            <p className="profile-subtitle-final">
              Керуйте своїми даними, адресами та замовленнями
            </p>

            <section className="profile-card-final">
              <div className="profile-user-final">
                <div className="profile-avatar-final">●</div>

                <div>
                  <h2>Вітаємо, {user.name}! 👋</h2>
                  <p>{user.email}</p>
                  <p>{user.phone}</p>
                </div>
              </div>

              <button
                type="button"
                className="profile-red-final"
                onClick={() => setIsEditing(true)}
              >
                ✎ Редагувати профіль
              </button>
            </section>

            <div className="profile-grid-final">
              <section className="profile-block-final">
                <h3>♡ Мої дані</h3>
                <p className="profile-hint-final">
                  Особиста інформація та контакти
                </p>

                <div className="profile-row-final">
                  <span>Ім’я</span>
                  <b>{user.name}</b>
                </div>

                <div className="profile-row-final">
                  <span>Email</span>
                  <b>{user.email}</b>
                </div>

                <div className="profile-row-final">
                  <span>Телефон</span>
                  <b>{user.phone}</b>
                </div>
              </section>

              <section className="profile-block-final">
                <h3>⌖ Адреси</h3>
                <p className="profile-hint-final">Ваші адреси доставки</p>

                <div className="profile-row-final">
                  <span>Основна адреса</span>
                  <b>{user.address}</b>
                </div>

                <button className="profile-outline-final">
                  ＋ Додати адресу
                </button>
              </section>

              <section className="profile-block-final">
                <h3>▣ Історія покупок</h3>
                <p className="profile-hint-final">
                  Ваші замовлення та покупки
                </p>

                {orders.map((order) => (
                  <div className="profile-order-final" key={order.id}>
                    <span>№{order.id}</span>
                    <span>{order.date}</span>
                    <b>{order.total}</b>
                    <em>{order.status}</em>
                  </div>
                ))}
              </section>

              <section className="profile-block-final">
                <h3>♢ Безпека</h3>
                <p className="profile-hint-final">
                  Налаштування безпеки облікового запису
                </p>

                <div className="profile-security-final">Змінити пароль ›</div>
                <div className="profile-security-final">Прив’язані пристрої ›</div>
                <div className="profile-security-final">
                  Підтвердження email <span>Підтверджено ✓</span>
                </div>
              </section>
            </div>
          </main>
        </div>
      </section>

      {isEditing && (
        <div className="profile-modal-backdrop">
          <div className="profile-modal-final">
            <button
              type="button"
              className="profile-modal-close"
              onClick={handleCancel}
            >
              ×
            </button>

            <h2>Редагування профілю</h2>

            <form className="profile-form-final" onSubmit={handleSave}>
              <label>
                Ім’я
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Телефон
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Адреса
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="profile-actions-final">
                <button type="submit" className="profile-red-final">
                  Зберегти
                </button>

                <button
                  type="button"
                  className="profile-cancel-final"
                  onClick={handleCancel}
                >
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
