import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommandInput,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  DeleteObjectCommandInput,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
  DeleteObjectCommandOutput,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * @interface ZiqxStorageConstructorParams
 * Parameters for the ZiqxStorage constructor.
 */
export interface ZiqxStorageConstructorParams {
  /**
   * Your Cloudflare Account ID.
   */
  accountId: string;
  /**
   * Your R2 Access Key ID.
   */
  accessKeyId: string;
  /**
   * Your R2 Secret Access Key.
   */
  secretAccessKey: string;
}

/**
 * @interface GetObjectOutputEnhanced
 * Extends the standard GetObjectCommandOutput to include a helper function
 * for converting the body stream to a string.
 */
export interface GetObjectOutputEnhanced extends GetObjectCommandOutput {
  /**
   * Asynchronously converts the response body (ReadableStream) to a string.
   * @returns {Promise<string>} A promise that resolves with the body content as a string.
   */
  bodyToString: () => Promise<string>;
}

/**
 * A client for interacting with Cloudflare R2 Storage.
 * This class provides a simplified interface for common object storage operations
 * like putting, getting, deleting, and listing objects, as well as generating
 * pre-signed URLs.
 */
export class ZiqxStorage {
  private client: S3Client;

  /**
   * Creates an instance of ZiqxStorage.
   * @param {ZiqxStorageConstructorParams} params - The credentials and account ID for R2.
   */
  constructor(params: ZiqxStorageConstructorParams) {
    const { accountId, accessKeyId, secretAccessKey } = params;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "accountId, accessKeyId, and secretAccessKey must be provided."
      );
    }

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
  }

  /**
   * Returns the underlying S3Client instance for advanced use cases.
   * @returns {S3Client} The configured S3Client instance.
   */
  getS3Client(): S3Client {
    return this.client;
  }

  /**
   * Uploads an object to an R2 bucket.
   * @param {PutObjectCommandInput} params - The parameters for the PutObject command, including Bucket, Key, and Body.
   * @returns {Promise<PutObjectCommandOutput>} A promise that resolves with the output of the command.
   */
  async putObject(
    params: PutObjectCommandInput
  ): Promise<PutObjectCommandOutput> {
    try {
      const command = new PutObjectCommand(params);
      const data = await this.client.send(command);
      return data;
    } catch (error: any) {
      console.error("Error putting object:", error);
      throw new Error(
        `Failed to put object ${params.Key} in bucket ${params.Bucket}: ${error.message}`
      );
    }
  }

  /**
   * Retrieves an object from an R2 bucket.
   * The returned object includes a `bodyToString()` helper to easily read the content.
   * @param {GetObjectCommandInput} params - The parameters for the GetObject command, including Bucket and Key.
   * @returns {Promise<GetObjectOutputEnhanced>} A promise that resolves with the object data and helper methods.
   */
  async getObject(
    params: GetObjectCommandInput
  ): Promise<GetObjectOutputEnhanced> {
    try {
      const command = new GetObjectCommand(params);
      const data = await this.client.send(command);

      // Enhance the output with a bodyToString helper
      const enhancedData: GetObjectOutputEnhanced = {
        ...data,
        bodyToString: async () => {
          if (data.Body) {
            // @ts-ignore - Body is a ReadableStream
            return data.Body.transformToString("utf-8");
          }
          return "";
        },
      };

      return enhancedData;
    } catch (error: any) {
      console.error("Error getting object:", error);
      throw new Error(
        `Failed to get object ${params.Key} from bucket ${params.Bucket}: ${error.message}`
      );
    }
  }

  /**
   * Deletes an object from an R2 bucket.
   * @param {DeleteObjectCommandInput} params - The parameters for the DeleteObject command, including Bucket and Key.
   * @returns {Promise<DeleteObjectCommandOutput>} A promise that resolves when the object is deleted.
   */
  async deleteObject(
    params: DeleteObjectCommandInput
  ): Promise<DeleteObjectCommandOutput> {
    try {
      const command = new DeleteObjectCommand(params);
      const data = await this.client.send(command);
      return data;
    } catch (error: any) {
      console.error("Error deleting object:", error);
      throw new Error(
        `Failed to delete object ${params.Key} from bucket ${params.Bucket}: ${error.message}`
      );
    }
  }

  /**
   * Lists objects within an R2 bucket.
   * @param {ListObjectsV2CommandInput} params - The parameters for the ListObjectsV2 command, including Bucket.
   * @returns {Promise<ListObjectsV2CommandOutput>} A promise that resolves with the list of objects.
   */
  async listObjects(
    params: ListObjectsV2CommandInput
  ): Promise<ListObjectsV2CommandOutput> {
    try {
      const command = new ListObjectsV2Command(params);
      const data = await this.client.send(command);
      return data;
    } catch (error: any) {
      console.error("Error listing objects:", error);
      throw new Error(
        `Failed to list objects in bucket ${params.Bucket}: ${error.message}`
      );
    }
  }

  /**
   * Generates a pre-signed URL for uploading an object (PUT).
   * @param {string} bucket - The name of the bucket.
   * @param {string} key - The key of the object.
   * @param {number} [expiresIn=3600] - The URL's validity duration in seconds. Defaults to 1 hour.
   * @returns {Promise<string>} A promise that resolves with the pre-signed URL.
   */
  async getSignedUrlForPut(
    bucket: string,
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({ Bucket: bucket, Key: key });
      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error: any) {
      console.error("Error getting signed URL for PUT:", error);
      throw new Error(`Failed to get signed URL for PUT: ${error.message}`);
    }
  }

  /**
   * Generates a pre-signed URL for retrieving an object (GET).
   * @param {string} bucket - The name of the bucket.
   * @param {string} key - The key of the object.
   * @param {number} [expiresIn=3600] - The URL's validity duration in seconds. Defaults to 1 hour.
   * @returns {Promise<string>} A promise that resolves with the pre-signed URL.
   */
  async getSignedUrlForGet(
    bucket: string,
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error: any) {
      console.error("Error getting signed URL for GET:", error);
      throw new Error(`Failed to get signed URL for GET: ${error.message}`);
    }
  }
}
