import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, logout, updateUser } = useAuth();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "Не вказано",
    avatar: "",
    address: "",
  });
  const [editData, setEditData] = useState({});
  const [activeView, setActiveView] = useState("dashboard");
  const [isSaving, setIsSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPwd: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        const userData = response.data;
        setUser({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          middleName: userData.middleName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          birthDate: userData.birthDate ? userData.birthDate.slice(0, 10) : "",
          gender: userData.gender || "Не вказано",
          avatar: userData.avatar || "",
          address: userData.address || "",
        });
      } catch (error) {
        console.error("Помилка завантаження профілю:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  const openEdit = (viewName) => {
    setEditData({ ...user });
    setActiveView(viewName);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "birthDate") {
      let digits = value.replace(/\D/g, "").substring(0, 8);
      let formatted = digits;
      if (digits.length > 4)
        formatted = `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
      else if (digits.length > 2)
        formatted = `${digits.slice(0, 2)}.${digits.slice(2)}`;
      setEditData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Збереження в БД через API
  const handleSaveDetails = async () => {
    setIsSaving(true);
    try {
      // Конвертуємо дд.мм.рррр → ISO для БД
      let birthDate = null;
      if (editData.birthDate) {
        const parts = editData.birthDate.split(".");
        if (parts.length === 3) {
          birthDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }

      const response = await api.put("/profile", {
        firstName: editData.firstName,
        lastName: editData.lastName,
        phone: editData.phone,
        gender: editData.gender,
        birthDate,
      });

      const updated = response.data;
      setUser((prev) => ({
        ...prev,
        ...editData,
        birthDate: updated.birthDate
          ? updated.birthDate.slice(0, 10)
          : editData.birthDate,
      }));

      // Оновлюємо AuthContext
      updateUser({ firstName: updated.firstName, lastName: updated.lastName });
      setActiveView("myData");
    } catch (error) {
      console.error("Помилка збереження:", error);
      alert("Не вдалося зберегти зміни");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setUser((prev) => ({ ...prev, avatar: "" }));
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch {
      console.error("Не вдалося завантажити замовлення");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === "orders") fetchOrders();
  };

  const fullName =
    [user.lastName, user.firstName, user.middleName]
      .filter(Boolean)
      .join(" ") ||
    user.firstName ||
    "Користувач";

  return (
    <div className="profile-container">
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
            className={`menu-item ${["myData", "editName", "editBirthDate", "editGender", "editPhone"].includes(activeView) ? "active" : ""}`}
            onClick={() => handleViewChange("myData")}
          >
            <img
              src="/images/figma/icons/user.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Мої дані
          </button>
          <button
            className={`menu-item ${activeView === "security" ? "active" : ""}`}
            onClick={() => handleViewChange("security")}
          >
            <img
              src="/images/figma/icons/shield.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Безпека
          </button>
          <button
            className={`menu-item ${activeView === "addresses" ? "active" : ""}`}
            onClick={() => handleViewChange("addresses")}
          >
            <img
              src="/images/figma/icons/map-pin.svg"
              alt=""
              width="18"
              height="18"
            />{" "}
            Адреси
          </button>
          <button
            className={`menu-item ${activeView === "orders" ? "active" : ""}`}
            onClick={() => handleViewChange("orders")}
          >
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
          <button className="menu-item logout-button" onClick={logout}>
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
                    <h2>Вітаємо, {user.firstName || "Користувач"}!</h2>
                    <p className="user-email">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="cards-grid">
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
                      <span>Ім'я</span>
                      <strong>{user.firstName || "—"}</strong>
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
                  <div className="card-body">
                    <p style={{ color: "#888", fontSize: "13px" }}>
                      Замовлень поки немає
                    </p>
                  </div>
                  <button className="card-footer-link">
                    Переглянути всі замовлення ❯
                  </button>
                </div>

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
                      <p>Налаштування безпеки</p>
                    </div>
                  </div>
                  <div className="card-body">
                    <button className="security-row-action">
                      Змінити пароль ❯
                    </button>
                  </div>
                  <button className="card-footer-link">
                    Налаштування безпеки ❯
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
                  style={{ cursor: "pointer", padding: 0 }}
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
                        {user.birthDate && (
                          <strong className="details-value">
                            {user.birthDate}
                          </strong>
                        )}
                      </div>
                      <span className="details-action">
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
                      <span className="details-action">✏️</span>
                    </div>
                    <div className="details-list-item">
                      <div className="details-item-content">
                        <span className="details-label">Email</span>
                        <strong className="details-value">{user.email}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ФОРМИ РЕДАГУВАННЯ */}
          {["editName", "editBirthDate", "editGender", "editPhone"].includes(
            activeView,
          ) && (
            <div className="edit-form-view">
              <button
                className="back-link-btn"
                onClick={() => setActiveView("myData")}
              >
                ❮ Назад
              </button>
              <h2 className="edit-form-title">
                {
                  {
                    editName: "Прізвище, ім'я",
                    editBirthDate: "Дата народження",
                    editGender: "Стать",
                    editPhone: "Телефон",
                  }[activeView]
                }
              </h2>
              <div className="edit-form-inputs">
                {activeView === "editName" && (
                  <>
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
                  </>
                )}
                {activeView === "editBirthDate" && (
                  <input
                    type="text"
                    name="birthDate"
                    placeholder="дд.мм.рррр"
                    value={editData.birthDate || ""}
                    onChange={handleEditChange}
                    className="edit-input-field"
                  />
                )}
                {activeView === "editGender" && (
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
                )}
                {activeView === "editPhone" && (
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+380..."
                    value={editData.phone || ""}
                    onChange={handleEditChange}
                    className="edit-input-field"
                  />
                )}
              </div>
              <div className="edit-form-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => setActiveView("myData")}
                >
                  Скасувати
                </button>
                <button
                  className="btn-save"
                  onClick={handleSaveDetails}
                  disabled={isSaving}
                >
                  {isSaving ? "Збереження..." : "Зберегти"}
                </button>
              </div>
            </div>
          )}

          {/* ===== БЕЗПЕКА ===== */}
          {activeView === "security" && (
            <div className="section-block">
              <h2 className="section-title">Безпека</h2>
              <p style={{ color: "#666", marginBottom: "24px" }}>
                Щоб змінити пароль, скористайся відновленням через email.
              </p>
              <button
                className="btn-save"
                onClick={() => {
                  api
                    .post("/auth/forgot-password", { email: user.email })
                    .then(() =>
                      alert("Лист для зміни паролю надіслано на " + user.email),
                    )
                    .catch(() => alert("Помилка. Спробуй ще раз."));
                }}
              >
                Надіслати лист для зміни паролю
              </button>
            </div>
          )}

          {/* ===== АДРЕСИ ===== */}
          {activeView === "addresses" && (
            <div className="section-block">
              <h2 className="section-title">Адреса доставки</h2>
              <p style={{ color: "#666", marginBottom: "16px" }}>
                Ця адреса буде відображатися в хедері сайту.
              </p>
              <input
                type="text"
                className="edit-input-field"
                placeholder="Місто, вулиця, номер будинку"
                value={user.address || ""}
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, address: e.target.value }))
                }
                style={{ marginBottom: "16px" }}
              />
              <button
                className="btn-save"
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    const res = await api.put("/profile", {
                      address: user.address,
                    });
                    updateUser({ address: res.data.address });
                    alert("Адресу збережено!");
                  } catch {
                    alert("Помилка збереження адреси");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
              >
                {isSaving ? "Збереження..." : "Зберегти адресу"}
              </button>
            </div>
          )}

          {/* ===== ІСТОРІЯ ПОКУПОК ===== */}
          {activeView === "orders" && (
            <div className="section-block">
              <h2 className="section-title">Історія покупок</h2>
              {ordersLoading ? (
                <p style={{ color: "#888" }}>Завантаження...</p>
              ) : orders.length === 0 ? (
                <p style={{ color: "#888" }}>У вас ще немає замовлень.</p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        border: "1px solid #e5e5e5",
                        borderRadius: "12px",
                        padding: "16px 20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "700" }}>
                          Замовлення #{order.id}
                        </span>
                        <span
                          style={{
                            fontSize: "13px",
                            color:
                              order.status === "completed"
                                ? "#2e7d32"
                                : "#8E1616",
                            fontWeight: "600",
                          }}
                        >
                          {order.status === "pending" && "Очікує"}
                          {order.status === "processing" && "Обробляється"}
                          {order.status === "completed" && "Виконано"}
                          {order.status === "cancelled" && "Скасовано"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#666",
                          marginBottom: "8px",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("uk-UA")}{" "}
                        · {order.address}
                      </div>
                      <div style={{ fontSize: "13px", color: "#333" }}>
                        {order.items.map((item) => (
                          <span key={item.id}>
                            {item.name} ×{item.quantity};{" "}
                          </span>
                        ))}
                      </div>
                      <div
                        style={{
                          marginTop: "8px",
                          fontWeight: "700",
                          color: "#8E1616",
                        }}
                      >
                        {order.total.toFixed(2)} грн
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
