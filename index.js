'use strict'

var assert = require('assert')
var sodium = require('sodium').api

module.exports = function (passphrase, salt, appId) {
  appId = appId || Buffer.alloc(32)
  assert.ok(Buffer.isBuffer(passphrase), 'passphrase must be Buffer')
  assert.ok(Buffer.isBuffer(salt), 'salt must be Buffer')
  assert.ok(Buffer.isBuffer(appId), 'appId must be Buffer')
  assert.ok(appId.length === module.exports.APP_ID_BYTES, 'appId must be APP_ID_BYTES long (' + module.exports.APP_ID_BYTES + ')')

  var saltHash = sodium.crypto_generichash(
    sodium.crypto_pwhash_SALTBYTES,
    salt,
    appId
  )

  if (saltHash === undefined) throw new Error('Salt hashing was unsuccessful')

  var pwHash = Buffer.allocUnsafe(sodium.crypto_box_SEEDBYTES)
  var pwhashRes = sodium.crypto_pwhash(
    pwHash,
    passphrase,
    saltHash,
    sodium.crypto_pwhash_OPSLIMIT_SENSITIVE,
    sodium.crypto_pwhash_MEMLIMIT_SENSITIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  )

  if (pwhashRes === undefined) throw new Error('Passphrase hashing was unsuccessful')

  return pwHash
}

module.exports.APP_ID_BYTES = sodium.crypto_generichash_KEYBYTES
