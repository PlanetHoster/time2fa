import crypto from "crypto";
import { TotpConfig, TotpOptions } from "../interfaces/totp.interface";
import { Encode32 } from "../utils/encode";
import * as qrcode from "qrcode";
import {
  DEFAULT_TOTP_ALGO,
  DEFAULT_TOTP_DIGITS,
  DEFAULT_TOTP_PERIOD,
  DEFAULT_TOTP_SECRET_SIZE,
} from "../utils/constants";

// https://github.com/google/google-authenticator/wiki/Key-Uri-Format

export class GenerateKey {
  private readonly issuer: string;
  private readonly user: string;
  private readonly config: TotpConfig;
  private readonly secret: string;
  private readonly url: string;

  constructor(options: TotpOptions) {
    if (!options?.issuer) {
      throw new Error("No issuer found");
    }
    if (!options?.user) {
      throw new Error("No user found");
    }

    this.issuer = options.issuer;
    this.user = options.user;

    this.config = this.generateConfig(options?.config);

    this.secret = this.generateSecret();
    this.url = this.generateUrl();
  }

  qrCode(params?: { dataUrl: boolean }): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      qrcode.toDataURL(this.url, (err, url) => {
        if (err) {
          reject(err);
        } else {
          let resp = url;
          if (!params || !params?.dataUrl) {
            resp = resp.replace(/^data:image\/png;base64,/, "");
          }
          resolve(resp);
        }
      });
    });
  }

  private generateUrl(): string {
    if (this.config && this.secret) {
      const url = new URL(`otpauth://totp`);
      url.pathname = `/${encodeURIComponent(this.issuer)}:${encodeURIComponent(
        this.user
      )}`;
      url.search = new URLSearchParams({
        issuer: this.issuer,
        period: this.config.period.toString(), // Currently ignored by the google auth implementations
        algorithm: this.config.algo, // Currently ignored by the google auth implementations
        digits: this.config.digits.toString(),
        secret: this.secret,
      }).toString();

      return url.toString();
    } else {
      throw new Error("Invalid configuration");
    }
  }

  private generateSecret(): string {
    const bytes = Buffer.from(crypto.randomBytes(this.config.secretSize));
    return Encode32(bytes);
  }

  private generateConfig(config: TotpConfig | undefined): TotpConfig {
    return {
      algo: config?.algo || DEFAULT_TOTP_ALGO,
      digits: config?.digits || DEFAULT_TOTP_DIGITS,
      period: config?.period || DEFAULT_TOTP_PERIOD,
      secretSize: config?.secretSize || DEFAULT_TOTP_SECRET_SIZE,
    };
  }
}
