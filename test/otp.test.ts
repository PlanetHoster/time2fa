import { describe, expect, test } from "@jest/globals";
import { Totp, generateConfig, generateSecret } from "../.build/main";

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
