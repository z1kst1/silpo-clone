import React from "react";

const figmaFallback = {
  1: { badge: "Ціно тижики", bg: "#ffdf00", clr: "#000", old: "27.40", disc: "29", weight: "100 г", rate: "4.5" },
  2: { badge: "％", bg: "#ff9900", clr: "#fff", old: "154.00", disc: "22", weight: "500 г", rate: "4.2" },
  3: { badge: "Ціно тижики", bg: "#ffdf00", clr: "#000", old: "74.99", disc: "43", weight: "0.33 л", rate: "4.0" },
  4: { badge: "Ціно тижики", bg: "#ffdf00", clr: "#000", old: "92.90", disc: "22", weight: "200 г", rate: "3.1" },
  5: { badge: "5+1", bg: "#bbf3ff", clr: "#0066cc", old: "62.40", disc: "12", weight: "1.75 л", rate: "4.4", info: "0.19 грн за кожну 6-у од" },
  6: { badge: "Ціно тижики", bg: "#ffdf00", clr: "#000", old: "799.00", disc: "55", weight: "32 шт", rate: "4.9" }
};

export default function ProductCard({ product }) {
  const meta = figmaFallback[product.id] || {};
  const currentPrice = Number(product.price).toFixed(2);
  const oldPrice = product.oldPrice || meta.old;
  const discount = product.hasOwnProperty('discount') ? product.discount : meta.disc;
  const badgeText = product.badgeText !== undefined ? product.badgeText : meta.badge;
  const weight = product.weight || meta.weight || "100 г";
  const rating = product.rating || meta.rate || "4.5";
  const deliveryTime = product.deliveryTime || meta.deliveryTime;
  const extraInfo = product.info || meta.info;

  const buttonText = product.buttonText;

  return (
    <div
      className="kalpo-product-card"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff", /* ПОВЕРТАЄМО БІЛИЙ ФОН */
        borderRadius: "16px",
        padding: "8px",             /* ТІСНИЙ ВІДСТУП ЯК У ФІГМІ */
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative"
      }}
    >
      <div
        className="kalpo-product-card__image-container"
        style={{
          position: "relative",
          width: "100%",
          height: "130px",   /* ЗМЕНШЕНА ВИСОТА ФОТО для компактності */
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          boxSizing: "border-box"
        }}
      >
        {badgeText && (
          <div
            className="kalpo-product-card__badge"
            style={{
              position: "absolute",
              top: "-4px",
              left: "-4px",
              background: product.badgeBg || meta.bg || "#ffdf00",
              color: product.badgeColor || meta.clr || "#000000",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              fontSize: badgeText.length > 5 ? "8px" : "11px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              lineHeight: "1.1",
              zIndex: 10,
              padding: "2px",
              boxSizing: "border-box",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              whiteSpace: "normal"
            }}
          >
            {badgeText}
          </div>
        )}

        <img
          src={product.image}
          alt={product.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "12px"
          }}
        />

        <button
          type="button"
          className="kalpo-product-card__add-btn"
          style={{
            position: "absolute",
            bottom: "-12px",
            ...(buttonText
              ? { left: "50%", transform: "translateX(-50%)", width: "calc(100% - 8px)", borderRadius: "8px", height: "30px", padding: "0 10px", justifyContent: "space-between" }
              : { right: "4px", width: deliveryTime ? "auto" : "32px", borderRadius: deliveryTime ? "16px" : "50%", height: "32px", padding: deliveryTime ? "0 10px" : "0", justifyContent: "center" }),
            background: "#ffffff",
            border: "1px solid #1e40af",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            zIndex: 10
          }}
        >
          {buttonText ? (
            <>
              <span style={{ fontSize: "11px", fontWeight: "600", color: "#1e40af" }}>{buttonText}</span>
              <span style={{ fontSize: "15px", fontWeight: "600", color: "#1e40af" }}>+</span>
            </>
          ) : (
            <>
              {deliveryTime && <span style={{ fontSize: "12px", fontWeight: "600", color: "#1e40af" }}>{deliveryTime}</span>}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="3" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </>
          )}
        </button>
      </div>

      <div className="kalpo-product-card__content" style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: "6px" }}>

        <div className="kalpo-product-card__price-main" style={{ fontSize: "18px", fontWeight: "700", color: "#000000", lineHeight: "1" }}>
          {currentPrice} <span className="kalpo-product-card__currency" style={{ fontSize: "12px", fontWeight: "500" }}>грн</span>
        </div>

        <div className="kalpo-product-card__old-row" style={{ display: "flex", alignItems: "center", gap: "6px", margin: "4px 0", minHeight: "14px" }}>
          {oldPrice && (
            <span className="kalpo-product-card__price-old" style={{ fontSize: "12px", color: "#888", textDecoration: "line-through", fontWeight: "500" }}>
              {Number(oldPrice).toFixed(2)} грн
            </span>
          )}
          {discount && (
            <span className="kalpo-product-card__discount-tag" style={{ background: "#ff7a00", color: "#ffffff", fontSize: "10px", fontWeight: "600", padding: "2px 4px", borderRadius: "4px", lineHeight: "1" }}>
              -{discount}%
            </span>
          )}
        </div>

        {extraInfo && (
          <div className="kalpo-product-card__promo-text" style={{ color: "#16a34a", fontSize: "11px", fontWeight: "500", marginBottom: "2px", lineHeight: "1" }}>
            {extraInfo}
          </div>
        )}

        <h3
          className="kalpo-product-card__title"
          style={{
            margin: "2px 0 6px 0",
            fontSize: "13px",
            color: "#333333",
            fontWeight: "500",
            lineHeight: "1.3",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {product.title}
        </h3>

        <div className="kalpo-product-card__footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", fontSize: "12px", color: "#888888" }}>
          <span>{weight}</span>
          <span className="kalpo-product-card__rating" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#c2c2c2">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            {rating}
          </span>
        </div>
      </div>
    </div>
  );
}
