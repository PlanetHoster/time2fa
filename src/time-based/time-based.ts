import { HmacBased } from "../hmac-based/hmac-based";
import {
  TotpConfig,
  TotpOptions,
  ValidateOptions,
} from "../interfaces/totp.interface";
import { generateConfig } from "../main";
import { DEFAULT_TOTP_DIGITS, DEFAULT_TOTP_PERIOD } from "../utils/constants";
import { ValidationError } from "../utils/validation-error";
import { GenerateKey } from "./generate-key";

export class TimeBased {
  generateKey(options: TotpOptions, config?: TotpConfig): GenerateKey {
    return new GenerateKey(options, config);
  }

  validate(params: ValidateOptions, config?: TotpConfig): boolean {
    const validatedConfig = generateConfig(config);

    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / DEFAULT_TOTP_PERIOD);

    // const counters = [counter];
    // if (params.drift && params.drift > 0) {
    //   // TODO ADD MORE COUNTERS BASED ON DRIFT VALUE
    // }

    const codeLength = validatedConfig.digits || DEFAULT_TOTP_DIGITS;
    const passcode = params?.passcode.replace(/\s/g, "") || "";
    if (passcode.length !== codeLength) {
      throw new ValidationError("Invalid passcode");
    }

    const validationCode = HmacBased.generatePasscode(
      {
        secret: params.secret,
        counter,
      },
      validatedConfig
    );

    if (validationCode === passcode) {
      return true;
    }

    return false;
  }
}
