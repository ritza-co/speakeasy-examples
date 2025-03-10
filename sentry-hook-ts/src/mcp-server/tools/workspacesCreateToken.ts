/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { workspacesCreateToken } from "../../funcs/workspacesCreateToken.js";
import * as operations from "../../models/operations/index.js";
import { formatResult, ToolDefinition } from "../tools.js";

const args = {
  request: operations.CreateWorkspaceTokenRequest$inboundSchema,
};

export const tool$workspacesCreateToken: ToolDefinition<typeof args> = {
  name: "workspaces_create-token",
  description: `Create a token for a particular workspace`,
  args,
  tool: async (client, args, ctx) => {
    const [result, apiCall] = await workspacesCreateToken(
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

    return formatResult(void 0, apiCall);
  },
};
