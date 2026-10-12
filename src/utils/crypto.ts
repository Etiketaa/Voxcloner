/**
 * End-to-End Encryption (E2EE) module using Web Crypto API.
 * Uses AES-GCM 256-bit with PBKDF2 key derivation from a user master key/passphrase.
 * Complies with strict data privacy guidelines for localized databases.
 */

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: string, passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const encodedData = enc.encode(data);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt);
  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedData
  );

  // Package: salt (16) + iv (12) + encryptedContent
  const combined = new Uint8Array(16 + 12 + encryptedContent.byteLength);
  combined.set(salt, 0);
  combined.set(iv, 16);
  combined.set(new Uint8Array(encryptedContent), 28);

  // Return Base64
  let binary = '';
  for (let i = 0; i < combined.length; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return btoa(binary);
}

export async function decryptData(cipherBase64: string, passphrase: string): Promise<string> {
  const binary = atob(cipherBase64);
  const combined = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    combined[i] = binary.charCodeAt(i);
  }

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encryptedData = combined.slice(28);

  const key = await deriveKey(passphrase, salt);
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encryptedData
  );

  const dec = new TextDecoder();
  return dec.decode(decrypted);
}
