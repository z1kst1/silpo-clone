async function addToCart(productName) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Спочатку увійди!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        product: {
          name: productName,
        },
      }),
    });

    const data = await response.json();

    alert("Товар додано в кошик!");
  } catch (error) {
    alert("Помилка");
  }
}
