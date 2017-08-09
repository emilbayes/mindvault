'use strict'

var assert = require('nanoassert')
var sodium = require('sodium-native')

module.exports = hash
module.exports.APP_ID_BYTES = sodium.crypto_generichash_KEYBYTES
module.exports.BYTES = sodium.crypto_box_SEEDBYTES

function hash (out, passphrase, salt, appId, opts) {
  /* passphrase, sat, appId, [opts] */
  if (!Buffer.isBuffer(appId) && opts === null) {
    opts = appId
    appId = salt
    salt = passphrase
    passphrase = out
    out = Buffer.allocUnsafe(module.exports.BYTES)
  }

  assert(Buffer.isBuffer(out), 'out must be Buffer')
  assert(Buffer.isBuffer(passphrase), 'passphrase must be Buffer')
  assert(Buffer.isBuffer(salt), 'salt must be Buffer')

  // Init app id
  appId = appId || Buffer.alloc(module.exports.APP_ID_BYTES)
  assert(Buffer.isBuffer(appId), 'appId must be Buffer')
  assert(appId.length === module.exports.APP_ID_BYTES, 'appId must be APP_ID_BYTES long (' + module.exports.APP_ID_BYTES + ')')

  // Init opts
  opts = opts || {}

  if (opts.memlimit == null) opts.memlimit = sodium.crypto_pwhash_MEMLIMIT_SENSITIVE
  assert(typeof opts.memlimit === 'number', 'opts.memlimit must be number')
  assert(opts.memlimit >= sodium.crypto_pwhash_MEMLIMIT_MIN, 'opts.memlimit must be at least (' + sodium.crypto_pwhash_MEMLIMIT_MIN + ')')
  assert(opts.memlimit <= sodium.crypto_pwhash_MEMLIMIT_MAX, 'opts.memlimit must be at least (' + sodium.crypto_pwhash_MEMLIMIT_MAX + ')')

  if (opts.opslimit == null) opts.opslimit = sodium.crypto_pwhash_OPSLIMIT_SENSITIVE
  assert(typeof opts.opslimit === 'number', 'opts.opslimit must be number')
  assert(opts.opslimit >= sodium.crypto_pwhash_OPSLIMIT_MIN, 'opts.opslimit must be at least (' + sodium.crypto_pwhash_OPSLIMIT_MIN + ')')
  assert(opts.opslimit <= sodium.crypto_pwhash_OPSLIMIT_MAX, 'opts.opslimit must be at least (' + sodium.crypto_pwhash_OPSLIMIT_MAX + ')')


  var saltHash = Buffer.allocUnsafe(sodium.crypto_pwhash_SALTBYTES)
  sodium.crypto_generichash(
    saltHash,
    salt,
    appId
  )

  sodium.crypto_pwhash(
    out,
    passphrase,
    saltHash,
    opts.opslimit,
    opts.memlimit,
    sodium.crypto_pwhash_ALG_DEFAULT
  )

  return out
}
