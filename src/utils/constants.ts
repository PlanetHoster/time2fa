export const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=";

// ALGO
export const SHA1 = "sha1";
export const SHA256 = "sha256";
export const SHA512 = "sha512";

export type Algorithms = "sha1" | "sha256" | "sha512";

// TOTP
export const DEFAULT_TOTP_PERIOD = 30;
export const DEFAULT_TOTP_DIGITS = 6;
export const DEFAULT_TOTP_SECRET_SIZE = 10;
export const DEFAULT_TOTP_ALGO = SHA1;
