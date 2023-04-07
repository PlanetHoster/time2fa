import {
  TotpConfig,
  TotpOptions,
  ValidTotpConfig,
} from "../interfaces/otp.interface";
import { generateConfig, generateSecret } from "../main";
import { DEFAULT_TOTP_ALGO, DEFAULT_TOTP_DIGITS } from "../utils/constants";

// https://github.com/google/google-authenticator/wiki/Key-Uri-Format

export class GenerateKey {
  public readonly issuer: string;
  public readonly user: string;
  public readonly secret: string;
  public readonly url: string;
  public readonly config: ValidTotpConfig;

  constructor(options: TotpOptions, config?: TotpConfig) {
    if (!options?.issuer) {
      throw new Error("No issuer found");
    }
    if (!options?.user) {
      throw new Error("No user found");
    }

    this.issuer = options.issuer;
    this.user = options.user;

    this.config = generateConfig(config);

    this.secret = generateSecret(this.config.secretSize);
    this.url = this.generateUrl();
  }

  private generateUrl(): string {
    if (this.config && this.secret) {
      const url = new URL(`otpauth://totp`);
      url.pathname = `/${encodeURIComponent(this.issuer)}:${encodeURIComponent(
        this.user
      )}`;

      const params = new URLSearchParams({
        issuer: this.issuer,
        period: this.config.period.toString(), // Currently ignored by the google auth implementations
        secret: this.secret,
      });

      // Currently ignored by the google auth implementations
      if (this.config.algo !== DEFAULT_TOTP_ALGO) {
        params.set("algorithm", this.config.algo);
      }

      // Currently ignored by the google auth implementations
      if (this.config.digits !== DEFAULT_TOTP_DIGITS) {
        params.set("digits", this.config.digits.toString());
      }

      url.search = params.toString();

      return url.toString();
    } else {
      throw new Error("Invalid configuration");
    }
  }
}
