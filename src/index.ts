import {
    DEFAULT_TOTP_ALGO,
    DEFAULT_TOTP_DIGITS,
    DEFAULT_TOTP_PERIOD,
    DEFAULT_TOTP_SECRET_SIZE,
} from "./utils/constants";
import {
    TotpConfig,
    UrlOptions,
    ValidTotpConfig,
} from "./interfaces";
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

export const generateUrl = (
    options: UrlOptions,
    config: ValidTotpConfig
): string => {
    const url = new URL(`otpauth://totp`);
    url.pathname = `/${encodeURIComponent(options.issuer)}:${encodeURIComponent(
        options.user
    )}`;

    const params = new URLSearchParams({
        issuer: options.issuer,
        period: config.period.toString(), // Currently ignored by the google auth implementations
        secret: options.secret,
    });

    // Currently ignored by the google auth implementations
    if (config.algo !== DEFAULT_TOTP_ALGO) {
        params.set("algorithm", config.algo);
    }

    // Currently ignored by the google auth implementations
    if (config.digits !== DEFAULT_TOTP_DIGITS) {
        params.set("digits", config.digits.toString());
    }

    url.search = params.toString();

    return url.toString();
};

export const Totp = new TimeBased();
export const Hotp = new HmacBased();
export * from './interfaces';