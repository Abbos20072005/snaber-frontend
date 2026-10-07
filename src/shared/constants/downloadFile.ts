import { toast } from 'sonner';

import { apiWithoutAuth } from '../api';

export async function downloadWithAuth(url: string) {
  const res = await apiWithoutAuth.get(url, {
    responseType: 'blob'
  });

  if (res.status !== 200) toast.error('Failed to download reports');

  const cd = res.headers['content-disposition'] as string | undefined;
  const filename = getFilenameFromDisposition(cd) || 'file';

  const blob = res.data as Blob;
  const href = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href,
    download: filename
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

export const getFilenameFromDisposition = (disposition?: string | null) => {
  if (!disposition) return null;
  const m = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(disposition);
  try {
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return m?.[1] ?? null;
  }
};
