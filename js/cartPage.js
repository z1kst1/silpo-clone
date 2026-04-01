async function loadCart() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Увійди!");
    return;
  }

  const response = await fetch("http://localhost:3000/api/cart", {
    headers: {
      Authorization: token,
    },
  });

  const data = await response.json();

  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  let total = 0;

  data.cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    container.innerHTML += `
<div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
<h3>${item.name}</h3>
<p>${item.price} грн x ${item.quantity}</p>

<button onclick="changeQuantity(${index}, -1)">➖</button>
<button onclick="changeQuantity(${index}, 1)">➕</button>

<p>Сума: ${itemTotal} грн</p>

<button onclick="removeItem(${index})">Видалити</button>
</div>
`;
  });

  container.innerHTML += `<h2>Загальна сума: ${total} грн</h2>`;
}

async function changeQuantity(index, change) {
  const token = localStorage.getItem("token");

  await fetch("http://localhost:3000/api/cart/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ index, change }),
  });

  loadCart();
}

async function removeItem(index) {
  const token = localStorage.getItem("token");

  await fetch("http://localhost:3000/api/cart/remove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ index }),
  });

  loadCart();
}

loadCart();
