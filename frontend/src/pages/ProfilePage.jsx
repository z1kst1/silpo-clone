import { useEffect, useState } from "react";
import { Link } from "react-router";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "Гість", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem("silpo-user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const initialData = {
        name: parsed.user?.firstName || "Користувач",
        email: parsed.user?.email || "",
        phone: parsed.phone || "",
      };
      setUser(initialData);
      setEditForm(initialData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("silpo-token");
      const response = await fetch("http://localhost:3000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
        }),
      });

      if (response.ok) {
        setUser(editForm);
        setIsEditing(false);
        const savedUser = JSON.parse(
          localStorage.getItem("silpo-user") || "{}",
        );
        localStorage.setItem(
          "silpo-user",
          JSON.stringify({
            ...savedUser,
            ...editForm,
            firstName: editForm.name,
          }),
        );
      } else {
        alert("Помилка збереження на сервері. Перевірте бекенд.");
      }
    } catch (error) {
      console.error(error);
      alert("Не вдалося з'єднатися з сервером.");
    }
  };

  return (
    <div className="profile-container">
      {/* БОКОВЕ МЕНЮ (Прибите до лівого краю) */}
      <aside className="profile-sidebar">
        <div className="sidebar-menu">
          <Link to="/profile" className="menu-item active">
            <img
              src="/images/figma/icons/profile.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Профіль
          </Link>
          <Link to="/profile/data" className="menu-item">
            <img
              src="/images/figma/icons/user.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Мої дані
          </Link>
          <Link to="/profile/security" className="menu-item">
            <img
              src="/images/figma/icons/shield.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Безпека
          </Link>
          <Link to="/profile/addresses" className="menu-item">
            <img
              src="/images/figma/icons/map-pin.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Адреси
          </Link>
          <Link to="/profile/orders" className="menu-item">
            <img
              src="/images/figma/icons/shopping-bag.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Історія покупок
          </Link>
        </div>
        <button className="menu-item help-btn">
          <img
            src="/images/figma/icons/help-circle.svg"
            alt=""
            width="18"
            height="18"
          />{" "}
          Допомога
        </button>
      </aside>

      {/* ОСНОВНИЙ КОНТЕНТ */}
      <main className="profile-main">
        <div className="profile-main-inner">
          <div className="profile-header">
            <h1 className="page-title">Профіль</h1>
            <p className="page-subtitle">
              Керуйте своїми даними, адресами та замовленнями
            </p>
          </div>

          <div className="welcome-card">
            <div className="user-info-wrapper">
              <div className="avatar-circle">
                <img
                  src="/images/figma/logo/avatar.svg"
                  alt="Avatar"
                  width="60"
                  height="60"
                  style={{ borderRadius: "50%" }}
                />
              </div>
              <div className="user-details">
                <h2>Вітаємо, {user.name}!</h2>
                <p className="user-email">{user.email}</p>
                <p className="user-phone">
                  {user.phone || "+38 (___) ___ __ __"}
                </p>
              </div>
            </div>
            {isEditing ? (
              <button
                className="edit-profile-btn"
                onClick={handleSave}
                style={{ backgroundColor: "green" }}
              >
                Зберегти зміни
              </button>
            ) : (
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Редагувати профіль
              </button>
            )}
          </div>

          <div className="cards-grid">
            <div className="info-card">
              <div className="card-header">
                <h3>
                  <img
                    src="/images/figma/icons/user.svg"
                    alt=""
                    width="16"
                    height="16"
                  />{" "}
                  Мої дані
                </h3>
                <p>Особиста інформація та контакти</p>
              </div>
              <div className="card-body">
                <div className="data-row">
                  <span>Ім'я</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      style={{
                        textAlign: "right",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "2px 5px",
                      }}
                    />
                  ) : (
                    <strong>{user.name}</strong>
                  )}
                </div>
                <div className="data-row">
                  <span>Email</span>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleChange}
                      style={{
                        textAlign: "right",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "2px 5px",
                      }}
                    />
                  ) : (
                    <strong>{user.email}</strong>
                  )}
                </div>
                <div className="data-row">
                  <span>Телефон</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleChange}
                      placeholder="+380..."
                      style={{
                        textAlign: "right",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "2px 5px",
                      }}
                    />
                  ) : (
                    <strong>{user.phone || "Не вказано"}</strong>
                  )}
                </div>
              </div>
              <div className="card-footer">Переглянути всі дані &gt;</div>
            </div>

            <div className="info-card">
              <div className="card-header">
                <h3>
                  <img
                    src="/images/figma/icons/map-pin.svg"
                    alt=""
                    width="16"
                    height="16"
                  />{" "}
                  Адреси
                </h3>
                <p>Ваші адреси доставки</p>
              </div>
              <div className="card-body">
                <div className="data-row" style={{ borderBottom: "none" }}>
                  <span>Основна адреса</span>
                  <strong style={{ textAlign: "right", maxWidth: "150px" }}>
                    вул. Таращанська, 161, Біла Церква
                  </strong>
                </div>
              </div>
              <div className="card-footer center-footer">
                <button className="add-address-btn">+ Додати адресу</button>
              </div>
            </div>

            <div className="info-card">
              <div className="card-header">
                <h3>
                  <img
                    src="/images/figma/icons/shopping-bag.svg"
                    alt=""
                    width="16"
                    height="16"
                  />{" "}
                  Історія покупок
                </h3>
                <p>Ваші замовлення і покупки</p>
              </div>
              <div className="card-body">
                <div className="data-row">
                  <span>Замовлення №1</span>
                  <span>20.03.2026</span>
                  <strong>100.00 грн</strong>
                </div>
              </div>
              <div className="card-footer">Переглянути всі дані &gt;</div>
            </div>

            <div className="info-card">
              <div className="card-header">
                <h3>
                  <img
                    src="/images/figma/icons/shield.svg"
                    alt=""
                    width="16"
                    height="16"
                  />{" "}
                  Безпека
                </h3>
                <p>Налаштування безпеки облікового запису</p>
              </div>
              <div className="card-body">
                <div className="data-row">
                  <span>Змінити пароль</span> <span>&gt;</span>
                </div>
                <div className="data-row">
                  <span>Прив'язані пристрої</span> <span>&gt;</span>
                </div>
                <div className="data-row">
                  <span>Підтвердження email</span>{" "}
                  <strong style={{ color: "green" }}>Підтверджено</strong>
                </div>
              </div>
              <div className="card-footer">Налаштування безпеки &gt;</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
