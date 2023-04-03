import { TotpOptions } from "../interfaces/totp.interface";
import { GenerateKey } from "./generate-key";

export class TimeBased {
  generateKey(options: TotpOptions): GenerateKey {
    return new GenerateKey(options);
  }

  validate() {
    console.error("NOT IMPLEMENTED");
  }
}
