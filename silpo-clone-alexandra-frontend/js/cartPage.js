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

  data.forEach((item, index) => {
    container.innerHTML += `
<div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
<h3>${item.name}</h3>
<button onclick="removeItem(${index})">Видалити</button>
</div>
`;
  });
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
