/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type LapCreate = {
  /**
   * Lap time in seconds
   */
  lapTime: number;
  /**
   * Name of the track where the lap was recorded
   */
  track: string;
};

/** @internal */
export const LapCreate$inboundSchema: z.ZodType<
  LapCreate,
  z.ZodTypeDef,
  unknown
> = z.object({
  lap_time: z.number(),
  track: z.string(),
}).transform((v) => {
  return remap$(v, {
    "lap_time": "lapTime",
  });
});

/** @internal */
export type LapCreate$Outbound = {
  lap_time: number;
  track: string;
};

/** @internal */
export const LapCreate$outboundSchema: z.ZodType<
  LapCreate$Outbound,
  z.ZodTypeDef,
  LapCreate
> = z.object({
  lapTime: z.number(),
  track: z.string(),
}).transform((v) => {
  return remap$(v, {
    lapTime: "lap_time",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace LapCreate$ {
  /** @deprecated use `LapCreate$inboundSchema` instead. */
  export const inboundSchema = LapCreate$inboundSchema;
  /** @deprecated use `LapCreate$outboundSchema` instead. */
  export const outboundSchema = LapCreate$outboundSchema;
  /** @deprecated use `LapCreate$Outbound` instead. */
  export type Outbound = LapCreate$Outbound;
}

export function lapCreateToJSON(lapCreate: LapCreate): string {
  return JSON.stringify(LapCreate$outboundSchema.parse(lapCreate));
}

export function lapCreateFromJSON(
  jsonString: string,
): SafeParseResult<LapCreate, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => LapCreate$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'LapCreate' from JSON`,
  );
}
