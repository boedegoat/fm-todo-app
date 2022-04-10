import CryptoJS from 'crypto-js'

export const cryptPassword = (password: string) => {
  return CryptoJS.AES.encrypt(password, process.env.PASS_SECRET).toString()
}

export const decryptPassword = (password: string) => {
  return CryptoJS.AES.decrypt(password, process.env.PASS_SECRET).toString(CryptoJS.enc.Utf8)
}
