import {
  TotpConfig,
  TotpOptions,
  ValidTotpConfig,
} from "../interfaces/otp.interface";
import { generateConfig, generateSecret, generateUrl } from "../index";

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

    this.url = generateUrl(
      {
        issuer: this.issuer,
        user: this.user,
        secret: this.secret,
      },
      this.config
    );
  }
}
