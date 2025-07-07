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
const isValidAuth: boolean = await auth.strictValidate("TOKEN");

// Check if token is valid (Won't verify signature)
const isTokenValid: boolean = auth.isTokenValid("TOKEN");
```

## Ziqx Storage

You can use storage utitlity function to run CRUD operation for file objects

> Under the hood we are using `Cloudflare R2` as the storage unit. If you don't have an account or bucket created please create before using this package for storage.

### Features

- Full CRUD: Create, Read, Delete, and List objects.
- Pre-signed URLs: Generate temporary, secure URLs for uploading and downloading files.
- Strongly Typed: Built with TypeScript for a better developer experience with autocompletion and type safety.
- Simplified Interface: A clean wrapper around the official AWS S3 SDK, tailored for Cloudflare R2.

### Usage

```ts
import { ZiqxStorage } from "ziqx";

const storage = new ZiqxStorage({
  accountId: "YOUR_CLOUDFLARE_ACCOUNT_ID",
  accessKeyId: "YOUR_R2_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_R2_SECRET_ACCESS_KEY",
});
```

#### Upload an Object

```ts
const response = await storage.putObject({
  Bucket: "my-bucket",
  Key: "hello.txt",
  Body: fileContent,
  ContentType: "text/plain",
});
```

#### Download an Object

```ts
const object = await storage.getObject({
  Bucket: "my-bucket",
  Key: "hello.txt",
});
```

### Listing Objects of bucket

```ts
const response = await storage.listObjects({
  Bucket: "my-bucket",
});
```

### Delete an Object

```ts
await storage.deleteObject({
  Bucket: "my-bucket",
  Key: "hello.txt",
});
```

### Get a Pre-signed URL to upload

```ts
const url = await storage.getSignedUrlForPut(
  "my-bucket",
  "new-image.jpg",
  3600 // URL expires in 1 hour (3600 seconds)
);
```

### Get a Pre-signed URL to download

```ts
const url = await storage.getSignedUrlForGet(
  "my-bucket",
  "private-document.pdf",
  600 // URL expires in 10 minutes (600 seconds)
);
```
