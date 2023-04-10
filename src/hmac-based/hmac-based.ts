import {
  HotpCode,
  HotpValidateOptions,
  TotpConfig,
  ValidTotpConfig,
} from "../interfaces/otp.interface";
import { generateConfig } from "../main";
import { Decode32 } from "../utils/encode";
import * as crypto from "crypto";
import { ValidationError } from "../utils/validation-error";
import { INVALID_SECRET_ERR } from "../utils/constants";

export class HmacBased {
  public generatePasscode(params: HotpCode, config: ValidTotpConfig): string {
    if (!params.secret || params.secret.length !== config.secretSize) {
      throw new ValidationError(INVALID_SECRET_ERR);
    }

    const secretBytes = Buffer.from(Decode32(params.secret));

    const buf = Buffer.alloc(8);
    buf.writeUInt32BE(params.counter, 4);
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

  public validate(params: HotpValidateOptions, config?: TotpConfig) {
    const validatedConfig = generateConfig(config);

    const passcode = params?.passcode.replace(/\s/g, "") || "";
    if (passcode.length !== validatedConfig.digits) {
      throw new ValidationError("Invalid passcode");
    }

    const code = this.generatePasscode(params, validatedConfig);

    if (code === passcode) {
      return true;
    }

    return false;
  }
}
