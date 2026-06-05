import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState({
    firstName: "Завантаження...",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "Не вказано",
    avatar: "",
  });

  const [editData, setEditData] = useState({});
  const [activeView, setActiveView] = useState("dashboard");
  const [saveError, setSaveError] = useState("");

  const fileInputRef = useRef(null);

  // Отримуємо дані профілю з бекенду
  useEffect(() => {
    const fetchProfile = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/auth/me");
        const userData = response.data;

        setUser({
          firstName: userData.firstName || userData.name || "Користувач",
          lastName: userData.lastName || "",
          middleName: userData.middleName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          birthDate: userData.birthDate || "",
          gender: userData.gender || "Не вказано",
          avatar: userData.avatar || "",
        });

        localStorage.setItem("silpo-user", JSON.stringify(userData));
      } catch (error) {
        console.error("Помилка завантаження профілю:", error);
        // Якщо токен протермінований (401), інтерцептор в api.js
        // сам видалить його і перекине на сторінку логіну.
      }
    };

    fetchProfile();
  }, [navigate]);

  // Вихід через AuthContext
  const handleLogout = () => {
    logout();
  };

  const openEdit = (viewName) => {
    setEditData({ ...user });
    setSaveError("");
    setActiveView(viewName);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthDate") {
      let digits = value.replace(/\D/g, "");
      digits = digits.substring(0, 8);

      let formatted = digits;
      if (digits.length > 4) {
        formatted = `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
      } else if (digits.length > 2) {
        formatted = `${digits.slice(0, 2)}.${digits.slice(2)}`;
      }

      setEditData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Зберігання даних на бекенді
  const handleSaveDetails = async () => {
    setSaveError("");
    try {
      await api.put("/auth/update", editData);

      setUser(editData);
      const savedUser = JSON.parse(
        localStorage.getItem("silpo-user") || "{}"
      );
      localStorage.setItem(
        "silpo-user",
        JSON.stringify({ ...savedUser, ...editData, name: editData.firstName })
      );

      setActiveView("myData");
    } catch (error) {
      console.error("Помилка збереження:", error);
      setSaveError("Не вдалося зберегти дані. Спробуйте ще раз.");
    }
  };

  // Логіка для фото
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setUser((prev) => ({ ...prev, avatar: base64String }));
        const savedUser = JSON.parse(
          localStorage.getItem("silpo-user") || "{}"
        );
        localStorage.setItem(
          "silpo-user",
          JSON.stringify({ ...savedUser, avatar: base64String })
        );
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setUser((prev) => ({ ...prev, avatar: "" }));
    const savedUser = JSON.parse(localStorage.getItem("silpo-user") || "{}");
    localStorage.setItem(
      "silpo-user",
      JSON.stringify({ ...savedUser, avatar: "" })
    );
  };

  const fullName =
    [user.lastName, user.firstName, user.middleName]
      .filter(Boolean)
      .join(" ") || user.firstName;

  return (
    <div className="profile-container">
      {/* ЛІВА КОНСОЛЬ */}
      <aside className="profile-sidebar">
        <div className="sidebar-menu">
          <button
            className={`menu-item ${activeView === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveView("dashboard")}
          >
            <img
              src="/images/figma/icons/profile.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Профіль
          </button>
          <button
            className={`menu-item ${activeView !== "dashboard" ? "active" : ""}`}
            onClick={() => setActiveView("myData")}
          >
            <img
              src="/images/figma/icons/user.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Мої дані
          </button>
          <button className="menu-item">
            <img
              src="/images/figma/icons/shield.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Безпека
          </button>
          <button className="menu-item">
            <img
              src="/images/figma/icons/map-pin.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Адреси
          </button>
          <button className="menu-item">
            <img
              src="/images/figma/icons/shopping-bag.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Історія покупок
          </button>

          <div className="menu-spacer"></div>

          <button className="menu-item help-button">
            <img
              src="/images/figma/icons/help-circle.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Допомога
          </button>
          <button className="menu-item logout-button" onClick={handleLogout}>
            <img
              src="/images/figma/icons/log-out.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Вийти
          </button>
        </div>
      </aside>

      {/* ОСНОВНИЙ КОНТЕНТ */}
      <main className="profile-main">
        <div className="profile-main-inner">

          {/* ЕКРАН 1: ГОЛОВНИЙ ДАШБОРД */}
          {activeView === "dashboard" && (
            <div className="fade-in-container">
              <div className="profile-header">
                <h1 className="page-title">Профіль</h1>
                <p className="page-subtitle">
                  Керуйте своїми даними, адресами та замовленнями
                </p>
              </div>

              <div className="welcome-card">
                <div className="user-info-wrapper">
                  <div className="avatar-circle" style={{ padding: 0 }}>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src="/images/figma/icons/avatar.svg"
                        alt="Avatar"
                        width="60"
                        height="60"
                      />
                    )}
                  </div>
                  <div className="user-details">
                    <h2>Вітаємо, {user.firstName}!</h2>
                    <p className="user-email">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="cards-grid">

                {/* МОЇ ДАНІ */}
                <div className="info-card">
                  <div className="card-header">
                    <div className="header-icon-wrapper">
                      <img
                        src="/images/figma/icons/user.svg"
                        alt=""
                        width="20"
                        height="20"
                      />
                    </div>
                    <div className="header-text-group">
                      <h3>Мої дані</h3>
                      <p>Особиста інформація та контакти</p>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="data-row">
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <img
                          src="/images/figma/icons/user-small.svg"
                          alt=""
                          width="14"
                          height="14"
                        />{" "}
                        Ім'я
                      </span>
                      <strong>{user.firstName}</strong>
                    </div>
                    <div className="data-row">
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <img
                          src="/images/figma/icons/mail.svg"
                          alt=""
                          width="14"
                          height="14"
                        />{" "}
                        Email
                      </span>
                      <strong>{user.email}</strong>
                    </div>
                    <div className="data-row">
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <img
                          src="/images/figma/icons/phone.svg"
                          alt=""
                          width="14"
                          height="14"
                        />{" "}
                        Телефон
                      </span>
                      <strong>{user.phone || "Не вказано"}</strong>
                    </div>
                  </div>
                  <button
                    className="card-footer-link"
                    onClick={() => setActiveView("myData")}
                  >
                    Переглянути всі дані <span>❯</span>
                  </button>
                </div>

                {/* АДРЕСИ */}
                <div className="info-card">
                  <div className="card-header">
                    <div className="header-icon-wrapper">
                      <img
                        src="/images/figma/icons/map-pin.svg"
                        alt=""
                        width="20"
                        height="20"
                      />
                    </div>
                    <div className="header-text-group">
                      <h3>Адреси</h3>
                      <p>Ваші адреси доставки</p>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="data-row address-row">
                      <span className="address-type-label">
                        <img
                          src="/images/figma/icons/home-small.svg"
                          alt=""
                          width="14"
                          height="14"
                        />{" "}
                        Основна адреса
                      </span>
                      <strong className="address-text-value">
                        вул. Таращанська, 161, Біла Церква, 09100
                      </strong>
                    </div>
                  </div>
                  <div className="card-footer-container">
                    <button className="card-footer-link">
                      Переглянути всі адреси <span>❯</span>
                    </button>
                    <button className="add-address-btn">+ Додати адресу</button>
                  </div>
                </div>

                {/* ІСТОРІЯ ПОКУПОК */}
                <div className="info-card">
                  <div className="card-header">
                    <div className="header-icon-wrapper">
                      <img
                        src="/images/figma/icons/shopping-bag.svg"
                        alt=""
                        width="20"
                        height="20"
                      />
                    </div>
                    <div className="header-text-group">
                      <h3>Історія покупок</h3>
                      <p>Ваші замовлення та покупки</p>
                    </div>
                  </div>
                  <div className="card-body purchase-list">
                    <div className="purchase-item">
                      <div className="purchase-meta">
                        <span className="purchase-id">Замовлення №1256</span>
                        <span className="purchase-date">12.05.2024</span>
                      </div>
                      <span className="purchase-price">
                        1 238 ₴ <span>❯</span>
                      </span>
                    </div>
                  </div>
                  <button className="card-footer-link">
                    Переглянути всі замовлення <span>❯</span>
                  </button>
                </div>

                {/* БЕЗПЕКА */}
                <div className="info-card">
                  <div className="card-header">
                    <div className="header-icon-wrapper">
                      <img
                        src="/images/figma/icons/shield.svg"
                        alt=""
                        width="20"
                        height="20"
                      />
                    </div>
                    <div className="header-text-group">
                      <h3>Безпека</h3>
                      <p>Налаштування безпеки облікового запису</p>
                    </div>
                  </div>
                  <div className="card-body security-body">
                    <button className="security-row-action">
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        Змінити пароль
                      </span>
                      <span>❯</span>
                    </button>
                    <div className="security-row-status">
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        Підтвердження email
                      </span>
                      <span className="status-verified">Підтверджено ✓</span>
                    </div>
                  </div>
                  <button className="card-footer-link">
                    Налаштування безпеки <span>❯</span>
                  </button>
                </div>

              </div>
            </div>
          )}


          {/* ЕКРАН 2: ДЕТАЛЬНІ "МОЇ ДАНІ" */}
          {activeView === "myData" && (
            <div className="details-view">

              <div className="details-header-text">
                <h2>Мої дані</h2>
                <p>Особиста інформація та контакти</p>
              </div>

              {/* АВАТАР */}
              <div className="details-avatar-container">
                <div
                  className="details-avatar"
                  onClick={handleAvatarClick}
                  style={{ cursor: "pointer", padding: 0 }}
                  title={
                    user.avatar
                      ? "Натисніть, щоб змінити фото"
                      : "Натисніть, щоб додати фото"
                  }
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#666"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}

                  {user.avatar ? (
                    <button
                      className="avatar-action-btn remove"
                      onClick={handleRemoveAvatar}
                      title="Видалити фото"
                    >
                      ×
                    </button>
                  ) : (
                    <button className="avatar-action-btn add" title="Додати фото">
                      +
                    </button>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className="details-cards-wrapper">

                {/* БЛОК 1: ПЕРСОНАЛЬНА ІНФОРМАЦІЯ */}
                <div className="details-block">
                  <div className="details-block-header">
                    <div className="details-icon-solid">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <h3>Персональна інформація</h3>
                  </div>

                  <div className="details-list">
                    <div
                      className="details-list-item"
                      onClick={() => openEdit("editName")}
                    >
                      <div className="details-item-content">
                        <span className="details-label">Прізвище, ім'я</span>
                        <strong className="details-value">{fullName}</strong>
                      </div>
                      <span className="details-action arrow">❯</span>
                    </div>

                    <div
                      className="details-list-item"
                      onClick={() => openEdit("editBirthDate")}
                    >
                      <div className="details-item-content">
                        <span className="details-label">Дата народження</span>
                        {user.birthDate ? (
                          <strong className="details-value">
                            {user.birthDate}
                          </strong>
                        ) : null}
                      </div>
                      <span
                        className={`details-action ${user.birthDate ? "arrow" : ""}`}
                      >
                        {user.birthDate ? "❯" : "+"}
                      </span>
                    </div>

                    <div
                      className="details-list-item"
                      onClick={() => openEdit("editGender")}
                    >
                      <div className="details-item-content">
                        <span className="details-label">Стать</span>
                        <strong className="details-value">{user.gender}</strong>
                      </div>
                      <span className="details-action arrow">❯</span>
                    </div>
                  </div>
                </div>

                {/* БЛОК 2: КОНТАКТИ */}
                <div className="details-block">
                  <div className="details-block-header">
                    <div className="details-icon-solid">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <h3>Контакти</h3>
                  </div>

                  <div className="details-list">
                    <div
                      className="details-list-item"
                      onClick={() => openEdit("editPhone")}
                    >
                      <div className="details-item-content">
                        <span className="details-label">Телефон</span>
                        <strong className="details-value">
                          {user.phone || "Не вказано"}
                        </strong>
                      </div>
                      <span className="details-action">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#8E1616"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </span>
                    </div>

                    <div
                      className="details-list-item"
                      onClick={() => openEdit("editEmail")}
                    >
                      <div className="details-item-content">
                        <span className="details-label">Електронна пошта</span>
                        <strong className="details-value">{user.email}</strong>
                      </div>
                      <span className="details-action">+</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}


          {/* ЕКРАНИ РЕДАГУВАННЯ */}
          {activeView === "editName" && (
            <div className="edit-form-view">
              <button
                className="back-link-btn"
                onClick={() => setActiveView("myData")}
              >
                ❮ Назад
              </button>
              <h2 className="edit-form-title">Прізвище, ім'я</h2>
              <div className="edit-form-inputs">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Прізвище"
                  value={editData.lastName || ""}
                  onChange={handleEditChange}
                  className="edit-input-field"
                />
                <input
                  type="text"
                  name="firstName"
                  placeholder="Ім'я"
                  value={editData.firstName || ""}
                  onChange={handleEditChange}
                  className="edit-input-field"
                />
                <input
                  type="text"
                  name="middleName"
                  placeholder="По батькові"
                  value={editData.middleName || ""}
                  onChange={handleEditChange}
                  className="edit-input-field"
                />
              </div>
              {saveError && (
                <p style={{ color: "red", marginTop: "8px" }}>{saveError}</p>
              )}
              <div className="edit-form-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => setActiveView("myData")}
                >
                  Скасувати
                </button>
                <button className="btn-save" onClick={handleSaveDetails}>
                  Зберегти
                </button>
              </div>
            </div>
          )}

          {activeView === "editBirthDate" && (
            <div className="edit-form-view">
              <button
                className="back-link-btn"
                onClick={() => setActiveView("myData")}
              >
                ❮ Назад
              </button>
              <h2 className="edit-form-title">Дата народження</h2>
              <div className="edit-form-inputs">
                <input
                  type="text"
                  name="birthDate"
                  placeholder="дд.мм.рррр"
                  value={editData.birthDate || ""}
                  onChange={handleEditChange}
                  className="edit-input-field"
                />
              </div>
              {saveError && (
                <p style={{ color: "red", marginTop: "8px" }}>{saveError}</p>
              )}
              <div className="edit-form-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => setActiveView("myData")}
                >
                  Скасувати
                </button>
                <button className="btn-save" onClick={handleSaveDetails}>
                  Зберегти
                </button>
              </div>
            </div>
          )}

          {activeView === "editGender" && (
            <div className="edit-form-view">
              <button
                className="back-link-btn"
                onClick={() => setActiveView("myData")}
              >
                ❮ Назад
              </button>
              <h2 className="edit-form-title">Стать</h2>
              <div className="edit-form-inputs">
                <select
                  name="gender"
                  value={editData.gender || "Не вказано"}
                  onChange={handleEditChange}
                  className="edit-input-field"
                >
                  <option value="Не вказано">Не вказано</option>
                  <option value="Чоловіча">Чоловіча</option>
                  <option value="Жіноча">Жіноча</option>
                </select>
              </div>
              {saveError && (
                <p style={{ color: "red", marginTop: "8px" }}>{saveError}</p>
              )}
              <div className="edit-form-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => setActiveView("myData")}
                >
                  Скасувати
                </button>
                <button className="btn-save" onClick={handleSaveDetails}>
                  Зберегти
                </button>
              </div>
            </div>
          )}

          {activeView === "editPhone" && (
            <div className="edit-form-view">
              <button
                className="back-link-btn"
                onClick={() => setActiveView("myData")}
              >
                ❮ Назад
              </button>
              <h2 className="edit-form-title">Телефон</h2>
              <div className="edit-form-inputs">
                <input
                  type="tel"
                  name="phone"
                  placeholder="+380..."
                  value={editData.phone || ""}
                  onChange={handleEditChange}
                  className="edit-input-field"
                />
              </div>
              {saveError && (
                <p style={{ color: "red", marginTop: "8px" }}>{saveError}</p>
              )}
              <div className="edit-form-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => setActiveView("myData")}
                >
                  Скасувати
                </button>
                <button className="btn-save" onClick={handleSaveDetails}>
                  Зберегти
                </button>
              </div>
            </div>
          )}

          {activeView === "editEmail" && (
            <div className="edit-form-view">
              <button
                className="back-link-btn"
                onClick={() => setActiveView("myData")}
              >
                ❮ Назад
              </button>
              <h2 className="edit-form-title">Електронна пошта</h2>
              <div className="edit-form-inputs">
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={editData.email || ""}
                  onChange={handleEditChange}
                  className="edit-input-field"
                />
              </div>
              {saveError && (
                <p style={{ color: "red", marginTop: "8px" }}>{saveError}</p>
              )}
              <div className="edit-form-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => setActiveView("myData")}
                >
                  Скасувати
                </button>
                <button className="btn-save" onClick={handleSaveDetails}>
                  Зберегти
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
