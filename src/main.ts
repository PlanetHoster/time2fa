import { TotpConfig, ValidTotpConfig } from "./interfaces/totp.interface";
import { TimeBased } from "./time-based/time-based";
import {
  DEFAULT_TOTP_ALGO,
  DEFAULT_TOTP_DIGITS,
  DEFAULT_TOTP_PERIOD,
  DEFAULT_TOTP_SECRET_SIZE,
} from "./utils/constants";

export const generateConfig = (config?: TotpConfig): ValidTotpConfig => {
  return {
    algo: config?.algo || DEFAULT_TOTP_ALGO,
    digits: config?.digits || DEFAULT_TOTP_DIGITS,
    period: config?.period || DEFAULT_TOTP_PERIOD,
    secretSize: config?.secretSize || DEFAULT_TOTP_SECRET_SIZE,
  };
};

export const Totp = new TimeBased();
