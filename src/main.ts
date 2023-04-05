import {
  DEFAULT_TOTP_ALGO,
  DEFAULT_TOTP_DIGITS,
  DEFAULT_TOTP_PERIOD,
  DEFAULT_TOTP_SECRET_SIZE,
} from "./utils/constants";
import { TotpConfig, ValidTotpConfig } from "./interfaces/otp.interface";
import { TimeBased } from "./time-based/time-based";
import { Encode32 } from "./utils/encode";
import crypto from "crypto";
import { HmacBased } from "./hmac-based/hmac-based";

export const generateConfig = (config?: TotpConfig): ValidTotpConfig => {
  return {
    algo: config?.algo || DEFAULT_TOTP_ALGO,
    digits: config?.digits || DEFAULT_TOTP_DIGITS,
    period: config?.period || DEFAULT_TOTP_PERIOD,
    secretSize: config?.secretSize || DEFAULT_TOTP_SECRET_SIZE,
  };
};

export const generateSecret = (
  secretSize = DEFAULT_TOTP_SECRET_SIZE
): string => {
  const bytes = Buffer.from(crypto.randomBytes(secretSize));
  return Encode32(bytes);
};

export const generateBackupCodes = (
  numCodes = 10,
  codeLength = DEFAULT_TOTP_DIGITS
): string[] => {
  const backupCodes = [];

  for (let i = 0; i < numCodes; i++) {
    let code = "";
    for (let j = 0; j < codeLength; j++) {
      code += crypto.randomInt(0, 10).toString();
    }
    backupCodes.push(code);
  }

  return backupCodes;
};

export const Totp = new TimeBased();
export const Hotp = new HmacBased();
