import CryptoJS from 'crypto-js'

export function encryptToPayload(value: string) {
  const key = `${import.meta.env.VITE_APP_CRYPTO_KEY}`
  const salt = CryptoJS.lib.WordArray.random(256)
  const iv = CryptoJS.lib.WordArray.random(16)

  const keyCrypt = CryptoJS.PBKDF2(key, salt, {
    hasher: CryptoJS.algo.SHA512,
    keySize: 64 / 8,
    iterations: 999
  })

  const encrypted = CryptoJS.AES.encrypt(value, keyCrypt, { iv })

  const data = {
    ciphertext: CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
    salt: CryptoJS.enc.Hex.stringify(salt),
    iv: CryptoJS.enc.Hex.stringify(iv)
  }

  return JSON.stringify(data)
}

export function decryptToPayload(value: string) {
  const key = `${import.meta.env.VITE_APP_CRYPTO_KEY}`
  const obj_json = JSON.parse(value)

  const encrypted = obj_json.ciphertext
  const salt = CryptoJS.enc.Hex.parse(obj_json.salt)
  const iv = CryptoJS.enc.Hex.parse(obj_json.iv)

  const data = CryptoJS.PBKDF2(key, salt, {
    hasher: CryptoJS.algo.SHA512,
    keySize: 64 / 8,
    iterations: 999
  })

  const decrypted = CryptoJS.AES.decrypt(encrypted, data, { iv })

  return decrypted.toString(CryptoJS.enc.Utf8)
}
