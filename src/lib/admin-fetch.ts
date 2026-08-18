export async function adminFetch(url: string, options?: RequestInit) {
  // For FormData, don't set Content-Type — browser sets it with boundary
  const isFormData = options?.body instanceof FormData;

  const headers: Record<string, string> = {
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
    window.location.reload();
    throw new Error('Session expired');
  }
  return res;
}
