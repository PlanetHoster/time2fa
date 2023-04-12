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

export interface TotpCode {
  secret: string;
  drift?: number;
}

export interface TotpValidateOptions extends TotpCode {
  passcode: string;
}

export interface HotpCode {
  secret: string;
  counter: number;
}

export interface HotpValidateOptions extends HotpCode {
  passcode: string;
}
