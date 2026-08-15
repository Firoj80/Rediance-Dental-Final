export async function adminFetch(url: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin-token') : null;
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('admin-token');
    window.location.reload();
    throw new Error('Session expired');
  }
  return res;
}
