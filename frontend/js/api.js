async function api(path, method = 'GET', body) {
  const res = await fetch('/api' + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 401) {
    window.location.href = 'login.html';
    return new Promise(() => {});
  }

  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) {
    throw new Error(data.error);
  }
  return data;
}