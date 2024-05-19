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
  public async validate(token: string): Promise<boolean> {
    if (token) {
      try {
        const resp = await fetch(
          `https://api.ziqx.in/auth/validateToken.php?token=${token}`
        ).then(async (res) => {
          return await res.json();
        });
        if (resp && resp.status === "success") {
          return true;
        }
      } catch (error) {
        throw new Error("🔐Validation Failed: (Check Network)");
      }
    }
    return false;
  }
}
