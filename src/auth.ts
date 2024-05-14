export class ZiqxAuth {
  public login(appId: string) {
    const url = `https://account.ziqx.cc/?appId=${appId}`;
    if (typeof window !== "undefined") {
      window.location.href = url;
    } else {
      console.error("🔐Login failed: Unsupported environment");
    }
  }
  public async validate(token: string): Promise<boolean> {
    if (token) {
      const resp = await fetch(
        `https://api.ziqx.in/auth/validateToken.php?token=${token}`
      ).then(async (res) => {
        return await res.json();
      });
      if (resp && resp.status === "success") {
        return true;
      }
    }
    return false;
  }
}
