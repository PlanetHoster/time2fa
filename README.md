[![Build & test](https://github.com/PlanetHoster/time2fa/actions/workflows/build.yml/badge.svg?branch=main&event=push)](https://github.com/PlanetHoster/time2fa/actions/workflows/build.yml) [![npm](https://img.shields.io/npm/v/time2fa?label=time2fa%40npm)](https://www.npmjs.com/package/time2fa)

![Time2fa](https://github.com/PlanetHoster/time2fa/blob/main/doc/logo.png?raw=true)

A comprehensive Node.js package that simplifies the implementation of One-Time Password (OTP) authentication using HMAC-based One-Time Password (HOTP) and Time-based One-Time Password (TOTP) algorithms.

## Features

- Support both HOTP and TOTP algorithms
- Easy-to-use API for generating and verifying OTPs
- Customizable OTP length, counters and time window
- Supports various hashing algorithms (SHA-1, SHA-256, SHA-512)
- Compatible with popular OTP generators like Google Authenticator and Authy

## Installation

Install the package using NPM:

```bash
npm i --save time2fa
```

## Usage/Examples

### TOTP

#### Generate key

```javascript
// Import Totp
import { Totp } from "time2fa";

const key = Totp.generateKey({ issuer: "N0C", user: "johndoe@n0c.com" });

console.log(key);

// GenerateKey {
//   issuer: 'N0C',
//   user: 'johndoe@n0c.com',
//   config: { algo: 'sha1', digits: 6, period: 30, secretSize: 10 },
//   secret: 'ABCDEFGHIJKLMN12',
//   url: 'otpauth://totp/N0C:johndoe%40n0c.com?issuer=N0C&period=30&secret=ABCDEFGHIJKLMN12'
// }
```

#### Validate passcode

```javascript
// Import Totp
import { Totp } from "time2fa";

const valid = Totp.validate({ passcode: "123456", secret: "ABCDEFGHIJKLMN12" });

console.log(valid);

// true || false
```

#### Generate passcodes

```javascript
// Import Totp, and generateConfig for default configuration
import { Totp, generateConfig } from "time2fa";

const config = generateConfig();
const codes = Totp.generatePasscodes({ secret: "ABCDEFGHIJKLMN12" }, config);

console.log(codes);

// [ 123456 ]
```

#### QRCode generation

You must use an external library. For the example below we use [qrcode](https://github.com/soldair/node-qrcode).

```javascript
// Import Totp and qrcode
import { Totp } from "time2fa";
import * as qrcode from "qrcode";

const key = Totp.generateKey({ issuer: "N0C", user: "johndoe@n0c.com" });

console.log(key);

// GenerateKey {
//   issuer: 'N0C',
//   user: 'johndoe@n0c.com',
//   config: { algo: 'sha1', digits: 6, period: 30, secretSize: 10 },
//   secret: 'ABCDEFGHIJKLMN12',
//   url: 'otpauth://totp/N0C:johndoe%40n0c.com?issuer=N0C&period=30&secret=ABCDEFGHIJKLMN12'
// }

qrcode.toDataURL(key.url, (err, url) => {
  console.log(url); // Returns a Data URI containing a representation of the QR Code image.
});
```

### HOTP

#### Generate Passcode

```javascript
// Import Hotp, and generateConfig for default configuration and generateSecret
import { Hotp, generateConfig, generateSecret } from "time2fa";

const config = generateConfig();
const secret = generateSecret();

const code = Hotp.generatePasscode({ secret, counter: 1 }, config);

console.log(code);

// 123456
```

#### Validate passcode

```javascript
// Import Hotp
import { Hotp } from "time2fa";

const valid = Hotp.validate({
  passcode: "123456",
  secret: "ABCDEFGHIJKLMN12",
  counter: 1,
});

console.log(valid);

// true || false
```

### Helpers

#### generateConfig()

Generate default configuration

```javascript
// Import generateConfig
import { generateConfig } from "time2fa";

const config = generateConfig();

console.log(config);

// { algo: 'sha1', digits: 6, period: 30, secretSize: 10 }
```

#### generateSecret()

Only support base32 at the moment

```javascript
// Import generateSecret
import { generateSecret } from "time2fa";

const secret = generateSecret();

console.log(secret);

// ABCDEFGHIJKLMN12
```

#### generateUrl()

```javascript
// Import generateSecret
import { generateUrl } from "time2fa";

const url = generateUrl({
  issuer: "N0C",
  user: "johndoe@n0c.com",
  secret: "ABCDEFGHIJKLMN12",
});

console.log(url);

// otpauth://totp/N0C:johndoe%40n0c.com?issuer=N0C&period=30&secret=ABCDEFGHIJKLMN12
```

#### generateBackupCodes()

Backup code should only be used once

```javascript
// Import generateBackupCodes
import { generateBackupCodes } from "time2fa";

const backupCodes = generateBackupCodes();

console.log(backupCodes);

// [
//   '810550', '236884',
//   '979342', '815504',
//   '835313', '529942',
//   '263100', '882025',
//   '204896', '516248'
// ]
```

## Documentation

### Functions

#### Helpers

generateConfig(config?: [TotpConfig](#TotpConfig)): `ValidTotpConfig`

generateSecret(secretSize: number = DEFAULT_TOTP_SECRET_SIZE): `string`

generateBackupCodes(numCodes = 10, codeLength = DEFAULT_TOTP_DIGITS): `string[]`

generateUrl(options: [UrlOptions](#UrlOptions), config: [ValidTotpConfig](#ValidTotpConfig)): `string`

#### Totp

Totp.generateKey(options: [TotpOptions](#TotpOptions), config?: [TotpConfig](#TotpConfig)): `GenerateKey`

Totp.generatePasscodes(options: [TotpCode](#TotpCode), config: [ValidTotpConfig](#ValidTotpConfig)): `string[]`

Totp.validate(options: [TotpValidateOptions](#TotpValidateOptions), config?: [TotpConfig](#TotpConfig)): `boolean`

#### Hotp

Hotp.generatePasscode(options: [HotpCode](#HotpCode), config: [ValidTotpConfig](#ValidTotpConfig)): `string`

Hotp.validate(options: [HotpValidateOptions](#HotpValidateOptions), config?: [TotpConfig](#TotpConfig)): `boolean`

### Interfaces / Parameters

#### `TotpConfig`

| Parameter    | Type         | default | Description                                   |
| :----------- | :----------- | :------ | --------------------------------------------- |
| `secretSize` | `number`     | 10      | **Optional** - Secret size                    |
| `period`     | `number`     | 30      | **Optional** - Period of time                 |
| `digits`     | `number`     | 6       | **Optional**- Code length                     |
| `algo`       | `Algorithms` | sha1    | **Optional** - 'sha1' \| 'sha256' \| 'sha512' |

#### `ValidTotpConfig`

| Parameter    | Type         | default | Description                                   |
| :----------- | :----------- | :------ | --------------------------------------------- |
| `secretSize` | `number`     | -       | **Required** - Secret size                    |
| `period`     | `number`     | -       | **Required** - Period of time                 |
| `digits`     | `number`     | -       | **Required**- Code length                     |
| `algo`       | `Algorithms` | -       | **Required** - 'sha1' \| 'sha256' \| 'sha512' |

#### `TotpOptions`

| Parameter | Type     | default | Description                |
| :-------- | :------- | :------ | -------------------------- |
| `issuer`  | `string` | -       | **Required** - Issuer name |
| `user`    | `string` | -       | **Required** - Username    |

#### `UrlOptions`

| Parameter | Type     | default | Description                |
| :-------- | :------- | :------ | -------------------------- |
| `issuer`  | `string` | -       | **Required** - Issuer name |
| `user`    | `string` | -       | **Required** - Username    |
| `secret`  | `string` | -       | **Required** - Secret      |

#### `TotpCode`

| Parameter | Type     | default | Description                   |
| :-------- | :------- | :------ | ----------------------------- |
| `secret`  | `string` | -       | **Required** - Secret         |
| `drift`   | `number` | 0       | **Optional** - Time tolerance |

#### `TotpValidateOptions`

| Parameter  | Type     | default | Description                             |
| :--------- | :------- | :------ | --------------------------------------- |
| `passcode` | `string` | -       | **Required** - The passcode to validate |
| `secret`   | `string` | -       | **Required** - Secret                   |
| `drift`    | `number` | 0       | **Optional** - Time tolerance           |

#### `HotpCode`

| Parameter | Type     | default | Description                         |
| :-------- | :------- | :------ | ----------------------------------- |
| `secret`  | `string` | -       | **Required** - Secret               |
| `counter` | `number` | -       | **Required** - Custom counter value |

#### `HotpValidateOptions`

| Parameter  | Type     | default | Description                             |
| :--------- | :------- | :------ | --------------------------------------- |
| `passcode` | `string` | -       | **Required** - The passcode to validate |
| `secret`   | `string` | -       | **Required** - Secret                   |
| `counter`  | `number` | -       | **Required** - Custom counter value     |

## Contributing

All PR's are welcome!

## Running Tests

To run tests, run the following command

```bash
npm run test
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
