const API_ROOT_URL = "https://api.ziqx.in/auth";

export class ZiqxAuth {
  public login(appId: string, isDev?: boolean) {
    const isDevQuery = isDev ? "&dev=1" : "";
    const url = `https://account.ziqx.cc/?appId=${appId}${isDevQuery}`;
    if (typeof window !== "undefined") {
      window.location.href = url;
    } else {
      console.error("🔐Login failed: Unsupported environment");
    }
  }

  /**
   * @deprecated This function is deprecated and will be removed in a future version.
   * Please use `strictValidate()` instead.
   */
  public async validate(token: string): Promise<boolean> {
    if (token) {
      try {
        const resp = await fetch(
          `${API_ROOT_URL}/validateToken.php?token=${token}`
        ).then(async (res) => {
          return await res.json();
        });
        if (resp && resp.status === "success") {
          return true;
        }
      } catch (error) {
        console.error("🔐 Validation failed: ", error);
        return false;
      }
    }
    return false;
  }

  public async strictValidate(token: string): Promise<boolean> {
    if (token) {
      try {
        const resp = await fetch(
          `${API_ROOT_URL}/validateToken.php?token=${token}`
        ).then(async (res) => {
          return await res.json();
        });
        if (resp && resp.status === "success") {
          return true;
        }
      } catch (error) {
        console.error("🔐 Validation failed: ", error);
        return false;
      }
    }
    return false;
  }

  static isTokenValid(token: string): boolean {
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    try {
      const payload = JSON.parse(atob(parts[1]));

      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.error("Token has expired.");
        return false;
      }

      if (payload.iss !== "ziqx.cc") {
        console.error("Invalid issuer.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  }
}
