/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { shortURLsCreate } from "../funcs/shortURLsCreate.js";
import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as components from "../models/components/index.js";
import * as operations from "../models/operations/index.js";
import { unwrapAsync } from "../types/fp.js";

export class ShortURLs extends ClientSDK {
  /**
   * Shorten a URL.
   */
  async create(
    request: operations.CreateRequest,
    options?: RequestOptions,
  ): Promise<components.ShortURL> {
    return unwrapAsync(shortURLsCreate(
      this,
      request,
      options,
    ));
  }
}
