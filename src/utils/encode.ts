import { BASE32_CHARS } from "./constants";

export const Encode32 = (key: Buffer): string => {
  if (!Buffer.isBuffer(key)) {
    throw new TypeError("The input must be a Buffer");
  }

  let encodedKey = "";
  let bitCount = 0;
  let accumulator = 0;

  for (let i = 0; i < key.length; i++) {
    accumulator = (accumulator << 8) | key[i];
    bitCount += 8;

    while (bitCount >= 5) {
      bitCount -= 5;
      const index = (accumulator >> bitCount) & 31;
      encodedKey += BASE32_CHARS.charAt(index);
    }
  }

  if (bitCount > 0) {
    accumulator <<= 5 - bitCount;
    const index = accumulator & 31;
    encodedKey += BASE32_CHARS.charAt(index);
  }
  return encodedKey;
};
