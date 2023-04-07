
# Time2fa

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
import { Totp } from 'time2fa';

const key = Totp.generateKey({issuer: "N0C", user: "johndoe@n0c.com"});

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
import { Totp } from 'time2fa';

const valid = Totp.validate({passcode: '123456', secret: "ABCDEFGHIJKLMN12"})

console.log(valid)

// true || false
```

#### Generate passcodes
```javascript
// Import Totp
import { Totp } from 'time2fa';

const codes = Totp.generatePasscodes({secret: "ABCDEFGHIJKLMN12"})

console.log(codes)

// [ 123456 ]
```

### HOTP

