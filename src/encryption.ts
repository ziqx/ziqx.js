import SimpleCrypto from "simple-crypto-js";

export function encrypt(plainText: string, key: string): string | undefined {
  try {
    const simpleCrypto = new SimpleCrypto(key);
    return simpleCrypto.encrypt(plainText);
  } catch (error) {
    console.error("Error encrypting text:", error);
    return undefined;
  }
}

export function decrypt(cipherText: string, key: string): string | undefined {
  try {
    const simpleCrypto = new SimpleCrypto(key);
    return simpleCrypto.decrypt(cipherText).toString();
  } catch (error) {
    console.error("Error decrypting text:", error);
    return undefined;
  }
}
