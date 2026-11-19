async function loadRequests() {
  const requests = await api("/admin/deletion-requests");
  const list = document.getElementById("requests");
  list.replaceChildren();
  if (!requests.length) {
    list.textContent = "Brak oczekujących zgłoszeń.";
    return;
  }
  for (const request of requests) {
    const card = document.createElement("div");
    card.className = "card mb-3";
    const body = document.createElement("div");
    body.className = "card-body";
    const title = document.createElement("h2");
    title.className = "h5";
    title.textContent = request.title;
    const info = document.createElement("p");
    info.className = "small text-muted";
    info.textContent = `Tablica: ${request.boardName} · Zgłosił(a): ${request.requestedBy || "Nieznany użytkownik"} · ${request.purgeRequestedAt}`;
    const actions = document.createElement("div");
    actions.className = "d-flex flex-wrap gap-2";
    const approve = document.createElement("button");
    approve.className = "btn btn-outline-danger btn-sm";
    approve.textContent = "Zatwierdź usunięcie";
    const reject = document.createElement("button");
    reject.className = "btn btn-outline-secondary btn-sm";
    reject.textContent = "Odrzuć zgłoszenie";
    async function decide(approved) {
      if (
        approved &&
        !confirm(
          `Usunąć na stałe zadanie „${request.title}”? Tej operacji nie można cofnąć.`,
        )
      )
        return;
      approve.disabled = true;
      reject.disabled = true;
      document.getElementById("message").textContent = "";
      try {
        await api(
          approved
            ? `/tasks/${request.id}/permanent`
            : `/admin/deletion-requests/${request.id}/reject`,
          approved ? "DELETE" : "POST",
        );
        await loadRequests();
      } catch (error) {
        showError("message", error);
        approve.disabled = false;
        reject.disabled = false;
      }
    }
    approve.onclick = () => decide(true);
    reject.onclick = () => decide(false);
    actions.append(approve, reject);
    body.append(title, info, actions);
    card.append(body);
    list.append(card);
  }
}
(async () => {
  try {
    const user = await setupHeader();
    if (user.role !== "admin") {
      document.getElementById("requests").textContent = "";
      throw new Error("Ta strona jest dostępna tylko dla administratora.");
    }
    await loadRequests();
  } catch (error) {
    showError("message", error);
  }
})();
