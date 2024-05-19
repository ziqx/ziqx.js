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

//Validate Ziqx Token
const isTokenValid:boolean = await auth.validate("TOKEN");

```