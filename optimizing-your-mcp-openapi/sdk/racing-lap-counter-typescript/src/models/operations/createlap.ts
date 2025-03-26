/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import * as components from "../components/index.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type CreateLapRequest = {
  /**
   * The ID of the driver
   */
  driverId: string;
  lapCreate: components.LapCreate;
};

/** @internal */
export const CreateLapRequest$inboundSchema: z.ZodType<
  CreateLapRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  driver_id: z.string(),
  LapCreate: components.LapCreate$inboundSchema,
}).transform((v) => {
  return remap$(v, {
    "driver_id": "driverId",
    "LapCreate": "lapCreate",
  });
});

/** @internal */
export type CreateLapRequest$Outbound = {
  driver_id: string;
  LapCreate: components.LapCreate$Outbound;
};

/** @internal */
export const CreateLapRequest$outboundSchema: z.ZodType<
  CreateLapRequest$Outbound,
  z.ZodTypeDef,
  CreateLapRequest
> = z.object({
  driverId: z.string(),
  lapCreate: components.LapCreate$outboundSchema,
}).transform((v) => {
  return remap$(v, {
    driverId: "driver_id",
    lapCreate: "LapCreate",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace CreateLapRequest$ {
  /** @deprecated use `CreateLapRequest$inboundSchema` instead. */
  export const inboundSchema = CreateLapRequest$inboundSchema;
  /** @deprecated use `CreateLapRequest$outboundSchema` instead. */
  export const outboundSchema = CreateLapRequest$outboundSchema;
  /** @deprecated use `CreateLapRequest$Outbound` instead. */
  export type Outbound = CreateLapRequest$Outbound;
}

export function createLapRequestToJSON(
  createLapRequest: CreateLapRequest,
): string {
  return JSON.stringify(
    CreateLapRequest$outboundSchema.parse(createLapRequest),
  );
}

export function createLapRequestFromJSON(
  jsonString: string,
): SafeParseResult<CreateLapRequest, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => CreateLapRequest$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'CreateLapRequest' from JSON`,
  );
}
