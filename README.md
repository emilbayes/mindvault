# `mindvault`

> Deterministic seeds from passphrases suitable for WetWare RAM (Read: the human brain)

## Usage

```js
var hash = require('mindvault')
var crypt = require('ssb-keys')
var generatePassphrase = require('eff-diceware-passphrase')

var appId = Buffer.alloc(hash.APP_ID_BYTES).fill('mindvault')
var salt = Buffer.from('john@example.com')
var passphrase = Buffer.from(generatePassphrase.entropy(100).join(' '))

var keyPair = crypt.generate('ed25519', hash(passphrase, salt, appId))

// Go crazy with your new key pair

```

## API

### `mindvault(passphrase, salt, [appId])`

`passphrase` must be a Buffer of arbitrary length, and is recommended to have
entropy beyond 100 bits.  
`salt` must be Buffer of arbitrary length. It ss used to partition the key
space, to prevent dictionary attacks and key collisions, and should therefore be
unique. One way to achieve this is to have users enter their email address as
email addresses are unique by definition.  
`appId` is optional, but must be a Buffer of length `mindvault.APP_ID_BYTES`.
Presently that's 32 bytes, and it is used as a key to the salt hashing algorithm
Blake2b. This will further partition the salt hash space, making key collisions
between different applications, with the same `passphrase` and `salt` practically
impossible.

## Install

```sh
npm install mindvault
```

## License

[ISC](LICENSE.md)
