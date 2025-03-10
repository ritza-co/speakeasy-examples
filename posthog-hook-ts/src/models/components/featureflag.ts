/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";
import {
  WorkspaceFeatureFlag,
  WorkspaceFeatureFlag$inboundSchema,
  WorkspaceFeatureFlag$outboundSchema,
} from "./workspacefeatureflag.js";

/**
 * A feature flag is a key-value pair that can be used to enable or disable features.
 */
export type FeatureFlag = {
  /**
   * enum value workspace feature flag
   */
  featureFlag: WorkspaceFeatureFlag;
  trialEndsAt?: Date | null | undefined;
};

/** @internal */
export const FeatureFlag$inboundSchema: z.ZodType<
  FeatureFlag,
  z.ZodTypeDef,
  unknown
> = z.object({
  feature_flag: WorkspaceFeatureFlag$inboundSchema,
  trial_ends_at: z.nullable(
    z.string().datetime({ offset: true }).transform(v => new Date(v)),
  ).optional(),
}).transform((v) => {
  return remap$(v, {
    "feature_flag": "featureFlag",
    "trial_ends_at": "trialEndsAt",
  });
});

/** @internal */
export type FeatureFlag$Outbound = {
  feature_flag: string;
  trial_ends_at?: string | null | undefined;
};

/** @internal */
export const FeatureFlag$outboundSchema: z.ZodType<
  FeatureFlag$Outbound,
  z.ZodTypeDef,
  FeatureFlag
> = z.object({
  featureFlag: WorkspaceFeatureFlag$outboundSchema,
  trialEndsAt: z.nullable(z.date().transform(v => v.toISOString())).optional(),
}).transform((v) => {
  return remap$(v, {
    featureFlag: "feature_flag",
    trialEndsAt: "trial_ends_at",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace FeatureFlag$ {
  /** @deprecated use `FeatureFlag$inboundSchema` instead. */
  export const inboundSchema = FeatureFlag$inboundSchema;
  /** @deprecated use `FeatureFlag$outboundSchema` instead. */
  export const outboundSchema = FeatureFlag$outboundSchema;
  /** @deprecated use `FeatureFlag$Outbound` instead. */
  export type Outbound = FeatureFlag$Outbound;
}

export function featureFlagToJSON(featureFlag: FeatureFlag): string {
  return JSON.stringify(FeatureFlag$outboundSchema.parse(featureFlag));
}

export function featureFlagFromJSON(
  jsonString: string,
): SafeParseResult<FeatureFlag, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => FeatureFlag$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'FeatureFlag' from JSON`,
  );
}
