import { PasscodeOptions, ValidTotpConfig } from "../interfaces/totp.interface";
import { Decode32 } from "../utils/encode";
import * as crypto from "crypto";

export class HmacBased {
  public static generatePassCode(
    params: PasscodeOptions,
    config: ValidTotpConfig
  ): string {
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
}
