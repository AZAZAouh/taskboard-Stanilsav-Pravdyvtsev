document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      login: document.getElementById('login').value,
      password: document.getElementById('password').value
    })
  });

  if (res.ok) {
    window.location.href = 'board.html?id=1';
  } else {
    const data = await res.json();
    document.getElementById('message').innerHTML =
      `<div class="alert alert-danger">${data.error}</div>`;
  }
});
