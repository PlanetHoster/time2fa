import { Algorithms } from "../utils/constants";
export interface TotpConfig {
  secretSize?: number;
  period?: number;
  digits?: number;
  algo?: Algorithms;
}

export interface ValidTotpConfig {
  secretSize: number;
  period: number;
  digits: number;
  algo: Algorithms;
}

export interface TotpOptions {
  issuer: string;
  user: string;
}

export interface Secret {
  base32: string;
}

export interface QrCodeOptions {
  width: string;
  height: string;
}

export interface ValidateOptions {
  passcode: string;
  secret: string;
  drift?: number;
  config?: TotpConfig;
}

export interface PasscodeOptions {
  secret: string;
  counter: number;
}
