/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import * as components from "../components/index.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type UpdateOrderRequest = {
  /**
   * The ID of the order to operate on
   */
  orderId: number;
  coffeeOrderUpdate: components.CoffeeOrderUpdate;
};

/** @internal */
export const UpdateOrderRequest$inboundSchema: z.ZodType<
  UpdateOrderRequest,
  z.ZodTypeDef,
  unknown
> = z.object({
  order_id: z.number().int(),
  CoffeeOrderUpdate: components.CoffeeOrderUpdate$inboundSchema,
}).transform((v) => {
  return remap$(v, {
    "order_id": "orderId",
    "CoffeeOrderUpdate": "coffeeOrderUpdate",
  });
});

/** @internal */
export type UpdateOrderRequest$Outbound = {
  order_id: number;
  CoffeeOrderUpdate: components.CoffeeOrderUpdate$Outbound;
};

/** @internal */
export const UpdateOrderRequest$outboundSchema: z.ZodType<
  UpdateOrderRequest$Outbound,
  z.ZodTypeDef,
  UpdateOrderRequest
> = z.object({
  orderId: z.number().int(),
  coffeeOrderUpdate: components.CoffeeOrderUpdate$outboundSchema,
}).transform((v) => {
  return remap$(v, {
    orderId: "order_id",
    coffeeOrderUpdate: "CoffeeOrderUpdate",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace UpdateOrderRequest$ {
  /** @deprecated use `UpdateOrderRequest$inboundSchema` instead. */
  export const inboundSchema = UpdateOrderRequest$inboundSchema;
  /** @deprecated use `UpdateOrderRequest$outboundSchema` instead. */
  export const outboundSchema = UpdateOrderRequest$outboundSchema;
  /** @deprecated use `UpdateOrderRequest$Outbound` instead. */
  export type Outbound = UpdateOrderRequest$Outbound;
}

export function updateOrderRequestToJSON(
  updateOrderRequest: UpdateOrderRequest,
): string {
  return JSON.stringify(
    UpdateOrderRequest$outboundSchema.parse(updateOrderRequest),
  );
}

export function updateOrderRequestFromJSON(
  jsonString: string,
): SafeParseResult<UpdateOrderRequest, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => UpdateOrderRequest$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'UpdateOrderRequest' from JSON`,
  );
}
