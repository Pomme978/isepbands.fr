export async function uploadFile(file: File, userId?: number) {
  const form = new FormData();
  form.append('file', file);
  if (userId) form.append('userId', userId.toString());
  const res = await fetch('/api/storage', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function downloadFile(key: string) {
  const res = await fetch(`/api/storage?key=${encodeURIComponent(key)}`);
  if (!res.ok) throw new Error('Download failed');
  return res.blob();
}

export async function deleteFile(key: string) {
  const res = await fetch(`/api/storage?key=${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}
