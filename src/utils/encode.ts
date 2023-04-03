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

export const Decode32 = (s: string): Buffer => {
  const lookupTable = new Uint8Array(256);

  for (let i = 0; i < BASE32_CHARS.length; i++) {
    lookupTable[BASE32_CHARS.charCodeAt(i)] = i;
  }

  let bits = 0;
  let bitsCount = 0;
  let result = Buffer.alloc(Math.ceil((s.length * 5) / 8));

  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 61) {
      while (bitsCount >= 8) {
        bitsCount -= 8;
        result.writeUInt8((bits >> bitsCount) & 255, (i * 5) >> 3);
      }
      break;
    }

    const value = lookupTable[c];

    if (value === undefined) {
      throw new Error("Invalid base32 string");
    }

    bits = (bits << 5) | value;
    bitsCount += 5;
    if (bitsCount >= 8) {
      bitsCount -= 8;
      result.writeUInt8((bits >> bitsCount) & 255, (i * 5) >> 3);
    }
  }

  return result.subarray(
    0,
    result.indexOf(0) !== -1 ? result.indexOf(0) : undefined
  );
};
