export async function adminFetch(url: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin-token') : null;
  if (!token) throw new Error('Not authenticated');

  // For FormData, don't set Content-Type — browser sets it with boundary
  const isFormData = options?.body instanceof FormData;

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    ...((options?.headers || {}) as Record<string, string>),
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });
  if (res.status === 401) {
    localStorage.removeItem('admin-token');
    window.location.reload();
    throw new Error('Session expired');
  }
  return res;
}
