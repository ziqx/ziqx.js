import { decrypt, encrypt } from "./encryption";

const TOKEN_KEY: string = "token";
export class AuthUtils {
  

  public decryptedToken(
    token?: string,
    tokenKey: string = TOKEN_KEY
  ): string | undefined {
    try {
      let tokenToDecrypt: string | undefined = token;
      if (!token) return undefined;
      return decrypt(token, token);
    } catch (error) {
      console.error("Error decrypting token:", error);
      return undefined;
    }
  }
}
