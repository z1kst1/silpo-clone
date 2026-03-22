async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      document.getElementById("message").innerText = "Успішний вхід!";
    } else {
      document.getElementById("message").innerText = data.message;
    }
  } catch (error) {
    document.getElementById("message").innerText = "Помилка сервера";
  }
}
