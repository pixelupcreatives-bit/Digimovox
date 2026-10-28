/** Cloudflare R2 helpers for the "beyonddigital" bucket. */
export const R2_PUBLIC_BASE =
  "https://pub-bc18f6c9126e4066af8b501603b01104.r2.dev";

/** Build a collision-safe object key from a folder + display name. */
export function buildKey(folder: string, name: string): string {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80) || "file";
  const stamp = Date.now().toString(36);
  return `${cleanFolder ? cleanFolder + "/" : ""}${stamp}-${safeName}`;
}

export async function putObject(
  bucket: R2Bucket,
  key: string,
  body: ArrayBuffer | Uint8Array | string,
  contentType?: string,
): Promise<void> {
  await bucket.put(key, body, {
    httpMetadata: contentType ? { contentType } : undefined,
  });
}

export function publicUrl(key: string): string {
  return `${R2_PUBLIC_BASE}/${key}`;
}
