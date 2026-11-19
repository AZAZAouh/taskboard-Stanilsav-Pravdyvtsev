async function submitAuth(path, body) {
  const response = await fetch("/api/auth/" + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error || "Wystąpił błąd");
    error.fields = data.fields;
    throw error;
  }
  window.location.href = "boards.html";
}
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    if (
      !validateForm(event.target, {
        login: textLength(1, 30, "Login"),
        password: (value) => (value ? "" : "Podaj hasło."),
      })
    )
      return;
    document.getElementById("message").textContent = "";
    try {
      await submitAuth("login", {
        login: document.getElementById("login").value.trim(),
        password: document.getElementById("password").value,
      });
    } catch (error) {
      formApiError(event.target, error, "message", {
        login: "login",
        password: "password",
      });
    }
  });
document
  .getElementById("registerForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    if (
      !validateForm(event.target, {
        regLogin: (value) =>
          /^[a-zA-Z0-9._-]{3,30}$/.test(value.trim())
            ? ""
            : "Login: 3–30 liter, cyfr lub znaków . _ -",
        firstName: textLength(1, 50, "Imię"),
        lastName: textLength(1, 50, "Nazwisko"),
        regPassword: (value) =>
          value.length >= 8 && new TextEncoder().encode(value).length <= 72
            ? ""
            : "Hasło: minimum 8 znaków, maksymalnie 72 bajty.",
        confirmPassword: (value) =>
          value === document.getElementById("regPassword").value
            ? ""
            : "Hasła muszą być takie same.",
      })
    )
      return;
    document.getElementById("message").textContent = "";
    const password = document.getElementById("regPassword").value;
    try {
      await submitAuth("register", {
        login: document.getElementById("regLogin").value.trim(),
        password,
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
      });
    } catch (error) {
      formApiError(event.target, error, "message", {
        login: "regLogin",
        password: "regPassword",
        firstName: "firstName",
        lastName: "lastName",
      });
    }
  });
