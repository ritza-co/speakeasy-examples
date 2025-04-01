/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import * as components from "../components/index.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type UpdateCoffeeTypeRequest = {
  /**
   * The ID of the coffee type to operate on
   */
  typeId: number;
  coffeeType: components.CoffeeType;
};

/** @internal */
export const UpdateCoffeeTypeRequest$inboundSchema: z.ZodType<
  UpdateCoffeeTypeRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  type_id: z.number().int(),
  CoffeeType: components.CoffeeType$inboundSchema,
}).transform((v) => {
  return remap$(v, {
    "type_id": "typeId",
    "CoffeeType": "coffeeType",
  });
});

/** @internal */
export type UpdateCoffeeTypeRequest$Outbound = {
  type_id: number;
  CoffeeType: components.CoffeeType$Outbound;
};

/** @internal */
export const UpdateCoffeeTypeRequest$outboundSchema: z.ZodType<
  UpdateCoffeeTypeRequest$Outbound,
  z.ZodTypeDef,
  UpdateCoffeeTypeRequest
> = z.object({
  typeId: z.number().int(),
  coffeeType: components.CoffeeType$outboundSchema,
}).transform((v) => {
  return remap$(v, {
    typeId: "type_id",
    coffeeType: "CoffeeType",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace UpdateCoffeeTypeRequest$ {
  /** @deprecated use `UpdateCoffeeTypeRequest$inboundSchema` instead. */
  export const inboundSchema = UpdateCoffeeTypeRequest$inboundSchema;
  /** @deprecated use `UpdateCoffeeTypeRequest$outboundSchema` instead. */
  export const outboundSchema = UpdateCoffeeTypeRequest$outboundSchema;
  /** @deprecated use `UpdateCoffeeTypeRequest$Outbound` instead. */
  export type Outbound = UpdateCoffeeTypeRequest$Outbound;
}

export function updateCoffeeTypeRequestToJSON(
  updateCoffeeTypeRequest: UpdateCoffeeTypeRequest,
): string {
  return JSON.stringify(
    UpdateCoffeeTypeRequest$outboundSchema.parse(updateCoffeeTypeRequest),
  );
}

export function updateCoffeeTypeRequestFromJSON(
  jsonString: string,
): SafeParseResult<UpdateCoffeeTypeRequest, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => UpdateCoffeeTypeRequest$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'UpdateCoffeeTypeRequest' from JSON`,
  );
}
