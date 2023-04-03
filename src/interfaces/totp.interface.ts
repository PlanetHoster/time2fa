export interface TotpConfig {
  secretSize: number;
  period: number;
  digits: number;
  algo: string;
}

export interface TotpOptions {
  issuer: string;
  user: string;
  config?: TotpConfig;
}

export interface Secret {
  base32: string;
}

export interface QrCodeOptions {
  width: string;
  height: string;
}
