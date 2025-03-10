/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { authGetAccessToken } from "../../funcs/authGetAccessToken.js";
import * as operations from "../../models/operations/index.js";
import { formatResult, ToolDefinition } from "../tools.js";

const args = {
  request: operations.GetAccessTokenRequest$inboundSchema,
};

export const tool$authGetAccessToken: ToolDefinition<typeof args> = {
  name: "auth_get-access-token",
  description: `Get or refresh an access token for the current workspace.`,
  args,
  tool: async (client, args, ctx) => {
    const [result, apiCall] = await authGetAccessToken(
      client,
      args.request,
      { fetchOptions: { signal: ctx.signal } },
    ).$inspect();

    if (!result.ok) {
      return {
        content: [{ type: "text", text: result.error.message }],
        isError: true,
      };
    }

    const value = result.value;

    return formatResult(value, apiCall);
  },
};
