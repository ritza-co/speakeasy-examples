/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type DeleteDriverRequest = {
  /**
   * The ID of the driver to delete
   */
  driverId: string;
};

/** @internal */
export const DeleteDriverRequest$inboundSchema: z.ZodType<
  DeleteDriverRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  driver_id: z.string(),
}).transform((v) => {
  return remap$(v, {
    "driver_id": "driverId",
  });
});

/** @internal */
export type DeleteDriverRequest$Outbound = {
  driver_id: string;
};

/** @internal */
export const DeleteDriverRequest$outboundSchema: z.ZodType<
  DeleteDriverRequest$Outbound,
  z.ZodTypeDef,
  DeleteDriverRequest
> = z.object({
  driverId: z.string(),
}).transform((v) => {
  return remap$(v, {
    driverId: "driver_id",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace DeleteDriverRequest$ {
  /** @deprecated use `DeleteDriverRequest$inboundSchema` instead. */
  export const inboundSchema = DeleteDriverRequest$inboundSchema;
  /** @deprecated use `DeleteDriverRequest$outboundSchema` instead. */
  export const outboundSchema = DeleteDriverRequest$outboundSchema;
  /** @deprecated use `DeleteDriverRequest$Outbound` instead. */
  export type Outbound = DeleteDriverRequest$Outbound;
}

export function deleteDriverRequestToJSON(
  deleteDriverRequest: DeleteDriverRequest,
): string {
  return JSON.stringify(
    DeleteDriverRequest$outboundSchema.parse(deleteDriverRequest),
  );
}

export function deleteDriverRequestFromJSON(
  jsonString: string,
): SafeParseResult<DeleteDriverRequest, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => DeleteDriverRequest$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'DeleteDriverRequest' from JSON`,
  );
}
