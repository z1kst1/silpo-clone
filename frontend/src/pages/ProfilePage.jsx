import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    name: "Завантаження...",
    email: "",
    phone: "",
    birthDate: "",
    gender: "Не вказано",
    avatar: "",
  });

  const [editData, setEditData] = useState({});
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const savedUser = localStorage.getItem("silpo-user");

    if (savedUser) {
      const parsed = JSON.parse(savedUser);

      setUser({
        name: parsed.name || "Користувач",
        email: parsed.email || "",
        phone: parsed.phone || "",
        birthDate: parsed.birthDate || "",
        gender: parsed.gender || "Не вказано",
        avatar: parsed.avatar || "",
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("silpo-token");
    localStorage.removeItem("silpo-user");
    window.location.href = "/";
  };

  const openEdit = (viewName) => {
    setEditData({ ...user });
    setActiveView(viewName);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthDate") {
      let digits = value.replace(/\D/g, "");
      digits = digits.substring(0, 8);

      let formatted = digits;

      if (digits.length > 4) {
        formatted = `${digits.slice(0, 2)}.${digits.slice(
          2,
          4,
        )}.${digits.slice(4)}`;
      } else if (digits.length > 2) {
        formatted = `${digits.slice(0, 2)}.${digits.slice(2)}`;
      }

      setEditData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveDetails = () => {
    setUser(editData);

    const savedUser = JSON.parse(localStorage.getItem("silpo-user") || "{}");

    localStorage.setItem(
      "silpo-user",
      JSON.stringify({
        ...savedUser,
        ...editData,
      }),
    );

    setActiveView("myData");
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;

        setUser((prev) => ({
          ...prev,
          avatar: base64String,
        }));

        const savedUser = JSON.parse(
          localStorage.getItem("silpo-user") || "{}",
        );

        localStorage.setItem(
          "silpo-user",
          JSON.stringify({
            ...savedUser,
            avatar: base64String,
          }),
        );
      };

      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();

    setUser((prev) => ({
      ...prev,
      avatar: "",
    }));

    const savedUser = JSON.parse(localStorage.getItem("silpo-user") || "{}");

    localStorage.setItem(
      "silpo-user",
      JSON.stringify({
        ...savedUser,
        avatar: "",
      }),
    );
  };

  const fullName = user.name || "Користувач";

  return (
    <div className="profile-container">
      <aside className="profile-sidebar">
        <div className="sidebar-menu">
          <button
            className={`menu-item ${
              activeView === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveView("dashboard")}
          >
            <img
              src="/images/figma/icons/profile.svg"
              alt=""
              width="18"
              height="18"
            />
            Профіль
          </button>

          <button
            className={`menu-item ${
              activeView !== "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveView("myData")}
          >
            <img
              src="/images/figma/icons/user.svg"
              alt=""
              width="18"
              height="18"
            />
            Мої дані
          </button>

          <button className="menu-item">
            <img
              src="/images/figma/icons/shield.svg"
              alt=""
              width="18"
              height="18"
            />
            Безпека
          </button>

          <button className="menu-item">
            <img
              src="/images/figma/icons/map-pin.svg"
              alt=""
              width="18"
              height="18"
            />
            Адреси
          </button>

          <button className="menu-item">
            <img
              src="/images/figma/icons/shopping-bag.svg"
              alt=""
              width="18"
              height="18"
            />
            Історія покупок
          </button>

          <div className="menu-spacer"></div>

          <button className="menu-item help-button">
            <img
              src="/images/figma/icons/help-circle.svg"
              alt=""
              width="18"
              height="18"
            />
            Допомога
          </button>

          <button className="menu-item logout-button" onClick={handleLogout}>
            <img
              src="/images/figma/icons/log-out.svg"
              alt=""
              width="18"
              height="18"
            />
            Вийти
          </button>
        </div>
      </aside>

      <main className="profile-main">
        <div className="profile-main-inner">
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
                    <h2>Вітаємо, {user.name}!</h2>

                    <p className="user-email">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="cards-grid">
                <div className="info-card">
                  <div className="card-header">
                    <h3>Мої дані</h3>
                    <p>Особиста інформація та контакти</p>
                  </div>

                  <div className="card-body">
                    <div className="data-row">
                      <span>Ім'я</span>
                      <strong>{user.name}</strong>
                    </div>

                    <div className="data-row">
                      <span>Email</span>
                      <strong>{user.email}</strong>
                    </div>

                    <div className="data-row">
                      <span>Телефон</span>
                      <strong>{user.phone || "Не вказано"}</strong>
                    </div>
                  </div>

                  <button
                    className="card-footer-link"
                    onClick={() => setActiveView("myData")}
                  >
                    Переглянути всі дані ❯
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === "myData" && (
            <div className="details-view">
              <div className="details-header-text">
                <h2>Мої дані</h2>
                <p>Особиста інформація та контакти</p>
              </div>

              <div className="details-avatar-container">
                <div
                  className="details-avatar"
                  onClick={handleAvatarClick}
                  style={{
                    cursor: "pointer",
                    padding: 0,
                  }}
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
                    >
                      ×
                    </button>
                  ) : (
                    <button className="avatar-action-btn add">+</button>
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
                <div className="details-block">
                  <div className="details-block-header">
                    <h3>Персональна інформація</h3>
                  </div>

                  <div className="details-list">
                    <div
                      className="details-list-item"
                      onClick={() => openEdit("editName")}
                    >
                      <div className="details-item-content">
                        <span className="details-label">Ім’я</span>

                        <strong className="details-value">{fullName}</strong>
                      </div>

                      <span className="details-action">❯</span>
                    </div>

                    <div
                      className="details-list-item"
                      onClick={() => openEdit("editBirthDate")}
                    >
                      <div className="details-item-content">
                        <span className="details-label">Дата народження</span>

                        <strong className="details-value">
                          {user.birthDate || "Не вказано"}
                        </strong>
                      </div>

                      <span className="details-action">❯</span>
                    </div>

                    <div
                      className="details-list-item"
                      onClick={() => openEdit("editGender")}
                    >
                      <div className="details-item-content">
                        <span className="details-label">Стать</span>

                        <strong className="details-value">{user.gender}</strong>
                      </div>

                      <span className="details-action">❯</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeView === "editName" && (
            <div className="edit-form-view">
              <button
                className="back-link-btn"
                onClick={() => setActiveView("myData")}
              >
                ❮ Назад
              </button>

              <h2 className="edit-form-title">Ім’я</h2>

              <div className="edit-form-inputs">
                <input
                  type="text"
                  name="name"
                  placeholder="Введіть ім’я"
                  value={editData.name || ""}
                  onChange={handleEditChange}
                  className="edit-input-field"
                />
              </div>

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
