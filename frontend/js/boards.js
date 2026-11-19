const modal = new bootstrap.Modal(document.getElementById("boardModal"));
let editingId = null;
let boards = [];
let users = [];
let canEdit = false;
function openBoard(board) {
  clearFormErrors(document.getElementById("boardForm"));
  editingId = board?.id || null;
  document.getElementById("boardModalTitle").textContent = board
    ? "Edytuj tablicę"
    : "Nowa tablica";
  document.getElementById("boardName").value = board?.name || "";
  document.getElementById("boardDescription").value = board?.description || "";
  document.getElementById("boardError").textContent = "";
  modal.show();
}
async function loadBoards() {
  boards = await api("/boards");
  const container = document.getElementById("boards");
  container.replaceChildren();
  if (!boards.length) {
    container.textContent = "Nie ma jeszcze żadnych tablic.";
    return;
  }
  for (const board of boards) {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    const card = document.createElement("div");
    card.className = "card board-card";
    const body = document.createElement("div");
    body.className = "card-body";
    const title = document.createElement("h2");
    title.className = "h5";
    title.textContent = board.name;
    const description = document.createElement("p");
    description.textContent = board.description || "Brak opisu";
    const owner = document.createElement("p");
    owner.className = "small text-muted";
    const person = users.find((u) => u.id === board.ownerId);
    owner.textContent =
      "Utworzył(a): " +
      (person
        ? `${person.firstName} ${person.lastName}`
        : "Nieznany użytkownik");
    const actions = document.createElement("div");
    actions.className = "d-flex gap-2";
    const link = document.createElement("a");
    link.className = "btn btn-primary btn-sm";
    link.href = "board.html?id=" + board.id;
    link.textContent = "Otwórz";
    const edit = document.createElement("button");
    edit.className = "btn btn-outline-secondary btn-sm";
    edit.textContent = "Edytuj";
    edit.onclick = () => openBoard(board);
    const del = document.createElement("button");
    del.className = "btn btn-outline-danger btn-sm";
    del.textContent = "Usuń";
    del.onclick = async () => {
      if (!confirm("Usunąć tę tablicę?")) return;
      try {
        await api("/boards/" + board.id, "DELETE");
        await loadBoards();
      } catch (e) {
        showError("message", e);
      }
    };
    actions.append(link);
    if (canEdit) actions.append(edit, del);
    body.append(title, description, owner, actions);
    card.append(body);
    col.append(card);
    container.append(col);
  }
}
document.getElementById("newBoard").onclick = () => openBoard();
document.getElementById("boardForm").onsubmit = async (event) => {
  event.preventDefault();
  if (!validateForm(event.target, boardRules)) return;
  document.getElementById("boardError").textContent = "";
  try {
    await api(
      editingId ? "/boards/" + editingId : "/boards",
      editingId ? "PUT" : "POST",
      {
        name: document.getElementById("boardName").value.trim(),
        description: document.getElementById("boardDescription").value.trim(),
      },
    );
    modal.hide();
    await loadBoards();
  } catch (e) {
    formApiError(event.target, e, "boardError", {
      name: "boardName",
      description: "boardDescription",
    });
  }
};
(async () => {
  try {
    const currentUser = await setupHeader();
    canEdit = ["editor", "admin"].includes(currentUser.role);
    document.getElementById("newBoard").hidden = !canEdit;
    users = await api("/users");
    await loadBoards();
  } catch (e) {
    showError("message", e);
  }
})();
