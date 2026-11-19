async function api(path, method = "GET", body) {
  const response = await fetch("/api" + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 401) {
    window.location.href = "login.html";
    throw new Error("Zaloguj się");
  }
  if (
    response.status !== 204 &&
    !response.headers.get("content-type")?.includes("application/json")
  ) {
    throw new Error(
      response.status === 404
        ? "Serwer nie znalazł tej funkcji. Uruchom ponownie serwer i odśwież stronę."
        : "Serwer zwrócił nieprawidłową odpowiedź. Spróbuj ponownie.",
    );
  }
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const error = new Error(data?.error || "Wystąpił błąd");
    error.fields = data?.fields;
    throw error;
  }
  return data;
}
async function setupHeader() {
  const user = await api("/auth/me");
  document.getElementById("userName").textContent =
    `${user.firstName} ${user.lastName}`;
  if (user.role === "viewer") {
    const badge = document.createElement("span");
    badge.className = "badge text-bg-light";
    badge.textContent = "Tylko podgląd";
    document.getElementById("userName").after(badge);
  }
  if (user.role === "admin") {
    const link = document.createElement("a");
    link.href = "admin.html";
    link.className = "btn btn-outline-light btn-sm";
    link.textContent = "Panel administratora";
    document.getElementById("logoutBtn").before(link);
  }
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await api("/auth/logout", "POST");
    window.location.href = "login.html";
  });
  return user;
}
function showError(id, error) {
  const el = document.getElementById(id);
  el.className = "alert alert-danger";
  el.textContent = error.message;
}

function clearFormErrors(form) {
  form.querySelectorAll(".is-invalid").forEach((field) => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
  });
  form.querySelectorAll(".invalid-feedback").forEach((feedback) => {
    feedback.textContent = "";
  });
}
function fieldError(field, message) {
  let feedback = document.getElementById(field.id + "-error");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = field.id + "-error";
    feedback.className = "invalid-feedback";
    feedback.setAttribute("aria-live", "polite");
    field.after(feedback);
    field.setAttribute(
      "aria-describedby",
      [field.getAttribute("aria-describedby"), feedback.id]
        .filter(Boolean)
        .join(" "),
    );
  }
  field.classList.add("is-invalid");
  field.setAttribute("aria-invalid", "true");
  feedback.textContent = message;
}
function validateForm(form, rules) {
  clearFormErrors(form);
  for (const [id, check] of Object.entries(rules)) {
    const field = document.getElementById(id);
    const message = check(field.value);
    if (message) fieldError(field, message);
  }
  const first = form.querySelector(".is-invalid");
  if (first) first.focus();
  return !first;
}
function formApiError(form, error, messageId, fields) {
  for (const [key, message] of Object.entries(error.fields || {})) {
    const field = document.getElementById(fields[key]);
    if (field) fieldError(field, message);
  }
  showError(messageId, error);
  form.querySelector(".is-invalid")?.focus();
}
const textLength = (min, max, label) => (value) => {
  const length = [...value.trim()].length;
  return length < min || length > max
    ? `${label}: od ${min} do ${max} znaków.`
    : "";
};
const boardRules = {
  boardName: textLength(1, 80, "Nazwa"),
  boardDescription: (value) =>
    [...value].length > 255 ? "Opis: maksymalnie 255 znaków." : "",
};
const taskRules = {
  taskTitle: textLength(3, 100, "Tytuł"),
  taskStatus: (value) =>
    ["todo", "in_progress", "done"].includes(value) ? "" : "Wybierz status.",
  taskPriority: (value) =>
    ["low", "medium", "high"].includes(value) ? "" : "Wybierz priorytet.",
  taskDeadline: (value) =>
    !value ||
    (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
      Number(value.slice(0, 4)) >= 1000 &&
      !Number.isNaN(Date.parse(value)) &&
      new Date(value).toISOString().slice(0, 10) === value)
      ? ""
      : "Podaj poprawną datę.",
  taskAssignee: (value) =>
    !value || (/^\d+$/.test(value) && Number(value) > 0)
      ? ""
      : "Wybierz osobę.",
};
document.querySelectorAll("form").forEach((form) => {
  form.noValidate = true;
  form.addEventListener("input", (event) => {
    const field = event.target;
    if (field.classList.contains("is-invalid")) {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
      const feedback = document.getElementById(field.id + "-error");
      if (feedback) feedback.textContent = "";
    }
  });
});
