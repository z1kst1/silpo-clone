let cartCount = 0;
const buttons = document.querySelectorAll(".product-card button");
const cartButton = document.querySelector(".user-actions button:last-child");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    cartCount++;
    cartButton.textContent = `Кошик (${cartCount})`;
  });
});
