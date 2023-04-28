import {
  HotpCode,
  HotpValidateOptions,
  TotpConfig,
  ValidTotpConfig,
} from "../interfaces";
import { generateConfig } from "../index";
import { Decode32 } from "../utils/encode";
import crypto from "crypto";
import { ValidationError } from "../utils/validation-error";
import { INVALID_SECRET_ERR } from "../utils/constants";

export class HmacBased {
  public generatePasscode(options: HotpCode, config: ValidTotpConfig): string {
    const secretBytes = Buffer.from(Decode32(options.secret));

    if (secretBytes.length !== config.secretSize) {
      throw new ValidationError(INVALID_SECRET_ERR);
    }

    const buf = Buffer.alloc(8);
    buf.writeUInt32BE(options.counter, 4);
    const hmac = crypto.createHmac(config.algo, secretBytes);
    hmac.update(buf);
    const hmacResult = hmac.digest();

    // https://www.rfc-editor.org/rfc/rfc4226#section-5.4
    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const value =
      ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff);

    const mod = value % Math.pow(10, config.digits);

    return mod.toString().padStart(config.digits, "0");
  }

  public validate(options: HotpValidateOptions, config?: TotpConfig): boolean {
    const validatedConfig = generateConfig(config);

    const passcode = options?.passcode.replace(/\s/g, "") || "";
    if (passcode.length !== validatedConfig.digits) {
      throw new ValidationError("Invalid passcode");
    }

    const code = this.generatePasscode(options, validatedConfig);

    if (code === passcode) {
      return true;
    }

    return false;
  }
}
