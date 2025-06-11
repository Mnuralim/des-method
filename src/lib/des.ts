import CryptoJS from "crypto-js";

const DES_KEY = CryptoJS.enc.Utf8.parse(process.env.DES_KEY || "12345678");
const IV = CryptoJS.enc.Utf8.parse(process.env.DES_IV || "abcdefgh");

export function encryptDES(text: string): string {
  try {
    const encrypted = CryptoJS.DES.encrypt(text, DES_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return encrypted;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error encrypting text"
    );
  }
}

export function decryptDES(text: string): string {
  try {
    const decrypted = CryptoJS.DES.decrypt(text, DES_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error(error);
    return "";
  }
}
