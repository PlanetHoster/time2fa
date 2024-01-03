import { describe, expect, test } from "vitest";
import {
  Totp,
  generateConfig,
  generateSecret,
  generateBackupCodes,
  Hotp,
} from "../src";

const issuer = "n0c";
const user = "johndoe@n0c.com";

describe("TOTP Generate Key", () => {
  const defaultConfig = generateConfig();

  test("issuer is present", () => {
    expect(() => Totp.generateKey({ issuer: "", user })).toThrow(
      "No issuer found"
    );
  });

  test("user is present", () => {
    expect(() => Totp.generateKey({ issuer, user: "" })).toThrow(
      "No user found"
    );
  });

  const key = Totp.generateKey({ issuer, user });

  test("valid issuer", () => {
    expect(key.issuer).toBe(issuer);
  });

  test("valid user", () => {
    expect(key.user).toBe(user);
  });

  test("valid default config", () => {
    expect(key.config).toEqual(defaultConfig);
  });

  test("parsable url", () => {
    expect(() => {
      new URL(key.url);
    }).not.toThrow();
  });

  test("secret is base32", () => {
    expect(
      key.secret.length % 8 === 0 && /^[A-Z2-7]+=*$/.test(key.secret)
    ).toBe(true);
  });
});

describe("TOTP passcodes default config", () => {
  const key = Totp.generateKey({ issuer, user });
  const driftValue = 1; // Should return 3 codes

  const otherSecret = generateSecret();

  const codes = Totp.generatePasscodes(
    { secret: key.secret, drift: driftValue },
    key.config
  );

  test("drift with value 1 respected", () => {
    expect(codes.length).toBe(3);
  });

  test("codes digits", () => {
    codes.forEach((c) => {
      expect(c.length).toBe(key.config.digits);
    });
  });

  test("validation with key secret", () => {
    const idx = Math.floor(Math.random() * codes.length); // Getting a random index
    expect(
      Totp.validate({
        passcode: codes[idx],
        secret: key.secret,
        drift: driftValue,
      })
    ).toBe(true);
  });

  test("failed validation with other secret", () => {
    const idx = Math.floor(Math.random() * codes.length); // Getting a random index
    expect(
      Totp.validate({
        passcode: codes[idx],
        secret: otherSecret,
        drift: driftValue,
      })
    ).toBe(false);
  });

  test("invalid secret length", () => {
    const secret = generateSecret(32);
    expect(() => Totp.validate({ passcode: codes[1], secret })).toThrow(
      "Invalid secret"
    );
  });

  test("valid secret length but wrong secret", () => {
    const secret = generateSecret(10);
    expect(Totp.validate({ passcode: codes[1], secret })).toBe(false);
  });

  test("invalid passcode length", () => {
    expect(() =>
      Totp.validate({ passcode: "123", secret: key.secret })
    ).toThrow("Invalid passcode");
  });
});


describe("TOTP passcodes custom config", () => {
  const key = Totp.generateKey({ issuer, user }, { period : 60, digits: 8 , secretSize: 20});
  const driftValue = 1; // Should return 3 codes

  const otherSecret = generateSecret(20);

  const codes = Totp.generatePasscodes(
    { secret: key.secret, drift: driftValue },
    key.config
  );

  test("drift with value 1 respected", () => {
    expect(codes.length).toBe(3);
  });

  test("codes digits", () => {
    codes.forEach((c) => {
      expect(c.length).toBe(key.config.digits);
    });
  });

  test("validation with key secret", () => {
    const idx = Math.floor(Math.random() * codes.length); // Getting a random index
    expect(
      Totp.validate({
        passcode: codes[idx],
        secret: key.secret,
        drift: driftValue,
      }, key.config)
    ).toBe(true);
  });

  test("failed validation with other secret", () => {
    const idx = Math.floor(Math.random() * codes.length); // Getting a random index
    expect(
      Totp.validate({
        passcode: codes[idx],
        secret: otherSecret,
        drift: driftValue,
      }, key.config)
    ).toBe(false);
  });

  test("invalid secret length", () => {
    const secret = generateSecret(32);
    expect(() => Totp.validate({ passcode: codes[1], secret }, key.config)).toThrow(
      "Invalid secret"
    );
  });

  test("valid secret length but wrong secret", () => {
    const secret = generateSecret(20);
    expect(Totp.validate({ passcode: codes[1], secret }, key.config)).toBe(false);
  });

  test("invalid passcode length", () => {
    expect(() =>
      Totp.validate({ passcode: "123", secret: key.secret }, key.config)
    ).toThrow("Invalid passcode");
  });
});

describe("TOTP passcodes hashing algorithms", () => {
  const sha256Config = generateConfig({ algo: "sha256" });

  const key = Totp.generateKey({ issuer, user }, sha256Config);

  const codes = Totp.generatePasscodes({ secret: key.secret }, sha256Config);
  const code = codes[0];

  test("valid sha256 algo validation", () => {
    expect(
      Totp.validate({ passcode: code, secret: key.secret }, sha256Config)
    ).toBe(true);
  });

  test("invalid sha256 algo validation (sha1)", () => {
    expect(Totp.validate({ passcode: code, secret: key.secret })).toBe(false); // Will use default config, algo: 'sha1'
  });

  test("invalid sha256 algo validation (sha512)", () => {
    expect(
      Totp.validate({ passcode: code, secret: key.secret }, { algo: "sha512" })
    ).toBe(false);
  });
});

describe("Helpers", () => {
  test("backup codes default count", () => {
    const backupCodes = generateBackupCodes();
    expect(backupCodes.length).toBe(10);
  });

  test("backup code default length", () => {
    const backupCodes = generateBackupCodes();
    expect(backupCodes[0].length).toBe(6);
  });
});

describe("HOTP", () => {
  const config = generateConfig();
  const secret = generateSecret();

  const code = Hotp.generatePasscode({ secret, counter: 1 }, config);

  test("passcode validation valid counter", () => {
    expect(Hotp.validate({ passcode: code, secret, counter: 1 })).toBe(true);
  });

  test("passcode validation invalid counter", () => {
    expect(Hotp.validate({ passcode: code, secret, counter: 2 })).toBe(false);
  });

  test("invalid passcode", () => {
    expect(() =>
      Hotp.validate({ passcode: "123", secret, counter: 2 })
    ).toThrow("Invalid passcode");
  });
});
