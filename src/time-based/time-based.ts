import { HmacBased } from "../hmac-based/hmac-based";
import {
  TotpCode,
  TotpConfig,
  TotpOptions,
  ValidTotpConfig,
  TotpValidateOptions,
} from "../interfaces/otp.interface";
import { generateConfig } from "../main";
import { DEFAULT_TOTP_PERIOD } from "../utils/constants";
import { ValidationError } from "../utils/validation-error";
import { GenerateKey } from "./generate-key";

export class TimeBased {
  public generateKey(options: TotpOptions, config?: TotpConfig): GenerateKey {
    return new GenerateKey(options, config);
  }

  public generatePasscodes(
    params: TotpCode,
    config: ValidTotpConfig
  ): string[] {
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / DEFAULT_TOTP_PERIOD);

    const counters = [counter];
    if (params.drift && params.drift > 0) {
      for (let i = 1; i <= params.drift; i++) {
        counters.push(counter + i);
        counters.push(counter - i);
      }
    }

    const codes: string[] = [];
    const hmac = new HmacBased();

    for (let i = 0; i < counters.length; i++) {
      codes.push(
        hmac.generatePasscode(
          {
            secret: params.secret,
            counter: counters[i],
          },
          config
        )
      );
    }

    return codes;
  }

  public validate(params: TotpValidateOptions, config?: TotpConfig): boolean {
    const validatedConfig = generateConfig(config);

    const passcode = params?.passcode.replace(/\s/g, "") || "";
    if (passcode.length !== validatedConfig.digits) {
      throw new ValidationError("Invalid passcode");
    }

    const codes = this.generatePasscodes(params, validatedConfig);

    if (codes.includes(passcode)) {
      return true;
    }

    return false;
  }
}
