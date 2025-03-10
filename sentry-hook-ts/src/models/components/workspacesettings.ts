/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { remap as remap$ } from "../../lib/primitives.js";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";

export type WorkspaceSettings = {
  workspaceId: string;
  webhookUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

/** @internal */
export const WorkspaceSettings$inboundSchema: z.ZodType<
  WorkspaceSettings,
  z.ZodTypeDef,
  unknown
> = z.object({
  workspace_id: z.string(),
  webhook_url: z.string(),
  created_at: z.string().datetime({ offset: true }).transform(v => new Date(v)),
  updated_at: z.string().datetime({ offset: true }).transform(v => new Date(v)),
}).transform((v) => {
  return remap$(v, {
    "workspace_id": "workspaceId",
    "webhook_url": "webhookUrl",
    "created_at": "createdAt",
    "updated_at": "updatedAt",
  });
});

/** @internal */
export type WorkspaceSettings$Outbound = {
  workspace_id: string;
  webhook_url: string;
  created_at: string;
  updated_at: string;
};

/** @internal */
export const WorkspaceSettings$outboundSchema: z.ZodType<
  WorkspaceSettings$Outbound,
  z.ZodTypeDef,
  WorkspaceSettings
> = z.object({
  workspaceId: z.string(),
  webhookUrl: z.string(),
  createdAt: z.date().transform(v => v.toISOString()),
  updatedAt: z.date().transform(v => v.toISOString()),
}).transform((v) => {
  return remap$(v, {
    workspaceId: "workspace_id",
    webhookUrl: "webhook_url",
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace WorkspaceSettings$ {
  /** @deprecated use `WorkspaceSettings$inboundSchema` instead. */
  export const inboundSchema = WorkspaceSettings$inboundSchema;
  /** @deprecated use `WorkspaceSettings$outboundSchema` instead. */
  export const outboundSchema = WorkspaceSettings$outboundSchema;
  /** @deprecated use `WorkspaceSettings$Outbound` instead. */
  export type Outbound = WorkspaceSettings$Outbound;
}

export function workspaceSettingsToJSON(
  workspaceSettings: WorkspaceSettings,
): string {
  return JSON.stringify(
    WorkspaceSettings$outboundSchema.parse(workspaceSettings),
  );
}

export function workspaceSettingsFromJSON(
  jsonString: string,
): SafeParseResult<WorkspaceSettings, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) => WorkspaceSettings$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'WorkspaceSettings' from JSON`,
  );
}
