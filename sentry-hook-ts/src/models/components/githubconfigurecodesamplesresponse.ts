/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import * as z from "zod";
import { safeParse } from "../../lib/schemas.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdkvalidationerror.js";
import {
  WorkflowDocument,
  WorkflowDocument$inboundSchema,
  WorkflowDocument$Outbound,
  WorkflowDocument$outboundSchema,
} from "./workflowdocument.js";

/**
 * A response to configure GitHub code samples
 */
export type GithubConfigureCodeSamplesResponse = {
  /**
   * A document referenced by a workflow
   */
  source: WorkflowDocument;
  /**
   * The URL of the code sample overlay registry
   */
  codeSampleOverlayRegistryURL: string;
  /**
   * The ID of the GitHub action that was dispatched
   */
  ghActionID?: string | undefined;
};

/** @internal */
export const GithubConfigureCodeSamplesResponse$inboundSchema: z.ZodType<
  GithubConfigureCodeSamplesResponse,
  z.ZodTypeDef,
  unknown
> = z.object({
  source: WorkflowDocument$inboundSchema,
  codeSampleOverlayRegistryURL: z.string(),
  ghActionID: z.string().optional(),
});

/** @internal */
export type GithubConfigureCodeSamplesResponse$Outbound = {
  source: WorkflowDocument$Outbound;
  codeSampleOverlayRegistryURL: string;
  ghActionID?: string | undefined;
};

/** @internal */
export const GithubConfigureCodeSamplesResponse$outboundSchema: z.ZodType<
  GithubConfigureCodeSamplesResponse$Outbound,
  z.ZodTypeDef,
  GithubConfigureCodeSamplesResponse
> = z.object({
  source: WorkflowDocument$outboundSchema,
  codeSampleOverlayRegistryURL: z.string(),
  ghActionID: z.string().optional(),
});

/**
 * @internal
 * @deprecated This namespace will be removed in future versions. Use schemas and types that are exported directly from this module.
 */
export namespace GithubConfigureCodeSamplesResponse$ {
  /** @deprecated use `GithubConfigureCodeSamplesResponse$inboundSchema` instead. */
  export const inboundSchema = GithubConfigureCodeSamplesResponse$inboundSchema;
  /** @deprecated use `GithubConfigureCodeSamplesResponse$outboundSchema` instead. */
  export const outboundSchema =
    GithubConfigureCodeSamplesResponse$outboundSchema;
  /** @deprecated use `GithubConfigureCodeSamplesResponse$Outbound` instead. */
  export type Outbound = GithubConfigureCodeSamplesResponse$Outbound;
}

export function githubConfigureCodeSamplesResponseToJSON(
  githubConfigureCodeSamplesResponse: GithubConfigureCodeSamplesResponse,
): string {
  return JSON.stringify(
    GithubConfigureCodeSamplesResponse$outboundSchema.parse(
      githubConfigureCodeSamplesResponse,
    ),
  );
}

export function githubConfigureCodeSamplesResponseFromJSON(
  jsonString: string,
): SafeParseResult<GithubConfigureCodeSamplesResponse, SDKValidationError> {
  return safeParse(
    jsonString,
    (x) =>
      GithubConfigureCodeSamplesResponse$inboundSchema.parse(JSON.parse(x)),
    `Failed to parse 'GithubConfigureCodeSamplesResponse' from JSON`,
  );
}
