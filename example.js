var hash = require('.')
var crypt = require('ssb-keys')
var generatePassphrase = require('eff-diceware-passphrase')

var appId = Buffer.alloc(hash.APP_ID_BYTES).fill('mindvault')
var salt = Buffer.from('john@example.com')
var passphrase = Buffer.from(generatePassphrase.entropy(100).join(' '))

var keyPair = crypt.generate('ed25519', hash(passphrase, salt, appId))

console.log(keyPair)
