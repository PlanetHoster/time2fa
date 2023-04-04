import { BASE32_CHARS } from "./constants";

// https://tools.ietf.org/html/rfc6238

export const Encode32 = (key: Buffer): string => {
  if (!Buffer.isBuffer(key)) {
    throw new TypeError("The input must be a Buffer");
  }

  let binary = "";

  for (let i = 0; i < key.length; i++) {
    binary += key[i].toString(2).padStart(8, "0");
  }

  let base32 = "";

  for (let i = 0; i < binary.length; i += 5) {
    const chunk = binary.substring(i, i + 5);
    base32 += BASE32_CHARS[parseInt(chunk, 2)];
  }

  const padding = base32.length % 8;

  if (padding > 0) {
    base32 += "=".repeat(8 - padding);
  }

  return base32;
};

export const Decode32 = (s: string): Buffer => {
  const len = s.length;

  let bits = 0;
  let value = 0;
  let offset = 0;

  const result = Buffer.alloc(Math.ceil((len * 5) / 8));

  for (let i = 0; i < len; i++) {
    const char = s.charAt(i);
    const index = BASE32_CHARS.indexOf(char.toUpperCase());

    if (index === 32) {
      continue;
    }

    if (index === -1) {
      throw new Error(`Invalid character found: ${char}`);
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      result[offset++] = value >> (bits - 8);
      bits -= 8;
    }
  }

  return result.subarray(0, offset);
};
