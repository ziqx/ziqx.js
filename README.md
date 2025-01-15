# Ziqx.js
All in one package to manage your [Ziqx](https://ziqx.cc) services

## Docs
Checkout the Documentation for more information
**[Ziqx Docs ⇗](https://ziqx.cc)**

## Ziqx Auth
```javascript

const auth = new ZiqxAuth();

//Login
auth.login("APP_ID"); // Acquire app ID from Ziqx Developer Console
// If you are testing in developer mode, add second param as "true"

// Validate Ziqx Token by Signature (Promise)
const isValidAuth:boolean = await auth.strictValidate("TOKEN");

// Check if token is valid (Won't verify signature)
const isTokenValid:boolean = auth.isTokenValid("TOKEN");

```