const boardId = Number(new URLSearchParams(location.search).get("id"));
const modal = new bootstrap.Modal(document.getElementById("taskModal"));
const labels = { low: "Niski", medium: "Średni", high: "Wysoki" };
let canEdit = false;
let users = [],
  editingId = null,
  latestRequest = 0,
  draggedTask = null;
const statuses = {
  todo: "Do zrobienia",
  in_progress: "W trakcie",
  done: "Gotowe",
};
async function moveTask(id, status) {
  try {
    const task = await api("/tasks/" + id);
    if (task.status === status) return;
    await api("/tasks/" + id, "PUT", {
      ...task,
      deadline: task.deadline ? task.deadline.slice(0, 10) : null,
      status,
    });
    await loadTasks();
  } catch (error) {
    showError("message", error);
    await loadTasks().catch((e) => showError("message", e));
  }
}
for (const status of Object.keys(statuses)) {
  const column = byColumn(status);
  column.addEventListener("dragover", (event) => {
    if (draggedTask !== null) {
      event.preventDefault();
      column.classList.add("drag-over");
    }
  });
  column.addEventListener("dragleave", (event) => {
    if (!column.contains(event.relatedTarget))
      column.classList.remove("drag-over");
  });
  column.addEventListener("drop", (event) => {
    event.preventDefault();
    column.classList.remove("drag-over");
    if (draggedTask !== null) moveTask(draggedTask, status);
  });
}
function byColumn(status) {
  return document.getElementById("col-" + status).closest(".task-column");
}
const byId = (id) => document.getElementById(id);
function fillTask(task) {
  clearFormErrors(byId("taskForm"));
  editingId = task?.id || null;
  byId("taskForm").reset();
  byId("taskError").textContent = "";
  byId("taskModalTitle").textContent = task
    ? "Szczegóły zadania"
    : "Nowe zadanie";
  if (task) {
    byId("taskTitle").value = task.title;
    byId("taskDescription").value = task.description || "";
    byId("taskStatus").value = task.status;
    byId("taskPriority").value = task.priority;
    byId("taskDeadline").value = task.deadline
      ? task.deadline.slice(0, 10)
      : "";
    byId("taskAssignee").value = task.assigneeId || "";
  }
  byId("taskForm")
    .querySelectorAll("input, textarea, select")
    .forEach((field) => {
      field.disabled = !canEdit;
    });
  byId("taskForm").querySelector(".modal-footer .btn-primary").hidden =
    !canEdit;
  modal.show();
}
async function loadTasks() {
  const request = ++latestRequest;
  const params = new URLSearchParams();
  for (const [id, key] of [
    ["filterPriority", "priority"],
    ["filterPerson", "assigneeId"],
    ["filterTitle", "q"],
  ])
    if (byId(id).value.trim()) params.set(key, byId(id).value.trim());
  const tasks = await api(`/boards/${boardId}/tasks?${params}`);
  if (request !== latestRequest) return;
  for (const status of ["todo", "in_progress", "done"]) {
    const column = byId("col-" + status);
    column.replaceChildren();
    if (!tasks.some((task) => task.status === status)) {
      const empty = document.createElement("p");
      empty.className = "small text-muted mb-0";
      empty.textContent = "Brak zadań";
      column.append(empty);
    }
  }
  for (const task of tasks) {
    const card = document.createElement("div");
    card.className = "card task-card";
    card.draggable = canEdit;
    card.addEventListener("dragstart", (event) => {
      draggedTask = task.id;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(task.id));
      card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
      draggedTask = null;
      card.classList.remove("dragging");
      document
        .querySelectorAll(".drag-over")
        .forEach((column) => column.classList.remove("drag-over"));
    });
    const body = document.createElement("div");
    body.className = "card-body p-3";
    const title = document.createElement("h3");
    title.textContent = task.title;
    const info = document.createElement("p");
    info.className = "small";
    const user = users.find((u) => Number(u.id) === Number(task.assigneeId));
    info.textContent = `Priorytet: ${labels[task.priority]} · Termin: ${task.deadline ? task.deadline.slice(0, 10) : "brak"} · Osoba: ${user ? user.firstName + " " + user.lastName : "Nieprzypisane"}`;
    const actions = document.createElement("div");
    actions.className = "d-flex flex-wrap gap-2";
    const move = document.createElement("div");
    move.className = "dropdown";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "btn btn-sm move-button dropdown-toggle";
    toggle.dataset.bsToggle = "dropdown";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Przenieś zadanie " + task.title);
    toggle.textContent = "Przenieś";
    const menu = document.createElement("ul");
    menu.className = "dropdown-menu move-menu";
    for (const [status, label] of Object.entries(statuses)) {
      if (status === task.status) continue;
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dropdown-item";
      const dot = document.createElement("span");
      dot.className = "status-dot status-" + status;
      dot.setAttribute("aria-hidden", "true");
      button.append(dot, document.createTextNode(label));
      button.addEventListener("click", () => moveTask(task.id, status));
      item.append(button);
      menu.append(item);
    }
    move.append(toggle, menu);
    if (canEdit) actions.append(move);
    const details = document.createElement("button");
    details.className = "btn btn-outline-secondary btn-sm";
    details.textContent = "Szczegóły";
    details.onclick = async () => {
      try {
        fillTask(await api("/tasks/" + task.id));
      } catch (e) {
        showError("message", e);
      }
    };
    const del = document.createElement("button");
    del.className = "btn btn-outline-danger btn-sm";
    del.textContent = "Usuń";
    del.onclick = async () => {
      if (!confirm("Usunąć to zadanie?")) return;
      try {
        await api("/tasks/" + task.id, "DELETE");
        await loadTasks();
      } catch (e) {
        showError("message", e);
      }
    };
    actions.append(details);
    if (canEdit) actions.append(del);
    body.append(title, info, actions);
    card.append(body);
    byId("col-" + task.status).append(card);
  }
}
byId("newTask").onclick = () => fillTask();
byId("taskForm").onsubmit = async (event) => {
  event.preventDefault();
  if (!validateForm(event.target, taskRules)) return;
  byId("taskError").textContent = "";
  const body = {
    title: byId("taskTitle").value.trim(),
    description: byId("taskDescription").value.trim(),
    status: byId("taskStatus").value,
    priority: byId("taskPriority").value,
    deadline: byId("taskDeadline").value || null,
    assigneeId: Number(byId("taskAssignee").value) || null,
    boardId,
  };
  try {
    await api(
      editingId ? "/tasks/" + editingId : "/tasks",
      editingId ? "PUT" : "POST",
      body,
    );
    modal.hide();
    await loadTasks();
  } catch (e) {
    formApiError(event.target, e, "taskError", {
      title: "taskTitle",
      description: "taskDescription",
      status: "taskStatus",
      priority: "taskPriority",
      deadline: "taskDeadline",
      assigneeId: "taskAssignee",
    });
  }
};
for (const id of ["filterPriority", "filterPerson", "filterTitle"])
  byId(id).addEventListener(id === "filterTitle" ? "input" : "change", () =>
    loadTasks().catch((e) => showError("message", e)),
  );
byId("clearFilters").onclick = () => {
  for (const id of ["filterPriority", "filterPerson", "filterTitle"])
    byId(id).value = "";
  loadTasks().catch((e) => showError("message", e));
};
(async () => {
  try {
    if (!Number.isSafeInteger(boardId) || boardId < 1)
      throw new Error("Nieprawidłowy adres tablicy");
    const currentUser = await setupHeader();
    canEdit = ["editor", "admin"].includes(currentUser.role);
    byId("newTask").hidden = !canEdit;
    const boards = await api("/boards");
    const board = boards.find((b) => b.id === boardId);
    if (!board) throw new Error("Nie znaleziono tablicy");
    byId("boardName").textContent = board.name;
    byId("boardDescription").textContent = board.description || "";
    users = await api("/users");
    for (const user of users)
      for (const id of ["filterPerson", "taskAssignee"]) {
        const opt = document.createElement("option");
        opt.value = user.id;
        opt.textContent =
          user.firstName + " " + user.lastName + " (" + user.login + ")";
        byId(id).append(opt);
      }
    await loadTasks();
  } catch (e) {
    showError("message", e);
  }
})();

const trashModal = new bootstrap.Modal(byId("trashModal"));
async function loadTrash() {
  const tasks = await api(`/boards/${boardId}/trash`);
  const list = byId("trashList");
  list.replaceChildren();
  if (!tasks.length) {
    list.textContent = "Kosz jest pusty.";
    return;
  }
  for (const task of tasks) {
    const row = document.createElement("div");
    row.className = "trash-row border-top py-3";
    const text = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = task.title;
    const info = document.createElement("div");
    info.className = "small text-muted";
    info.textContent = statuses[task.status];
    text.append(title, info);
    const restore = document.createElement("button");
    restore.className = "btn btn-outline-primary btn-sm";
    restore.textContent = "Przywróć";
    restore.onclick = async () => {
      restore.disabled = true;
      try {
        await api("/tasks/" + task.id + "/restore", "POST");
        await loadTasks();
        await loadTrash();
      } catch (error) {
        showError("trashError", error);
        restore.disabled = false;
      }
    };
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn btn-outline-danger btn-sm";
    remove.textContent = task.purgeRequestedAt
      ? "Oczekuje na administratora"
      : "Zgłoś do usunięcia";
    remove.disabled = Boolean(task.purgeRequestedAt);
    remove.onclick = async () => {
      if (
        !confirm(
          `Przekazać zadanie „${task.title}” administratorowi do ostatecznego usunięcia?`,
        )
      )
        return;
      restore.disabled = true;
      remove.disabled = true;
      try {
        await api("/tasks/" + task.id + "/deletion-request", "POST");
        await loadTrash();
      } catch (error) {
        showError("trashError", error);
        restore.disabled = false;
        remove.disabled = false;
      }
    };
    const actions = document.createElement("div");
    actions.className = "trash-actions";
    if (canEdit) actions.append(restore);
    if (task.purgeRequestedAt) {
      const pending = document.createElement("span");
      pending.className = "request-pending";
      pending.textContent = "Oczekuje na administratora";
      actions.append(pending);
    } else if (canEdit) actions.append(remove);
    row.classList.add("flex-wrap");
    row.append(text, actions);
    list.append(row);
  }
}
byId("openTrash").onclick = async () => {
  byId("trashError").textContent = "";
  byId("trashList").textContent = "Ładowanie…";
  trashModal.show();
  try {
    await loadTrash();
  } catch (error) {
    byId("trashList").textContent = "";
    showError("trashError", error);
  }
};
